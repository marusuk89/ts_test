import express, { Request, Response, NextFunction } from 'express';
import { sequelize } from './models';
import cors from "cors";
import userRoute from "./routes/user_route";

const app = express();
sequelize
.sync({ force: false })
.then(() => {
    console.log("데이터베이스 연결됨.");
})
.catch((err: Error) => {
    console.error(err);
});
app.use(express.json());
app.use(cors());

// 라우팅 설정
app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

// 모든 요청의 기본적인 정보 출력: ${METHOD} ${REQUEST_URL} ${RESPONSE_STATUS_CODE}
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`Method : ${req.method} \nURL : ${req.originalUrl} \nstatusCode : ${res.statusCode}`);
    next();
});

app.use("/user", userRoute);

// 웹 서버 실행
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});