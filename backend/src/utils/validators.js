export const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(String(phone).replace(/\D/g, ''));
};

export const validateAadhaar = (aadhaar) => {
  const aadhaarRegex = /^[0-9]{12}$/;
  return aadhaarRegex.test(String(aadhaar));
};

export const validatePAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(String(pan).toUpperCase());
};

export const validateGST = (gst) => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(String(gst).toUpperCase());
};

export const validateIFSC = (ifsc) => {
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(String(ifsc).toUpperCase());
};

export const validateBankAccount = (accountNumber) => {
  const accountRegex = /^[0-9]{9,18}$/;
  return accountRegex.test(String(accountNumber));
};

export const sanitizeClientData = (data) => {
  const sanitized = { ...data };

  if (sanitized.phone) {
    sanitized.phone = String(sanitized.phone).replace(/\D/g, '');
  }

  if (sanitized.aadhaarNumber) {
    sanitized.aadhaarNumber = String(sanitized.aadhaarNumber).replace(/\D/g, '');
  }

  if (sanitized.panNumber) {
    sanitized.panNumber = String(sanitized.panNumber).toUpperCase();
  }

  if (sanitized.gstin) {
    sanitized.gstin = String(sanitized.gstin).toUpperCase();
  }

  if (sanitized.email) {
    sanitized.email = String(sanitized.email).toLowerCase();
  }

  return sanitized;
};
