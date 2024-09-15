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

const presUrls = [process.env.REACT_APP_TEMPORARY_SEND_ACTIVE_SLIDE ? '/active-slide' : 'receiver/index.html'];
const presChordsUrls = ['/active-psalm/chords'];

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
  const [textSession, setTextSession] = useState<Session | null>(null);
  const [chordSession, setChordSession] = useState<Session | null>(null);
  const [presentationData, setPresentationData] = useState<PresentationData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [presentationTextRequestAvailability, setPresentationTextRequestAvailability] = useState<boolean | undefined>(
    undefined,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [presentationChordsRequestAvailability, setPresentationChordsRequestAvailability] = useState<
    boolean | undefined
  >(undefined);

  const presentationTextRequest = useMemo(() => {
    if (!('PresentationRequest' in window)) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    const request = new PresentationRequest(presUrls);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigator.presentation.defaultRequest = request;

    request
      .getAvailability()
      .then((availability: Record<string, unknown>) => {
        setPresentationTextRequestAvailability(Boolean(availability));
        availability.onchange = () => {
          setPresentationTextRequestAvailability(Boolean(availability));
        };
      })
      .catch(() => {
        setPresentationTextRequestAvailability(false);
      });

    return request;
  }, []);

  const presentationChordRequest = useMemo(() => {
    if (!('PresentationRequest' in window)) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-ts-comment
    // @ts-ignore
    const request = new PresentationRequest(presChordsUrls);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigator.presentation.defaultRequest = request;

    request
      .getAvailability()
      .then((availability: Record<string, unknown>) => {
        setPresentationChordsRequestAvailability(Boolean(availability));
        availability.onchange = () => {
          setPresentationChordsRequestAvailability(Boolean(availability));
        };
      })
      .catch(() => {
        setPresentationChordsRequestAvailability(false);
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
    if (textSession) {
      setTextInSession(textSession, text, location, currentLastUp ?? false, undefined, multiScreenShow ?? false);
    }
    setPresentationData({ text, title: location, multiScreenShow });
  };

  const captureChordScreen = () => {
    if (!chordSession) {
      presentationChordRequest
        .start()
        .then((newSession: Session) => {
          setChordSession(newSession);

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          newSession.addEventListener('message', (event) => {
            let message = event.data;
            try {
              message = JSON.parse(event.data);
            } catch {}
            console.log('Received echo:', message);
          });
        })
        .catch((err: unknown) => console.error(err));
    }
  };

  const releaseTextScreen = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    textSession?.terminate();
    setTextSession(null);
  };

  const captureTextScreen = () => {
    if (!textSession) {
      presentationTextRequest
        .start()
        .then((newSession: Session) => {
          setTextSession(newSession);

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
        .catch((err: unknown) => console.error(err));
    }
  };

  const releaseChordScreen = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    chordSession?.terminate();
    setChordSession(null);
  };

  useEffect(() => {
    if (textSession && currentScreen !== undefined) {
      setScreenInSession(textSession, currentScreen);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScreen]);

  return (
    <PresentationContext.Provider
      value={{
        setText,
        captureTextScreen,
        releaseTextScreen,
        validTextSession: Boolean(textSession),
        captureChordScreen,
        releaseChordScreen,
        validChordSession: Boolean(chordSession),
      }}
    >
      <div>{children}</div>
    </PresentationContext.Provider>
  );
};
