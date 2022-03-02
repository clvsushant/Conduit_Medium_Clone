import jwt from 'jsonwebtoken'
import {User} from "../entities/User";

const JWT_SECRET = "n198x37r@*^#@#N*&@^6JHU763" //TODO: move sensitive things in separate config file

export async function sign(user: User): Promise<string> {
    return new Promise((resolve, reject) => {
        jwt.sign({
            username: user.username,
            email: user.email
        }, JWT_SECRET, (err: any, encoded: string | undefined) => {
            if (err) return reject(err)
            resolve(encoded as string)
        })
    })
}

export async function decode(token: string): Promise<User> {
    return new Promise((resolve, reject) => {
        jwt.verify(token,JWT_SECRET,(err: any, decoded: object | undefined) => {
            if (err) return reject(err)
            return resolve(decoded as User)
        })
    })
}