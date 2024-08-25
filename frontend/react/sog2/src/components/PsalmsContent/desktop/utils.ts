export const openChordEditor = (psalmId: string) => {
  const url = `/psalms/chords-edit?psalmId=${psalmId}`;
  window.open(url, '_blank');
};
