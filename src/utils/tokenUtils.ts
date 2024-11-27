import jwt from 'jsonwebtoken'
import env from '../config/environment'

interface JwtPayload {
    id: string;
  }

export const generateAuthToken = (userId: string,email:string): string => {
    const secret = env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }
    const token = jwt.sign({ id: userId, email }, secret, { expiresIn: '1h' });
    return token;
}


export const verifyToken = (token: string): JwtPayload => {
    const secret = env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in the environment variables.");
    }
    return jwt.verify(token, secret) as JwtPayload;
}