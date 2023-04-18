import jwtUtil from 'jsonwebtoken';

export const sign = async (user: { id: number, email: string }) => {
    const payload = {
        id: user.id,
        email: user.email
    };
    return jwtUtil.sign(payload, 'Hello', {
        algorithm: 'HS256',
        expiresIn: '1h',
    });
};

export const verify = (token: string): { ok: boolean, id?: number, email?: string, message?: string } => {
    let decoded: jwtUtil.JwtPayload | null = null;
    try {
        decoded = jwtUtil.verify(token, 'Hello') as jwtUtil.JwtPayload;
        return {
            ok: true,
            id: decoded.id as number,
            email: decoded.email as string,
        };
    } catch (err: any) {
        return {
            ok: false,
            message: err.message,
        };
    }
};

export const expire = async (token: string) => {
    try {
        const decoded = jwtUtil.decode(token, { complete: true }) as { payload: jwtUtil.JwtPayload } | null;
        if (!decoded || !decoded.payload) {
            return { ok: false, message: '올바른 토큰이 아닙니다.' };
        }

        decoded.payload.exp = Math.floor(Date.now() / 1000);
        const newToken = jwtUtil.sign(decoded.payload, 'Hello', {
            algorithm: 'HS256',
        });
        return { ok: true, token: newToken }
    } catch (err) {
        console.error(err);
        return { ok: false, message: '서버 오류 발생' };
    }
};
