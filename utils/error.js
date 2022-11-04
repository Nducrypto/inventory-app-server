export const createError = (status, message, ndu) => {
  const err = new Error();
  err.status = status;
  err.message = message;
  err.ndu = ndu;
  return err;
};
