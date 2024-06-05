import { useMemo, useState } from 'react';

interface PreviousVersions {
  versionsArray: string[];
  currentVersion: number;
}

const usePreviousVersions = (initialData: Record<string, unknown>) => {
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

  return {
    handleAddNewVersion,
  };
};

export default usePreviousVersions;
