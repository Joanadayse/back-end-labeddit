import express from "express"
import { UserBussiness } from "../business/UserBusiness"
import { UserDatabase } from "../database/UserDatabase"
import { IdGenerator } from "../services/idGenerator"
import { TokenManager } from "../services/TokenManager"
import { HashManager } from "../services/HashManager"

export const userRouter= express.Router()

const userController= new UserBussiness(
    new UserDatabase(),
    new IdGenerator(),
    new TokenManager(),
    new HashManager()
)

userRouter.post("/signup",userController.signup)
