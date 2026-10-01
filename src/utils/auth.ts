import { errorCode } from "../../config/error";
import type { User, Otp } from "../../generated/prisma/client";
import { createError } from "./error";

export const checkUserIfExist = (user : User | null) => {
  if (user) {
    throw createError(
      "User already exist.",
      409,
      errorCode.userExist
    );
  }
}

export const checkUserIfNotExist = (user : User| null) => {
  if(!user){
    throw createError(
      "User does not exist",
      404,
      errorCode.notfound
    );
  }
}

export const checkOtpExist = (otpRow : Otp | null) => {
  if (!otpRow) {
    throw createError(
      "Invalid verification code or verification code has expired",
      400,
      errorCode.invalid
    );
  }
}

export const checkOtpErrorIfSameDate = (
  isSameDate: boolean,
  errorCount: number
) => {
  if (isSameDate && errorCount >= 5) {
    throw createError("You have reached the maximum number of OTP requests for today. Please try again tomorrow.",
      429,
      errorCode.overLimit
    )
  }
};