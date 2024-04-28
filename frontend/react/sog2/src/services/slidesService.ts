const compareSlideLocations = (locationA?: (string | number)[], locationB?: (string | number)[]): number => {
  if (!locationA?.length) {
    if (!locationB?.length) {
      return 0;
    }
    return -1;
  }

  if (!locationB?.length) {
    return 1;
  }

  if (locationA[0] < locationB[0]) {
    return -1;
  }

  if (locationA[0] > locationB[0]) {
    return 1;
  }

  return compareSlideLocations(locationA.slice(1), locationB.slice(1));
};

const makeSermonLocationComparable = (location?: string[]) =>
  location && [0, 1, 3].map((i) => (isNaN(Number(location[i])) ? location[i] : Number(location[i])));

export const compareSermonLocation = (locationA?: string[], locationB?: string[]): number => {
  if (locationA?.[0] && locationB?.[0] && locationA[0] !== locationB[0]) {
    return 1;
  }
  return compareSlideLocations(makeSermonLocationComparable(locationA), makeSermonLocationComparable(locationB));
};
