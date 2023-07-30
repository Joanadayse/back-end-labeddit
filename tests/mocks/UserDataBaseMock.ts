import { BaseDatabase } from "../../src/database/BaseDatabase";
import { USER_ROLES, UserDB } from "../../src/models/User";



const usersMock: UserDB[] = [
    {
      id: "id-mock-fulano",
      name: "Fulano",
      email: "fulano@email.com",
      password: "hash-mock-fulano", // senha = "fulano123"
      created_at: new Date().toISOString(),
      role: USER_ROLES.NORMAL
    },
    {
      id: "id-mock-astrodev",
      name: "Astrodev",
      email: "astrodev@email.com",
      password: "hash-mock-astrodev", // senha = "astrodev99"
      created_at: new Date().toISOString(),
      role: USER_ROLES.ADMIN
    },
  ]

  export class UserDataBaseMock extends BaseDatabase{
    public static TABLE_USERS= "users"

    public async insertUser(newUser: UserDB):Promise<void>{
    }


    public async findUserByEmail(email:string):Promise<UserDB | undefined>{
     return usersMock.filter(user => user.email === email)[0]
    }
  }