import { Router } from "express";
import { getUserByEmail } from "../controllers/users";
import { authByToken } from "../middlewares/auth";

const route = Router()


//! Get current user
route.get('/', authByToken, async (req, res) => {
    try {
        const user = await getUserByEmail((req as any).user.email)
        if (!user) throw new Error("No such user found");
        return res.status(200).json({ user })
    } catch (e) {
        return res.status(404).json({
            errors: { body: [ e.message ] }
        })
    }
})

//! Patch update current user data
route.patch('/', async (req, res) => {

})

export const userRoute = route