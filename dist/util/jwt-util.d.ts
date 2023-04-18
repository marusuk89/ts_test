export declare const sign: (user: {
    id: number;
    email: string;
}) => Promise<string>;
export declare const verify: (token: string) => {
    ok: boolean;
    id?: number;
    email?: string;
    message?: string;
};
export declare const expire: (token: string) => Promise<{
    ok: boolean;
    message: string;
    token?: undefined;
} | {
    ok: boolean;
    token: string;
    message?: undefined;
}>;
