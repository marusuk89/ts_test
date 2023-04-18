"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expire = exports.verify = exports.sign = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sign = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        id: user.id,
        email: user.email
    };
    return jsonwebtoken_1.default.sign(payload, 'Hello', {
        algorithm: 'HS256',
        expiresIn: '1h',
    });
});
exports.sign = sign;
const verify = (token) => {
    let decoded = null;
    try {
        decoded = jsonwebtoken_1.default.verify(token, 'Hello');
        return {
            ok: true,
            id: decoded.id,
            email: decoded.email,
        };
    }
    catch (err) {
        return {
            ok: false,
            message: err.message,
        };
    }
};
exports.verify = verify;
const expire = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.decode(token, { complete: true });
        if (!decoded || !decoded.payload) {
            return { ok: false, message: '올바른 토큰이 아닙니다.' };
        }
        decoded.payload.exp = Math.floor(Date.now() / 1000);
        const newToken = jsonwebtoken_1.default.sign(decoded.payload, 'Hello', {
            algorithm: 'HS256',
        });
        return { ok: true, token: newToken };
    }
    catch (err) {
        console.error(err);
        return { ok: false, message: '서버 오류 발생' };
    }
});
exports.expire = expire;
