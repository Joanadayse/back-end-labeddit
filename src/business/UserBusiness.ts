import { ZodError } from "zod";
import { UserDatabase } from "../database/UserDatabase";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/users/signup.dto";
import { TokenPayload, USER_ROLES, User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { TokenManager } from "../services/TokenManager";
import { IdGenerator } from "../services/idGenerator";
import { BaseError } from "../errors/BaseError";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/users/login.dto";
import { NotFoundError } from "../errors/NotFountError";
import { BadRequestError } from "../errors/BadRequestError";
import { GetCommentsInputDTO, GetCommentsOutputDTO } from "../dtos/posts/getComments.dto";

export class UserBussiness{
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ){}

    public signup= async(input: SignupInputDTO): Promise<SignupOutputDTO>=>{
      const {name, email, password} = input

      console.log(input)
      
        const id= this.idGenerator.generate()

        const hashedPassword= await this.hashManager.hash(password)
       
        const user= new User(
            id,
            name,
            email,
            hashedPassword,
            USER_ROLES.NORMAL,
            new Date().toISOString()

        ) 
        const userDB= user.toDBModel()
        await this.userDatabase.insertUser(userDB)

        const payload: TokenPayload={
            id:user.getId(),
            name:user.getName(),
            role: user.getRole()
        }

        const token =this.tokenManager.createToken(payload)

        const output : SignupOutputDTO={
            token 
        }

        return output

    }
    


    public login =async (input:LoginInputDTO): Promise<LoginOutputDTO>=>{
        const{email, password}= input

    const userDB= await this.userDatabase.findUserByEmail(email)

    if(!userDB){
        throw new BadRequestError(" email e/ou senha invalidos")
    }

    const user= new User(
        userDB.id,
        userDB.name,
        userDB.email,
        userDB.password,
        userDB.role,
        userDB.created_at
    )

    const hashedPassword= user.getPassword()
    const isPasswordCorrect= await this.hashManager.compare(password, hashedPassword)

    if(!isPasswordCorrect){
        throw new BadRequestError(" email e/ou senha invalidos")
    }

    const payload : TokenPayload={
        id:user.getId(),
        name: user.getName(),
        role: user.getRole()
    }

    const token= this.tokenManager.createToken(payload)

    const output:LoginOutputDTO={
        token
    }

    return output

    }




  

}