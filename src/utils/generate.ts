import { randomBytes } from "crypto"
import crypto from "node:crypto";

export const generateToken = () => {
    return randomBytes(32).toString("hex");
}

export const generateOtpCode = (): number => {
  return crypto.randomInt(100000, 1000000);
};