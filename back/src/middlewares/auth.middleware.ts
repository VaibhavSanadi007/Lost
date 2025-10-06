import {NextFunction, Request,Response} from 'express';
import jwt,{JwtPayload} from 'jsonwebtoken';
import userModel, { IUser } from '../models/user.model.js';


interface myjwtpayload extends JwtPayload {
  id:number,
  username:string,
  email:string,
  role?: string,
  iat: number,
  exp: number
}

declare global{
  namespace Express{
    interface Request{
      user?: IUser | null,
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookie = req.cookies;

    if (!cookie || !cookie.token) {
      return res.status(400).json({
        message: "cookie expired",
      });
    }

    const token = cookie.token;

    const Tokendata = jwt.verify(token, process.env.JWT_SECRET!) as myjwtpayload;

    const isUserExist = await userModel.findOne({
      $or: [{ _id: Tokendata.id }, { username: Tokendata.username } ],
    });

    if (!isUserExist) {
      return res.status(400).send("User is not in db");
    }

    req.user = isUserExist;
  

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error });
  }
};

export default authMiddleware;