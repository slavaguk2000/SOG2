import React, { PropsWithChildren, useMemo, useState } from 'react';

import { PresentationContext } from './PresentationContext';

interface PresentationProviderProps {
  id?: string;
}

// const presUrls = ['presentation.html'];
const presUrls = ['receiver/index.html'];

export const PresentationProvider = ({ children }: PropsWithChildren<PresentationProviderProps>) => {
  const [session, setSession] = useState(null);
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    session?.send(JSON.stringify({ text, location }));
  };

  const captureTextScreen = () => {
    if (!session) {
      presentationRequest
        .start()
        .then((newSession: { addEventListener: (title: string, event: { data: string }) => void }) => {
          setSession(newSession as unknown as null);

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          newSession.addEventListener('message', (event) => {
            console.log('Received echo:', event.data);
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
