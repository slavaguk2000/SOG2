export const openChordEditor = (psalmId: string, transposition = 0) => {
  const url = `/psalms/chords-edit?psalmId=${psalmId}&transposition=${transposition}`;
  window.open(url, '_blank');
};
