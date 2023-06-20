import { UserDatabase } from "../database/UserDatabase";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/users/signup.dto";
import { TokenPayload, USER_ROLES, User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { TokenManager } from "../services/TokenManager";
import { IdGenerator } from "../services/idGenerator";

export class UserBussiness{
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ){}

    // public signup= async(input: SignupInputDTO): Promise<SignupOutputDTO>=>{
    //   const {name, email, password} = input

    //   console.log(input)
      
    //     const id= this.idGenerator.generate()

    //     const hashedPassword= await this.hashManager.hash(password)
       
    //     const user= new User(
    //         id,
    //         name,
    //         email,
    //         hashedPassword,
    //         USER_ROLES.NORMAL,
    //         new Date().toISOString()

    //     ) 
    //     const userDB= user.toDBModel()
    //     await this.userDatabase.insertUser(userDB)

    //     const payload: TokenPayload={
    //         id:user.getId(),
    //         name:user.getName(),
    //         role: user.getRole()
    //     }

    //     const token =this.tokenManager.createToken(payload)

    //     const output : SignupOutputDTO={
    //         token 
    //     }

    //     return output

    // }

    public signup =async(input:SignupInputDTO):Promise<SignupOutputDTO>=>{
        const {name, email, password}= input

        console.log(email)

    //   const userDBExist= await this.usersDataBase.findByEmail(email);
    //     if (userDBExist) {
    //         throw new BadRequestError("'email' já existe")
    //       }

          const id= this.idGenerator.generate()

        	const hashedPassword = await this.hashManager.hash(password)

          const newUser = new User(
          id,
          name,
          email,
          hashedPassword,
          USER_ROLES.NORMAL,
          new Date().toISOString()
       
          );

          const newUsers= newUser.toDBModel()
          await this.userDatabase.insertUser(newUsers)

          const payload: TokenPayload= {
            id:newUser.getId(),
            name:newUser.getName(),
            role:newUser.getRole(),
          
          }

          const token= this.tokenManager.createToken(payload)


          const output : SignupOutputDTO={
            token
          }

          return output



    }

}