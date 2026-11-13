import { Request, Response, NextFunction } from "express";
import { AppError } from "./app.error.js";

export interface ErrorResponse {
  success: false;
  message: string;
  code?: string;
}

export class ErrorHandler {
  static middleware(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const statusCode =
      error instanceof AppError
        ? error.statusCode
        : 500;

    ErrorHandler.log(error, statusCode);

    res
      .status(statusCode)
      .json(ErrorHandler.buildResponse(error));
  }

  private static buildResponse(error: unknown): ErrorResponse {
    if (error instanceof AppError) {
      return {
        success: false,
        message: error.message,
        code: error.code
      };
    }

    return {
      success: false,
      message: "Erro interno do servidor."
    };
  }

  private static log(error: unknown, statusCode: number) {
    if (statusCode < 500)
      return;

    if (error instanceof Error) {
      console.error(`[ERROR] ${error.message}`);
      console.error(error.stack);
    } else {
      console.error(error);
    }
  }
}