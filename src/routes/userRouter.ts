import express from "express"
import { UserBussiness } from "../business/UserBusiness"
import { UserDatabase } from "../database/UserDatabase"
import { IdGenerator } from "../services/idGenerator"
import { TokenManager } from "../services/TokenManager"
import { HashManager } from "../services/HashManager"
import { UserController } from "../controller/UserController"

export const userRouter= express.Router()

const userController= new UserController(
    new UserBussiness(
        new UserDatabase(),
        new IdGenerator(),
        new TokenManager(),
        new HashManager()
    )
)

userRouter.post("/signup",userController.signup)
userRouter.post("/login",userController.login)
