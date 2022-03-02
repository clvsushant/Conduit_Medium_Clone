import {getRepository} from "typeorm";
import {User} from "../entities/User";
import {hashPassword, matchPassword} from "../utils/password";
import {sanitizeFields} from "../utils/security";
import {sign} from "../utils/jwt";

interface UserSignupData {
    username: string
    password: string
    email: string
}

interface UserLoginData {
    email: string
    password: string
}

export async function createUser(data: UserSignupData): Promise<User> {
    if (!data.username) throw new Error('username is blank')
    if (!data.email) throw new Error('email is blank')
    if (!data.password) throw new Error('password is blank')

    const repo = getRepository(User)
    const existing = await repo.findOne(data.email)

    if (existing) throw new Error('user with this email exists')

    try {
        const user = await repo.save(new User(
            data.email,
            data.username,
            await hashPassword(data.password)
        ))
        user.token = await sign(user)
        return sanitizeFields(user)
    } catch (e) {
        throw e
    }

}

export async function loginUser(data: UserLoginData): Promise<User> {
    if (!data.email) throw new Error('email is blank')
    if (!data.password) throw new Error('password is blank')

    const repo = getRepository(User)
    const user = await repo.findOne(data.email)

    if (!user) throw new Error("no user with this email")

    const passMatch = await matchPassword(user.password!, data.password)
    if (passMatch === false) throw new Error('wrong password')

    user.token = await sign(user)
    return sanitizeFields(user)

}

export async function getUserByEmail(email: string): Promise<User> {
    const repo = getRepository(User)
    const user = await repo.findOne(email)
    if (!user) throw new Error("no user with this email")
    return sanitizeFields(user)
}