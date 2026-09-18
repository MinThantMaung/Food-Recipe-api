import type { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = error.status ?? 500;

  return res.status(status).json({
    message: error.message ?? "Internal server error",
    code: error.code ?? "internal_error",
  });
};