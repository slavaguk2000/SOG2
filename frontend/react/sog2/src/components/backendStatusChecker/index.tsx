import React, { PropsWithChildren, useEffect, useState } from 'react';

import { CircularProgress } from '@mui/material';

interface BackendStatusCheckerProps extends PropsWithChildren {
  isWebSocketConnected: () => boolean;
}

const BackendStatusChecker = ({ children, isWebSocketConnected }: BackendStatusCheckerProps) => {
  const [backendOnline, setBackendOnline] = useState(false);

  useEffect(() => {
    let timeoutId: null | number = null;

    const checkConnection = () => {
      const connectionStatus = isWebSocketConnected();

      setBackendOnline(connectionStatus);

      timeoutId = setTimeout(checkConnection, 1000) as unknown as number;
    };

    checkConnection();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isWebSocketConnected]);

  return backendOnline ? children : <CircularProgress />;
};

export default BackendStatusChecker;
