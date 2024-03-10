export const checkIsExpired = (expiredAt: string) => {
  const today = new Date(Date.now()).toISOString();
  return today > expiredAt;
};
