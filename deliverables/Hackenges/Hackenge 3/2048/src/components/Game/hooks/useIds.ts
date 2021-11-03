let seqId = 1;

export const useIds = () => {
  const nextId = () => {
    return seqId++;
  };

  return [nextId];
};
