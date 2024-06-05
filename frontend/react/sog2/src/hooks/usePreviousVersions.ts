import { useCallback, useEffect, useMemo, useState } from 'react';

interface PreviousVersions {
  versionsArray: string[];
  currentVersion: number;
}

const usePreviousVersions = <T>(initialData: T, onUpdate: (newVersion: T) => void) => {
  const initialPreviousVersionsState = useMemo(
    () => ({
      versionsArray: [JSON.stringify(initialData)],
      currentVersion: 0,
    }),
    [initialData],
  );

  const [previousVersions, setPreviousVersions] = useState<PreviousVersions>(initialPreviousVersionsState);

  const handleAddNewVersion = (newVersion: Record<string, unknown>) => {
    setPreviousVersions((prev) => {
      const cutPreviousVersions = prev.currentVersion >= 0 ? prev.versionsArray.slice(0, prev.currentVersion + 1) : [];

      return {
        versionsArray: [...cutPreviousVersions, JSON.stringify(newVersion)],
        currentVersion: cutPreviousVersions.length,
      };
    });
  };

  const handleUndo = useCallback(() => {
    setPreviousVersions((prev) => {
      if (prev.currentVersion && prev.versionsArray.length) {
        const newCurrentVersion = Math.max(0, Math.min(prev.currentVersion - 1, prev.versionsArray.length - 1));

        onUpdate(JSON.parse(prev.versionsArray[newCurrentVersion]));

        return {
          ...prev,
          currentVersion: newCurrentVersion,
        };
      }

      return prev;
    });
  }, [onUpdate]);

  const handleRedo = useCallback(() => {
    setPreviousVersions((prev) => {
      if (prev.currentVersion < prev.versionsArray.length - 1) {
        const newCurrentVersion = prev.currentVersion + 1;

        onUpdate(JSON.parse(prev.versionsArray[newCurrentVersion]));

        return {
          ...prev,
          currentVersion: newCurrentVersion,
        };
      }

      return prev;
    });
  }, [onUpdate]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.code === 'KeyZ') {
        event.preventDefault();
        if (event.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleRedo, handleUndo]);

  const hasUndo = !!previousVersions.currentVersion;

  const hasRedo = previousVersions.currentVersion < previousVersions.versionsArray.length - 1;

  return {
    handleAddNewVersion,
    hasUndo,
    hasRedo,
  };
};

export default usePreviousVersions;
