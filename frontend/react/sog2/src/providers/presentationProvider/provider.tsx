import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';

import { useMainScreenSegmentationData } from '../MainScreenSegmentationDataProvider';
import { PresentationData } from '../types';

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
  scrollToScreen = 'scrollToScreen',
}

enum ScreenMessages {
  Connected = 'Connected',
  MultiScreenPreviewData = 'MultiScreenPreviewData',
}

const presUrls = ['receiver/index.html'];

const setTextInSession = (
  session: Session,
  text: string,
  location: string,
  lastUp: boolean,
  currentScreen?: number,
  multiScreenShow?: boolean,
) => {
  session.send(JSON.stringify({ command: Commands.setText, text, location, lastUp, currentScreen, multiScreenShow }));
};

const setScreenInSession = (session: Session, newScreen: number) => {
  session.send(
    JSON.stringify({
      command: Commands.scrollToScreen,
      newScreen,
    }),
  );
};

export const PresentationProvider = ({ children }: PropsWithChildren<PresentationProviderProps>) => {
  const [session, setSession] = useState<Session | null>(null);
  const [presentationData, setPresentationData] = useState<PresentationData | null>(null);
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

  const { proposeNewScreenSize, proposePreviewScreensData, previewScreensData, resetScreens, lastUp } =
    useMainScreenSegmentationData();

  const currentScreen = previewScreensData?.currentScreen;

  const setText = async (
    text: string,
    location: string,
    { currentLastUp, multiScreenShow }: { currentLastUp?: boolean; multiScreenShow?: boolean } = {},
  ) => {
    resetScreens();
    if (session) {
      setTextInSession(session, text, location, currentLastUp ?? false, undefined, multiScreenShow ?? false);
    }
    setPresentationData({ text, title: location, multiScreenShow });
  };

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
            if (message.message === ScreenMessages.Connected) {
              proposeNewScreenSize({ width: message.data.width, height: message.data.height });
              if (presentationData?.text && presentationData?.title) {
                setTextInSession(
                  newSession,
                  presentationData.text,
                  presentationData.title,
                  lastUp,
                  currentScreen,
                  presentationData.multiScreenShow,
                );
              }
            } else if (message.message === ScreenMessages.MultiScreenPreviewData) {
              const { fontSize, screensCount, viewHeight, viewWidth, overlay, currentScreen } = message;
              proposePreviewScreensData({
                fontSize,
                screensCount,
                viewHeight,
                viewWidth,
                overlay,
                currentScreen,
              });
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

  useEffect(() => {
    if (session && currentScreen !== undefined) {
      setScreenInSession(session, currentScreen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen]);

  return (
    <PresentationContext.Provider
      value={{
        setText,
        captureTextScreen,
        releaseTextScreen,
        validSession: Boolean(session),
      }}
    >
      <div>{children}</div>
    </PresentationContext.Provider>
  );
};
