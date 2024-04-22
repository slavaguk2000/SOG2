import React, { PropsWithChildren, useMemo, useState } from 'react';

import { presentationOverflowPercentage } from '../../constants/behaviorConstants';
import { useMainScreenRatio } from '../mainScreenRatioProvider';
import { PresentationData, SegmentationData } from '../types';

import { PresentationContext } from './PresentationContext';

interface PresentationProviderProps {
  id?: string;
}

interface Session {
  addEventListener: (title: string, event: { data: string }) => void;
  send: (message: string) => void;
}

enum Commands {
  setText = 'setText',
  setSegmentation = 'setSegmentation',
}

const presUrls = ['receiver/index.html'];

const setTextInSession = (session: Session, text: string, location: string) => {
  session.send(JSON.stringify({ command: Commands.setText, text, location }));
};

const setSegmentationInSession = (session: Session, { screensCount, currentScreen }: SegmentationData) => {
  session.send(
    JSON.stringify({
      command: Commands.setSegmentation,
      screensCount,
      currentScreen,
      overflow: presentationOverflowPercentage,
    }),
  );
};

export const PresentationProvider = ({ children }: PropsWithChildren<PresentationProviderProps>) => {
  const [session, setSession] = useState<Session | null>(null);
  const [presentationData, setPresentationData] = useState<PresentationData | null>(null);
  const [segmentationData, setSegmentationData] = useState<SegmentationData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [presentationRequestAvailability, setPresentationRequestAvailability] = useState<boolean | undefined>(
    undefined,
  );

  const presentationRequest = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    const request = new PresentationRequest(presUrls);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigator.presentation.defaultRequest = request;

    request
      .getAvailability()
      .then((availability: Record<string, unknown>) => {
        setPresentationRequestAvailability(Boolean(availability));
        availability.onchange = () => {
          setPresentationRequestAvailability(Boolean(availability));
        };
      })
      .catch(() => {
        setPresentationRequestAvailability(false);
      });

    return request;
  }, []);

  const setText = async (text: string, location: string) => {
    if (session) {
      setTextInSession(session, text, location);
    }
    setPresentationData({ text, title: location });
    setSegmentationData(null);
  };

  const { proposeNewRatio } = useMainScreenRatio();

  const captureTextScreen = () => {
    if (!session) {
      presentationRequest
        .start()
        .then((newSession: Session) => {
          setSession(newSession);

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          newSession.addEventListener('message', (event) => {
            let message = event.data;
            try {
              message = JSON.parse(event.data);
            } catch {}
            if (message.message === 'Connected') {
              proposeNewRatio(message.data.width / message.data.height);
              console.log(message.data);
              if (presentationData?.text && presentationData?.title) {
                setTextInSession(newSession, presentationData.text, presentationData.title);
              }
              if (segmentationData) {
                setSegmentationInSession(newSession, segmentationData);
              }
            } else {
              console.log('Received echo:', event.data);
            }
          });
        })
        .catch((err: unknown) => console.log(err));
    }
  };

  const releaseTextScreen = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    session?.terminate();
    setSession(null);
  };

  const setSegmentation = (newSegmentationData: SegmentationData) => {
    if (session) {
      setSegmentationInSession(session, newSegmentationData);
    }
    setSegmentationData(newSegmentationData);
  };

  return (
    <PresentationContext.Provider
      value={{
        setText,
        setSegmentation,
        captureTextScreen,
        releaseTextScreen,
        validSession: Boolean(session),
      }}
    >
      <div>{children}</div>
    </PresentationContext.Provider>
  );
};
