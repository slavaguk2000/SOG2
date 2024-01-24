import React, { PropsWithChildren, useMemo, useState } from 'react';

import { PresentationData } from '../types';

import { PresentationContext } from './PresentationContext';

interface PresentationProviderProps {
  id?: string;
}

interface Session {
  addEventListener: (title: string, event: { data: string }) => void;
  send: (message: string) => void;
}

const presUrls = ['receiver/index.html'];

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

  const setText = async (text: string, location: string) => {
    session?.send(JSON.stringify({ text, location }));
    setPresentationData({ text, title: location });
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
            if (event.data === 'Connected') {
              if (presentationData?.text && presentationData?.title) {
                newSession.send(JSON.stringify({ text: presentationData.text, location: presentationData.title }));
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
