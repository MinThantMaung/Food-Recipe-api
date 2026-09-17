import { Request, Response, NextFunction } from "express";
import { body, check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import moment from "moment";
import "dotenv/config";
import { createError } from "../utils/error";
import { errorCode } from "../../config/error";
import jwt from "jsonwebtoken";
import {
  createOtp,
  createUser,
  getOtpByEmail,
  getUserByEmail,
  getUserById,
  updateOtp,
  updateUser,
} from "../services/authServices";
import {
  checkOtpErrorIfSameDate,
  checkOtpExist,
  checkUserIfExist,
  checkUserIfNotExist,
  Continent,
  COUNTRIES_BY_CONTINENT,
} from "../utils/auth";
import { generateOtpCode, generateToken } from "../utils/generate";
import { Prisma } from "../../generated/prisma/client";
import { UserCreateInput } from "../../generated/prisma/models";
import { sendOtpEmail } from "../services/mailService";

export const register = [
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Invalid email address"),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    //get req body
    const { email } = req.body;

    //check user is exist or not
    const user = await getUserByEmail(email);
    checkUserIfExist(user);

    const otpCode = generateOtpCode();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otpCode.toString(), salt);
    const token = generateToken();
    let result;

    const otprow = await getOtpByEmail(email);
    if (!otprow) {
      const otpData: Prisma.OtpCreateInput = {
        email: email,
        otpCode: hashedOtp,
        rememberToken: token,
        purpose: "REGISTER",
      };
      result = await createOtp(otpData);
    } else {
      const lastOtpRequest = new Date(otprow.updatedAt).toLocaleDateString();
      const today = new Date().toLocaleDateString();
      const isSameDay = lastOtpRequest === today;
      checkOtpErrorIfSameDate(isSameDay, otprow.attemptCount);
      if (!isSameDay) {
        const otpData: Prisma.OtpUpdateInput = {
          purpose: "REGISTER",
          otpCode: hashedOtp,
          rememberToken: token,
          attemptCount: 1,
          requestError: 0,
        };
        result = await updateOtp(otprow.id, otpData);
      } else {
        if (otprow.attemptCount === 5) {
          return next(
            createError(
              "You have reached the maximum number of OTP requests for today. Please try again tomorrow.",
              400,
              errorCode.overLimit,
            ),
          );
        } else {
          const otpData: Prisma.OtpUpdateInput = {
            purpose: "REGISTER",
            otpCode: hashedOtp,
            rememberToken: token,
            attemptCount: {
              increment: 1,
            },
          };
          result = await updateOtp(otprow.id, otpData);
        }
      }
    }
    await sendOtpEmail(email, otpCode);

    res.status(200).json({
      message: `OTP  successfully sent to ${email}!`,
      otp: otpCode,
      email: result.email,
      token: result.rememberToken,
    });
  },
];

export const verifyOtp = [
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Invalid email address"),
  body("otp", "Invalid Otp")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 6, max: 6 }),
  body("token", "Invalid token").trim().notEmpty(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { email, otp, token } = req.body;

    const user = await getUserByEmail(email);
    checkUserIfExist(user);

    const otprow = await getOtpByEmail(email);
    checkOtpExist(otprow);

    if (otprow?.purpose !== "REGISTER") {
      return next(createError("Wrong Otp usage!", 400, errorCode.invalid));
    }

    let result;
    const lastOtpRequest = new Date(otprow!.updatedAt).toLocaleDateString();
    const today = new Date().toLocaleDateString();
    const isSameDay = lastOtpRequest === today;
    checkOtpErrorIfSameDate(isSameDay, otprow!.requestError);

    //this is suspect try so we want to make to error count 5 and try to block
    if (otprow?.rememberToken !== token) {
      const otpData: Prisma.OtpUpdateInput = {
        requestError: 5,
      };
      await updateOtp(otprow!.id, otpData);
      return next(
        createError("Invalid verification token.", 401, errorCode.attack),
      );
    }

    const isExpired = moment().diff(otprow?.updatedAt, "minutes") > 1;
    if (isExpired) {
      return next(
        createError(
          "OTP has expired. Please request a new one.",
          403,
          "otpExpired",
        ),
      );
    }
    const isMatchOtp = await bcrypt.compare(otp, otprow?.otpCode || "");

    if (!isMatchOtp) {
      if (!isSameDay) {
        const otpData: Prisma.OtpUpdateInput = {
          requestError: 1,
        };
        await updateOtp(otprow!.id, otpData);
      } else {
        const otpData: Prisma.OtpUpdateInput = {
          requestError: {
            increment: 1,
          },
        };
        await updateOtp(otprow!.id, otpData);
      }
      return next(createError("OTP is not correct!", 401, errorCode.invalid));
    }

    const verifyToken = generateToken();
    const otpData: Prisma.OtpUpdateInput = {
      verifyToken,
      requestError: 0,
      verifyAt: new Date(),
    };

    result = await updateOtp(otprow!.id, otpData);
    res.status(200).json({
      message: "You are Successfully Verified!",
      email: result.email,
      token: result.verifyToken,
    });
  },
];

export const confirmPassword = [
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be between 8 and 72 characters")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character"),
  body("token", "Invalid token").trim().notEmpty(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { email, token, password } = req.body;

    const user = await getUserByEmail(email);
    checkUserIfExist(user);

    const otpRow = await getOtpByEmail(email);
    checkOtpExist(otpRow);

    if (otpRow?.purpose !== "REGISTER") {
      return next(createError("Wrong OTP usage!", 400, errorCode.invalid));
    }

    if (otpRow?.verifyToken !== token) {
      return next(
        createError("You are not authenticated user!", 400, errorCode.attack),
      );
    }

    const isExpired = moment().diff(otpRow?.verifyAt, "minutes") > 1;
    if (isExpired) {
      return next(
        createError(
          "Verification has expired. Please verify again.",
          403,
          errorCode.otpExpired,
        ),
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const userData: UserCreateInput = {
      email: email,
      password: hashPassword,
      verifiedAt: new Date(),
    };

    const newUser = await createUser(userData);

    const accessTokenPayload = {
      id: newUser.id,
    };

    const refreshTokenPayload = {
      id: newUser.id,
      email: newUser.email,
    };

    const accessToken = jwt.sign(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 60 * 15 },
    ); // 15min

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: 60 * 60 * 30 * 24 },
    ); //1 month

    const userUpdateData = {
      refreshToken,
      lastLogin: new Date(),
    };

    await updateUser(newUser.id, userUpdateData);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, //30days
      })
      .status(201)
      .json({
        message: "Successfully created new account",
        userid: newUser.id,
      });
  },
];

export const login = [
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be between 8 and 72 characters"),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    checkUserIfNotExist(user);

    if (!user?.password) {
      return next(
        createError(
          "Invalid email/phone or password",
          401,
          errorCode.unauthenticated,
        ),
      );
    }

    const isMatchPassword = await bcrypt.compare(password, user!.password);
    if (!isMatchPassword) {
      const today = new Date().toLocaleDateString();
      const lastRequest = user!.updatedAt.toLocaleDateString();
      const sameDay = today === lastRequest;

      if (!sameDay) {
        const updateUserData = {
          errorLoginCount: 1,
        };
        await updateUser(user!.id, updateUserData);
        return next(createError("Password is not correct!", 401, errorCode.unauthenticated));
      } else {
        if (user!.errorLoginCount >= 5) {
          const validTime = moment().diff(user!.updatedAt, "minutes") > 1;
          if (!validTime) {
            return next(
              createError("Please try again later", 429, errorCode.overLimit),
            );
          } else {
            const userData = {
              errorLoginCount: 1,
            };
            await updateUser(user!.id, userData);
          }
        } else {
          const userData = {
            errorLoginCount: {
              increment: 1,
            },
          };
          await updateUser(user!.id, userData);
        }
      }
      return next(
        createError("Password is not correct!", 401, errorCode.unauthenticated),
      );
    }

    if (user!.status === "FREEZE") {
      return next(
        createError(
          "Your account has been frozen. Please contact support.",
          403,
          errorCode.accountFreeze,
        ),
      );
    }

    const accessTokenPayload = {
      id: user!.id,
    };

    const refreshTokenPayload = {
      id: user!.id,
      email: user!.email,
    };

    const accessToken = jwt.sign(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 60 * 15 },
    ); //15 minutes
    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: "30d" },
    ); //30 days

    const userData = {
      errorLoginCount: 0,
      refreshToken: refreshToken,
      lastLogin: new Date(),
    };
    await updateUser(user!.id, userData);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 60 * 1000, //15minutes
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, //30days
      })
      .status(200)
      .json({ message: "Successfully Logged In", userid: user!.id });
  },
];

export const countryContinent = [
  body("email").isEmail().withMessage("Invalid Email"),
  body("continentId")
    .notEmpty()
    .withMessage("Continent is required")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Invalid continent ID")
    .toInt(),
  body("countryCode")
    .isString()
    .withMessage("Country code must be a string")
    .trim()
    .notEmpty()
    .withMessage("Country is required")
    .bail()
    .isAlpha()
    .withMessage("Country code must contain only letters")
    .isLength({ min: 2, max: 2 })
    .withMessage("Country code must contain exactly 2 letters")
    .toUpperCase(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req).array({
        onlyFirstError: true,
      });

      if (errors.length > 0) {
        return next(createError(errors[0].msg, 400, errorCode.invalid));
      }

      //const { email, continentId, countryCode } = req.body;

      // const country =
      //   await prismaClient.country.findFirst({
      //     where: {
      //       code: countryCode,
      //       continentId,
      //     },
      //     select: {
      //       id: true,
      //       name: true,
      //       code: true,
      //       continent: {
      //         select: {
      //           id: true,
      //           name: true,
      //         },
      //       },
      //     },
      //   });

      // if (!country) {
      //   return next(
      //     createError(
      //       "Selected country does not belong to the selected continent",
      //       400,
      //       errorCode.invalid
      //     )
      //   );
      // }

      // const identityData =
      //   type === "email"
      //     ? {
      //         email: value.toLowerCase(),
      //       }
      //     : {
      //         phone: value,
      //       };

      // const userData: Prisma.UserCreateInput = {
      //   ...identityData,

      //   country: {
      //     connect: {
      //       id: country.id,
      //     },
      //   },
      // };

      return res.status(200).json({
        message: "Country and continent are valid",
      });
    } catch (error) {
      return next(error);
    }
  },
];

export const logout = [
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies ? req.cookies.refreshToken : null;

    if (!refreshToken) {
      return next(
        createError(
          "You are not authenticated user!",
          401,
          errorCode.unauthenticated,
        ),
      );
    }

    let decoded;

    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
        id: number;
        email: string;
      };
    } catch (err) {
      return next(
        createError(
          "You are not authenticated user!",
          401,
          errorCode.unauthenticated,
        ),
      );
    }

    const user = await getUserById(decoded.id);
    checkUserIfNotExist(user);

    if (user!.email != decoded.email) {
      return next(
        createError(
          "You are not authenticated user!",
          401,
          errorCode.unauthenticated,
        ),
      );
    }

    const userData = {
      refreshToken: generateToken(),
    };

    await updateUser(user!.id, userData);

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({ message: "Successfully Logged Out!." });
  },
];

export const forgetPassword = [
  body("email").isEmail().withMessage("Invalid Email Address"),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { email } = req.body;

    const user = await getUserByEmail(email);
    checkUserIfNotExist(user);

    const otp = 123456; // TODO: Remove this line and uncomment the above line when in production
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp.toString(), salt);
    const token = generateToken();

    const otpRow = await getOtpByEmail(email);
    let result;
    if (!otpRow) {
      const otpData: Prisma.OtpCreateInput = {
        email: email,
        otpCode: hashedOtp,
        rememberToken: token,
        purpose: "REGISTER",
        attemptCount: 1,
      };
      result = await createOtp(otpData);
    } else {
      const lastOtpRequest = new Date(otpRow.updatedAt).toLocaleDateString();
      const today = new Date().toLocaleDateString();
      const isSameDay = lastOtpRequest === today;
      checkOtpErrorIfSameDate(isSameDay, otpRow.attemptCount);
      if (!isSameDay) {
        const otpData: Prisma.OtpUpdateInput = {
          purpose: "REGISTER",
          otpCode: hashedOtp,
          rememberToken: token,
          attemptCount: 1,
          requestError: 0,
        };
        result = await updateOtp(otpRow.id, otpData);
      } else {
        if (otpRow.attemptCount >= 5) {
          return next(
            createError(
              "You have reached the maximum number of OTP requests for today. Please try again tomorrow.",
              400,
              errorCode.overLimit,
            ),
          );
        } else {
          const otpData: Prisma.OtpUpdateInput = {
            purpose: "REGISTER",
            otpCode: hashedOtp,
            rememberToken: token,
            attemptCount: {
              increment: 1,
            },
          };
          result = await updateOtp(otpRow.id, otpData);
        }
      }
    }
    res.status(200).json({
      message: `OTP  successfully sent to ${email} for reset password!`,
      email: result.email,
      token: result.rememberToken,
    });
  },
];

export const verifyOtpPassword = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("otp", "Invalid Otp")
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .isLength({ min: 6, max: 6 }),
  body("token", "Invalid token").trim().notEmpty(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { email, otp, token } = req.body;

    const user = await getUserByEmail(email);
    checkUserIfNotExist(user);

    const otprow = await getOtpByEmail(email);
    checkOtpExist(otprow);
    let result;

    const lastOtpRequest = new Date(otprow!.updatedAt).toLocaleDateString();
    const today = new Date().toLocaleDateString();
    const isSameDay = lastOtpRequest === today;
    checkOtpErrorIfSameDate(isSameDay, otprow!.requestError);

    if (otprow?.rememberToken !== token) {
      const otpData: Prisma.OtpUpdateInput = {
        requestError: 5,
      };
      await updateOtp(otprow!.id, otpData);
    }

    const isExpired = moment().diff(otprow?.updatedAt, "minutes") > 1;
    if (isExpired) {
      return next(
        createError(
          "OTP has expired. Please request a new one.",
          403,
          "otpExpired",
        ),
      );
    }
    const isMatchOtp = await bcrypt.compare(otp, otprow?.otpCode || "");

    if (!isMatchOtp) {
      if (!isSameDay) {
        const otpData = {
          requestError: 1,
        };
        await updateOtp(otprow!.id, otpData);
      } else {
        const otpData = {
          requestError: {
            increment: 1,
          },
        };
        await updateOtp(otprow!.id, otpData);
      }
      return next(createError("OTP is not correct!", 401, "invalidOtp"));
    }

    const verifyToken = generateToken();
    const otpData = {
      verifyToken,
      requestError: 0,
      attemptCount: 1,
      verifyAt: new Date(),
    };

    result = await updateOtp(otprow!.id, otpData);
    res.status(200).json({
      message: "You are Successfully Verified for reset password!",
      email: result.email,
      token: result.verifyToken,
    });
  },
];

export const resetPassword = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 72 })
    .withMessage("Password must be between 8 and 72 characters")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/)
    .withMessage("Password must contain at least one special character"),
  body("token", "Invalid token").trim().notEmpty(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { email, token, password } = req.body;

    const user = await getUserByEmail(email);
    checkUserIfNotExist(user);

    const otpRow = await getOtpByEmail(email);
    checkOtpExist(otpRow);

    if (otpRow?.verifyToken != token) {
      return next(
        createError("You are not authenticated user!", 400, errorCode.attack),
      );
    }

    const isExpired = moment().diff(otpRow?.updatedAt, "minutes") > 1;
    if (isExpired) {
      return next(
        createError(
          "OTP has expired. Please request a new one.",
          403,
          "otpExpired",
        ),
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const accessTokenPayload = {
      id: user!.id,
    };

    const refreshTokenPayload = {
      id: user!.id,
      email: email,
    };

    const accessToken = jwt.sign(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: 60 * 15 },
    ); // 15min

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: 60 * 60 * 30 * 24 },
    ); //1 month

    const userData = {
      password: hashPassword,
      refreshToken,
    };

    await updateUser(user!.id, userData);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, //30days
      })
      .status(201)
      .json({
        message: "Successfully created new account",
        userid: user!.id,
      });
  },
];

interface CustomRequest extends Request {
  userId?: number;
}

export const authCheck = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserIfNotExist(user);

  res
    .status(200)
    .json({
      message: "You are authenticated.",
      userId: user?.id,
      username: user?.firstName + " " + user?.lastLogin,
      image: user?.image,
    });
};
