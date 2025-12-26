declare namespace Express {
  export interface Request {
    user?: {
      id: number | string;
      role: string;
      [key: string]: unknown;
    };
  }
}
