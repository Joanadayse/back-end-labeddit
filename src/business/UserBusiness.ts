import { UserDatabase } from "../database/UserDatabase";
import { CreateUserInputDTO, CreateUserOutputDTO, LoginInputDTO, LoginOutputDTO } from "../dtos/users/user.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { ConflictError } from "../errors/ConflictError";
import { NotFoundError } from "../errors/NotFountError";
import { User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { TokenManager } from "../services/TokenManager"
import { IdGenerator } from "../services/idGenerator";
import { TokenPayLoad, UserDB, USER_ROLES } from "../types";
export class UserBusiness {
    constructor( public userDatabase: UserDatabase, private idGenerator: IdGenerator, private tokenManager: TokenManager, private hashManager: HashManager
        ){}
    public getUsers = async (input: any) => {
        const { q, token } = input
        if(token === undefined) {
            throw new BadRequestError("token ausente")
        }
        const payload = this.tokenManager.getPayload(token)
        if(payload === null) {
            throw new BadRequestError("token inválido")
        }
        if(payload.role !== USER_ROLES.ADMIN) {
            throw new BadRequestError("Somente o administrador de sistema pode acessar esse recurso.")
        }
        const usersDB = await this.userDatabase.findUsers(q)
        const users: User[] = usersDB.map((userDB) => new User(
                userDB.id,
                userDB.nick_name,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_at
        ))
    
        return users
    }

    public createUser = async (input: CreateUserInputDTO) => {
        
        const { nickName, email, password } = input
        
        
        if (typeof nickName !== "string") {
            throw new BadRequestError("'nickName' deve ser string")
        }

        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }
      
        if (!email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)) {
            throw new BadRequestError("'email' deve ser de um domínio válido")
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{6,20}$/g)) {
            throw new BadRequestError("'password' deve possuir entre 6 e 20 caracteres, com letras maiúsculas e minúsculas e no mínimo um número e um caractere especial")
        }

        const userEmailAlreadyExists: UserDB | undefined = await this.userDatabase.searchByEmail(email)

        if(userEmailAlreadyExists) {
            throw new ConflictError("'email' já cadastrado.")
        }

        const id = this.idGenerator.generate()
        const hashadPassword = await this.hashManager.hash(password)
        const role = USER_ROLES.NORMAL
        const createdAt = new Date().toISOString()
        const newUser = new User( id, nickName, email, hashadPassword, role, createdAt )
        const newUserDB = newUser.toDBModel()
        await this.userDatabase.insertUser(newUserDB)

        const payload: TokenPayLoad = { id: newUser.getId(), nickName: newUser.getNickName(), role: newUser.getRole() }
        const token = this.tokenManager.createToken(payload)
        const output: CreateUserOutputDTO = { message: "Usuário criado com sucesso", token: token }

        return output
    }

    public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
        
        const { email, password } = input
                
        if (typeof email !== "string") {
            throw new BadRequestError("'email' deve ser string")
        }

        if (typeof password !== "string") {
            throw new BadRequestError("'password' deve ser string")
        }
        const userDB: UserDB | undefined = await this.userDatabase.searchByEmail(email)

        if(!userDB) {
            throw new NotFoundError("'email' não cadastrado")                
        }

        const newUser = new User( userDB.id, userDB.nick_name, userDB.email, userDB.password, userDB.role, userDB.created_at
        )
        const hashedPassword = newUser.getPassword()

        const passwordMatches = await this.hashManager.compare(password, hashedPassword)

        if(!passwordMatches) {
            throw new BadRequestError("'password' incorreto")
        }

        const payload: TokenPayLoad = { id: newUser.getId(), nickName: newUser.getNickName(), role: newUser.getRole() }
        const token = this.tokenManager.createToken(payload)
        const output: LoginOutputDTO = {
            message: "Login realizado com sucesso",
            token: token
        }

        return output
    }

}