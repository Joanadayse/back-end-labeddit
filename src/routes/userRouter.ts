import express from "express"
import { UserBusiness } from "../business/UserBusiness"
import { UserController } from "../controller/UserController"
import { UserDatabase } from "../database/UserDatabase"
import { HashManager } from "../services/HashManager"
import { TokenManager } from "../services/TokenManager"
import { IdGenerator } from "../services/idGenerator"

export const userRouter = express.Router()

const userController = new UserController(
   new UserBusiness( new UserDatabase(), new IdGenerator(), new TokenManager(), new HashManager()))

userRouter.get("/", userController.getUsers)
userRouter.post("/signup", userController.createUser)
userRouter.post("/login", userController.login)