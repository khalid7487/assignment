import { Request, Response } from "express";
import jwt from "jsonwebtoken";




export const RemoveSpecialCharacterFromString = (text) => {
    if (text) {

        // const str = 'hello 123 !@#$%^WORLD?.';
        const str = text.trim().toLowerCase();

        const noSpecialCharacters = str.replace(/[^a-zA-Z0-9 ]/g, '');
        // console.log(noSpecialCharacters); 

        const formatedText = noSpecialCharacters.replace(/ /g, '-');

        return formatedText;
    }
}


export const FindUser = (req: Request, res: Response) => {
    console.log('auth-message', req.headers.authorization);
    // logger.log('auth-message', req.headers.authorization)

    const [type, token] = req.headers.authorization.split(' ');

    if (!token) throw new Error('Unauthenticated')

    const { phone }: any = jwt.verify(token, process.env.JWT_SECRET)

    return phone;
} 