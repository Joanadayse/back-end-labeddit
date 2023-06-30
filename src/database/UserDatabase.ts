import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase{
    public static TABLE_USERS= "users"

    public async insertUser(newUser: UserDB):Promise<void>{
        await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(newUser)
    }
    public async findUserByEmail(email:string):Promise<UserDB | undefined>{
     const [userDB]=await BaseDatabase
     .connection(UserDatabase.TABLE_USERS)
     .select()
     .where({email})

     return userDB as UserDB | undefined
    }
}