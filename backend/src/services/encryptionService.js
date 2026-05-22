import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

export const encrypt = (text, encryptionKey, encryptionIV) => {
  if (!text) return null;

  const key = Buffer.from(encryptionKey, 'hex');
  const iv = Buffer.from(encryptionIV, 'hex');

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(String(text), 'utf-8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
};

export const decrypt = (encryptedText, encryptionKey, encryptionIV) => {
  if (!encryptedText) return null;

  try {
    const key = Buffer.from(encryptionKey, 'hex');
    const iv = Buffer.from(encryptionIV, 'hex');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    return null;
  }
};
