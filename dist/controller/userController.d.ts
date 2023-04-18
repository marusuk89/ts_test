import { Request, Response, NextFunction } from "express";
interface RequestWithUser extends Request {
    id?: number;
    email?: string;
}
export declare const test: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteAccount: (req: RequestWithUser, res: Response) => Promise<void>;
export declare const checkPassword: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const resetPassword: (req: RequestWithUser, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
