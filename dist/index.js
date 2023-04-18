"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("./models");
const cors_1 = __importDefault(require("cors"));
const user_route_1 = __importDefault(require("./routes/user_route"));
const app = (0, express_1.default)();
models_1.sequelize
    .sync({ force: false })
    .then(() => {
    console.log("데이터베이스 연결됨.");
})
    .catch((err) => {
    console.error(err);
});
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// 라우팅 설정
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
// 모든 요청의 기본적인 정보 출력: ${METHOD} ${REQUEST_URL} ${RESPONSE_STATUS_CODE}
app.use((req, res, next) => {
    console.log(`Method : ${req.method} \nURL : ${req.originalUrl} \nstatusCode : ${res.statusCode}`);
    next();
});
app.use("/user", user_route_1.default);
// 웹 서버 실행
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
