import { Request, Response, NextFunction } from "express";
interface RequestWithUser extends Request {
    id?: number;
    email?: string;
}
declare const authJWT: (req: RequestWithUser, res: Response, next: NextFunction) => void;
export default authJWT;
