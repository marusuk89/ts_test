import models from "../models";
import bcrypt from "bcrypt";
import { sign, expire } from '../util/jwt-util';
import validator from 'validator';
import passwordValidator from 'password-validator';
import { Request, Response, NextFunction } from "express";

const MAX_LOGIN_ATTEMPTS = 5; // 최대 로그인 실패 횟수
const LOGIN_LOCK_TIME = 5 * 60 * 1000; // 로그인 제한 시간 (5분)

interface RequestWithUser extends Request {
    id?: number;
    email?: string;
}

export const test = async (req: Request, res: Response, next: NextFunction) => {
    // console.log(Math.floor(Date.now() / 1000), 'Math.floor(Date.now() / 1000)');
    res.send('ok');
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        // 이메일 형식 체크
        if (!validator.isEmail(email)) {
            return res.status(400).json({ status: 400, message: "invalid email format" });
        }
    
        // 암호 validation
        const schema = new passwordValidator();
        schema
            .is().min(10)                                    // 최소 10자 이상
            .has().uppercase(1)                              // 대문자 하나 이상 포함
            .has().lowercase(1)                              // 소문자 하나 이상 포함
            .has().digits(1)                                 // 숫자 하나 이상 포함
            .has().not().spaces();                           // 공백 제외
    
        if (!schema.validate(password)) {
            return res.status(400).json({ message: '10글자, 대소문자와 숫자 하나 이상 포함' });
        }
        // 암호 validation
    
        const crypt_password = await bcrypt.hash(password, 10);
    
        // console.log(crypt_password, 'crypt_password');
        const user = await models.UserAccount.findOne({ where: { email } });
        if (!user) {
            await models.UserAccount.create({ email, password: crypt_password, login_attempt: 0 });
            res.status(201).json({ status: 200, message: 'register success' });
        } else {
            res.status(409).json({ status: 409, message: 'duplicate email' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, message: 'server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
    
        const user = await models.UserAccount.findOne({ where: { email: email } });
        if (!user) {
            return res.status(401).json({ status: 401, message: "check email again" });
        }
    
        let loginAttempts = user.login_attempt || 0;
        let lockUntil = user.lock_until || 0;
    
        // 로그인 횟수가 5회 이상인 상태에서 제한시간이 다 지나지 않은 경우
        if (loginAttempts >= MAX_LOGIN_ATTEMPTS && Date.now() - lockUntil < 0) {
            return res.status(401).json({ status: 401, message: `login status is locked. try after 5 min later, number of fail : ${loginAttempts}` });
        }
        // 로그인 횟수가 5회 이상인 상태에서 제한시간이 지난 경우 - 로그인 시도 횟수 초기화
        else if (loginAttempts >= MAX_LOGIN_ATTEMPTS && Date.now() - lockUntil > 0) {
            loginAttempts = 0
        }
        
        const isPassed = await bcrypt.compare(password, user.password);
        // 로그인에 실패 시
        if (!isPassed) {
            loginAttempts++; // 로그인 실패 횟수 증가
                
            if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
            lockUntil = Date.now() + LOGIN_LOCK_TIME; // 로그인 제한 시간 설정
                await models.UserAccount.update({ login_attempt: loginAttempts, lock_until: lockUntil }, { where: { email: email } });
                return res.status(401).json({ status: 401, message: `login status is locked. try after 5 min later, number of fail : ${loginAttempts}` });
            }
            
            await models.UserAccount.update({ login_attempt: loginAttempts }, { where: { email: email } });
            
            return res.status(401).json({ status: 401, message: `wrong email or password, number of fail : ${loginAttempts} ` });
            }
        
            await models.UserAccount.update({ login_attempt: 0, lock_until: null }, { where: { email: email } });
        
            const accessToken = await sign({ id: user.id, email: user.email });
        
            res.status(200).json({
                status: 200,
                data: { accessToken },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, message: "server error" });
    }
};

export const deleteAccount = async (req: RequestWithUser, res: Response) => {
    try {
        const user_email = req.email;
        const token = req.headers.authorization?.split(' ')[1];
        // console.log(user_email, "user_email")

        // 회원 탈퇴 및 로그아웃 로직 실행
        await models.UserAccount.destroy({ where: { email: user_email } });
        const expireToken = token ? await expire(token) : undefined;
    
        res.status(200).json({ status: 200, message: 'delete account and logout success', data: expireToken });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, message: 'server error' });
    }
};

export const checkPassword = async (req: RequestWithUser, res: Response) => {
    try {
        const user_email = req.email
        const { password } = req.body
    
        const user = await models.UserAccount.findOne({ where: { email: user_email }, raw: true })
    
        const isPassed = await bcrypt.compare(password, user.password)
        if (!isPassed) {
            return res.status(401).json({ status: 401, message: 'wrong password' })
        }
        res.status(200).json({ status : 200, message: 'password correct' })
    } 
    catch (err) {
        console.error(err)
        res.status(500).json({ status : 500, message: 'server error' })
    }
};

export const resetPassword = async (req: RequestWithUser, res: Response) => {
    try {
        const { password, new_password } = req.body
        const user_email = req.email
        const user = await models.UserAccount.findOne({ where: { email: user_email }, raw: true })
        
        // 현재 비밀번호 체크
        const isMatched = await bcrypt.compare(password, user.password)
        if (!isMatched) {
            return res.status(401).json({ status : 401, message: 'wrong password' })
        }
    
        // 새로운 비밀번호가 현재 비밀번호와 동일한지 체크
        if (await bcrypt.compare(new_password, user.password)) {
            return res.status(400).json({ status : 400, message: 'new password cannot be same as current password' })
        }

        // 암호 validation
        const schema = new passwordValidator();
        schema
            .is().min(10)                                    // 최소 10자 이상
            .has().uppercase(1)                              // 대문자 하나 이상 포함
            .has().lowercase(1)                              // 소문자 하나 이상 포함
            .has().digits(1)                                 // 숫자 하나 이상 포함
            .has().not().spaces();                           // 공백 제외
    
        if (!schema.validate(new_password)) {
            return res.status(400).json({ message: '10글자, 대소문자와 숫자 하나 이상 포함' });
        }    

        // 새로운 비밀번호로 업데이트
        const crypt_password = await bcrypt.hash(new_password, 10)
        await models.UserAccount.update({ password: crypt_password }, { where: { email: user_email } })
    
        res.status(200).json({ status : 200, message: 'password reset success' })
    } 
    catch (err) {
        console.error(err)
        res.status(500).json({ status : 500, message: 'server error' })
    }
};