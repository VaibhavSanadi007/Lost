import {NextFunction, Request,Response} from 'express';
import jwt,{JwtPayload} from 'jsonwebtoken';
import prisma from '../databases/prisma.js';
import {user} from '@prisma/client';

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
      user?: user | null,
    }
  }
}

const authMiddleware = async (req:Request , res:Response , next:NextFunction)=>{
  const cookie = req.cookies;
  if(!cookie){
    res.status(400).json({
      message:"cookie expired"
    })
  }

  const token = cookie.token;

  const Tokendata = jwt.verify(token,process.env.JWT_SECRET!) as myjwtpayload;

  const isUserExist = await prisma.user.findFirst({
    where:{
      OR:[{id:Tokendata.id},{username:Tokendata.username}]
    }
  })

  if(!isUserExist){
    res.status(400).send("User is not in db");
  }

  req.user = isUserExist;

  next();
}

export default authMiddleware;