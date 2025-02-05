export const validatePhone = (phone: string) => {
  return /^[0-9]{10}$/.test(phone);
};
