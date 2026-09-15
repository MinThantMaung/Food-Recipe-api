import { randomBytes } from "crypto"

export const generateToken = () => {
    return randomBytes(32).toString("hex");
}

export const generateOtpCode = Math.floor(
  100000 + Math.random() * 900000,
);