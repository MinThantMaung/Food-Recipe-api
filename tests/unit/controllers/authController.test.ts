// tests/unit/controllers/authController.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ValidationChain } from "express-validator";

const mocks = vi.hoisted(() => ({
  getUserByEmail: vi.fn(),
  getOtpByEmail: vi.fn(),
  createOtp: vi.fn(),
  updateOtp: vi.fn(),
  checkUserIfExist: vi.fn(),
  checkOtpErrorIfSameDate: vi.fn(),
  generateOtpCode: vi.fn(),
  generateToken: vi.fn(),
  sendOtpEmail: vi.fn(),
  genSalt: vi.fn(),
  hash: vi.fn(),
}));

// Match these paths to the modules imported by your controller.
vi.mock("../../../src/services/authServices", () => ({
  getUserByEmail: mocks.getUserByEmail,
  getOtpByEmail: mocks.getOtpByEmail,
  createOtp: mocks.createOtp,
  updateOtp: mocks.updateOtp,
}));

vi.mock("../../../src/utils/auth", () => ({
  checkUserIfExist: mocks.checkUserIfExist,
  checkOtpErrorIfSameDate: mocks.checkOtpErrorIfSameDate,
}));

vi.mock("../../../src/utils/generate", () => ({
  generateOtpCode: mocks.generateOtpCode,
  generateToken: mocks.generateToken,
}));

vi.mock("../../../src/services/mailService", () => ({
  sendOtpEmail: mocks.sendOtpEmail,
}));

// Assumes your controller uses: import bcrypt from "bcrypt"
vi.mock("bcrypt", () => ({
  default: {
    genSalt: mocks.genSalt,
    hash: mocks.hash,
  },
}));

import { register } from "../../../src/controllers/authController";

// Your register array contains one validator and one handler.
const emailValidator = register[0] as ValidationChain;
const registerHandler = register[1] as RequestHandler;

const EMAIL = "test@example.com";
const OTP = 123456;
const TOKEN = "test-remember-token";
const HASHED_OTP = "hashed-otp";

function createHttpMocks(email: unknown = EMAIL) {
  const req = {
    body: { email },
  } as Request;

  const status = vi.fn().mockReturnThis();
  const json = vi.fn().mockReturnThis();

  const res = { status, json } as unknown as Response;
  const next = vi.fn<(error?: unknown) => void>();

  return { req, res, next, status, json };
}

async function executeRegister(http: ReturnType<typeof createHttpMocks>) {
  // Run the actual email validator and sanitizers first.
  await emailValidator.run(http.req);

  // Call the controller directly, without starting Express.
  await registerHandler(http.req, http.res, http.next);
}

describe("register", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Freeze only Date so same-day tests are predictable.
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 10, 11, 12, 0, 0));

    mocks.getUserByEmail.mockResolvedValue(null);
    mocks.getOtpByEmail.mockResolvedValue(null);

    mocks.generateOtpCode.mockReturnValue(OTP);
    mocks.generateToken.mockReturnValue(TOKEN);
    mocks.genSalt.mockResolvedValue("test-salt");
    mocks.hash.mockResolvedValue(HASHED_OTP);

    const savedOtp = {
      id: 10,
      email: EMAIL,
      rememberToken: TOKEN,
    };

    mocks.createOtp.mockResolvedValue(savedOtp);
    mocks.updateOtp.mockResolvedValue(savedOtp);
    mocks.sendOtpEmail.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("rejects an invalid email before accessing the database", async () => {
    const http = createHttpMocks("invalid-email");

    await executeRegister(http);

    expect(http.next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Invalid email address",
      })
    );
    expect(mocks.getUserByEmail).not.toHaveBeenCalled();
    expect(mocks.createOtp).not.toHaveBeenCalled();
    expect(mocks.sendOtpEmail).not.toHaveBeenCalled();
    expect(http.json).not.toHaveBeenCalled();
  });

  it("normalizes the email and creates a hashed OTP", async () => {
    const http = createHttpMocks("  TEST@EXAMPLE.COM  ");

    await executeRegister(http);

    expect(mocks.getUserByEmail).toHaveBeenCalledWith(EMAIL);
    expect(mocks.checkUserIfExist).toHaveBeenCalledWith(null);

    expect(mocks.genSalt).toHaveBeenCalledWith(10);
    expect(mocks.hash).toHaveBeenCalledWith(OTP.toString(), "test-salt");

    expect(mocks.createOtp).toHaveBeenCalledWith({
      email: EMAIL,
      otpCode: HASHED_OTP,
      rememberToken: TOKEN,
      purpose: "REGISTER",
    });
    expect(mocks.updateOtp).not.toHaveBeenCalled();

    expect(mocks.sendOtpEmail).toHaveBeenCalledWith(EMAIL, OTP);

    expect(http.status).toHaveBeenCalledWith(200);
    expect(http.json).toHaveBeenCalledWith({
      message: `OTP  successfully sent to ${EMAIL}!`,
      email: EMAIL,
      token: TOKEN,
    });
    expect(http.next).not.toHaveBeenCalled();
  });

  it("stops when the existing-user guard throws", async () => {
    const existingUser = { id: 1, email: EMAIL };
    const error = new Error("User already exists");

    mocks.getUserByEmail.mockResolvedValue(existingUser);
    mocks.checkUserIfExist.mockImplementation(() => {
      throw error;
    });

    const http = createHttpMocks();

    await expect(executeRegister(http)).rejects.toThrow(error);

    expect(mocks.checkUserIfExist).toHaveBeenCalledWith(existingUser);
    expect(mocks.getOtpByEmail).not.toHaveBeenCalled();
    expect(mocks.createOtp).not.toHaveBeenCalled();
    expect(mocks.sendOtpEmail).not.toHaveBeenCalled();
    expect(http.json).not.toHaveBeenCalled();
  });

  it("resets counters when the previous OTP was requested yesterday", async () => {
    mocks.getOtpByEmail.mockResolvedValue({
      id: 10,
      updatedAt: new Date(2026, 10, 10, 12, 0, 0),
      attemptCount: 5,
    });

    const http = createHttpMocks();

    await executeRegister(http);

    expect(mocks.checkOtpErrorIfSameDate).toHaveBeenCalledWith(false, 5);
    expect(mocks.updateOtp).toHaveBeenCalledWith(10, {
      purpose: "REGISTER",
      otpCode: HASHED_OTP,
      rememberToken: TOKEN,
      attemptCount: 1,
      requestError: 0,
    });
    expect(mocks.createOtp).not.toHaveBeenCalled();
    expect(mocks.sendOtpEmail).toHaveBeenCalledWith(EMAIL, OTP);
    expect(http.status).toHaveBeenCalledWith(200);
  });

  it("allows the fifth request and increments today's count", async () => {
    mocks.getOtpByEmail.mockResolvedValue({
      id: 10,
      updatedAt: new Date(),
      attemptCount: 4,
    });

    const http = createHttpMocks();

    await executeRegister(http);

    expect(mocks.checkOtpErrorIfSameDate).toHaveBeenCalledWith(true, 4);
    expect(mocks.updateOtp).toHaveBeenCalledWith(10, {
      purpose: "REGISTER",
      otpCode: HASHED_OTP,
      rememberToken: TOKEN,
      attemptCount: { increment: 1 },
    });
    expect(mocks.createOtp).not.toHaveBeenCalled();
    expect(mocks.sendOtpEmail).toHaveBeenCalledWith(EMAIL, OTP);
    expect(http.status).toHaveBeenCalledWith(200);
  });

  it("rejects another request when today's count is already five", async () => {
    mocks.getOtpByEmail.mockResolvedValue({
      id: 10,
      updatedAt: new Date(),
      attemptCount: 5,
    });

    const http = createHttpMocks();

    await executeRegister(http);

    expect(http.next).toHaveBeenCalledWith(
      expect.objectContaining({
        message:
          "You have reached the maximum number of OTP requests for today. Please try again tomorrow.",
      })
    );
    expect(mocks.createOtp).not.toHaveBeenCalled();
    expect(mocks.updateOtp).not.toHaveBeenCalled();
    expect(mocks.sendOtpEmail).not.toHaveBeenCalled();
    expect(http.json).not.toHaveBeenCalled();
  });

  it("does not return success when sending the email fails", async () => {
    const error = new Error("Email provider unavailable");
    mocks.sendOtpEmail.mockRejectedValue(error);

    const http = createHttpMocks();

    await expect(executeRegister(http)).rejects.toThrow(error);

    // Your current implementation saves the OTP before sending.
    expect(mocks.createOtp).toHaveBeenCalledOnce();
    expect(http.status).not.toHaveBeenCalled();
    expect(http.json).not.toHaveBeenCalled();
  });
});
