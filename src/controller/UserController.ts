import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { BaseError } from "../errors/BaseError";
import { CreateUserInputDTO, LoginInputDTO } from "../dtos/users/user.dto";

export class UserController {
    constructor(
        private userBusiness: UserBusiness
    ){}

    public getUsers = async (req: Request, res: Response) => {
        try {
            const input = {
                q: req.query.q,
                token: req.headers.authorization
            }
            const output = await this.userBusiness.getUsers(input)
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createUser = async (req: Request, res: Response) => {
        try {
            const input: CreateUserInputDTO = {
                nickName: req.body.nickName,
                email: req.body.email,
                password: req.body.password
            }
        const output = await this.userBusiness.createUser(input)
        res.status(201).send(output)
        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public login = async (req: Request, res: Response) => {
        try {
            const input: LoginInputDTO = {
                email: req.body.email,
                password: req.body.password
            }
        
        const output = await this.userBusiness.login(input)
        
        res.status(200).send(output)

        } catch (error) {
            console.log(error)
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}