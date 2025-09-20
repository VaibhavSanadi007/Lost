import jwt from 'jsonwebtoken';
import prisma from '../databases/prisma.js';
const authMiddleware = async (req, res, next) => {
    const cookie = req.cookies;
    if (!cookie) {
        res.status(400).json({
            message: "cookie expired"
        });
    }
    const token = cookie.token;
    const Tokendata = jwt.verify(token, process.env.JWT_SECRET);
    const isUserExist = await prisma.user.findFirst({
        where: {
            OR: [{ id: Tokendata.id }, { username: Tokendata.username }]
        }
    });
    if (!isUserExist) {
        res.status(400).send("User is not in db");
    }
    req.user = isUserExist;
    next();
};
export default authMiddleware;
