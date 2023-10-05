import { randomBytes } from "crypto";

function generateRandomKey(length: number): string {
  const bytes = randomBytes(length);
  return bytes.toString("hex");
}

function generateAppKey(): string {
  // Generate a 32-character (256-bit) random app key
  return generateRandomKey(6);
}

function generateAppSecret(): string {
  // Generate a 64-character (512-bit) random app secret
  const secret = generateRandomKey(24);
  const appSecret = "upload_je_" + secret;
  return appSecret;
}
export { generateAppKey, generateAppSecret };
