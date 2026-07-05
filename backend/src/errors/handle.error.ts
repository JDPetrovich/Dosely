import { Request, Response, NextFunction } from "express";
import { AppError } from "./app.error.js";

export interface ErrorResponse {
  success: false;
  message: string;
  code?: string;
}

export class ErrorHandler {
  static getErrorResponse(error: unknown): ErrorResponse {
    if (error instanceof AppError) {
      const response: ErrorResponse = {
        success: false,
        message: error.message,
      };

      if (error.code) {
        response.code = error.code;
      }

      return response;
    }

    return {
      success: false,
      message: "Erro interno do servidor. Por favor, tente novamente mais tarde.",
    };
  }

  static middleware = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let statusCode = 500;
    if (error instanceof AppError) {
      statusCode = error.statusCode;
    }

    const response = ErrorHandler.getErrorResponse(error);

    ErrorHandler.logError(error, statusCode);

    if (process.env.NODE_ENV !== "production" && !(error instanceof AppError)) {
      console.error("Stack trace:", error instanceof Error ? error.stack : error);
    }

    res.status(statusCode).json(response);
  };

  private static logError(error: unknown, statusCode: number): void {
    if (statusCode < 500) return;

    if (error instanceof Error) {
      console.error(`[ERROR] ${error.message}`);
      console.error(error.stack);
    } else {
      console.error("[ERROR]", error);
    }
  }
}

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };