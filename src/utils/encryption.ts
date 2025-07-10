import crypto from "crypto";
import "dotenv/config";

const ENCRYPTION_SECRET = process.env.KEY_SECRET!; // Put this in .env

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const key = crypto.createHash('sha256').update(ENCRYPTION_SECRET).digest();
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(cipherText: string): string {
  const [ivHex, encrypted] = cipherText.split(':');
  const iv = Buffer.from(ivHex!, 'hex');
  const key = crypto.createHash('sha256').update(ENCRYPTION_SECRET).digest();
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted!, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
