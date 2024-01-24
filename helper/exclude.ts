const exclude = (data: object | null, keys: string[]) => {
  if (!data) {
    return data;
  }
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => !keys.includes(key)),
  );
};

export { exclude };
