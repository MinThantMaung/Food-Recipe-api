import { randomBytes, randomInt } from "node:crypto";

export const generateToken = (): string => {
  return randomBytes(32).toString("hex");
};

export const generateOtpCode = (): number => {
  return randomInt(100000, 1000000);
};