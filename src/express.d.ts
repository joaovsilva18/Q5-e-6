/**
 * Extend Express request to include user_id
 */
declare namespace Express {
  export interface Request {
    user: { id: number };
  }
}

declare type ExpressRequest = import("express").Request;
declare type ExpressResponse = import("express").Response;
declare type ExpressNextFunction = import("express").NextFunction;
