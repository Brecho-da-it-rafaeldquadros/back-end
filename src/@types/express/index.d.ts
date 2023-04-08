import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      token: {
        id: string;
        authorizationLevel: number;
      };
    }
  }
}