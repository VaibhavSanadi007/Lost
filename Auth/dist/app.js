import "dotenv/config";
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieparser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRouter from './routes/auth.routers.js';
const port = process.env.PORT || 8000;
const allowrdOrigin = `http://localhost:8000`;
const app = express();
const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: 'too many attempts plz try again later'
});
app.use(limiter);
app.use(express.json());
app.use(cookieparser());
app.use(helmet());
app.use(cors({
    origin: allowrdOrigin,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
}));
app.use('/auth', authRouter);
app.listen(port, () => {
    console.log(`Server is listening at port ${port}`);
});
export default app;
