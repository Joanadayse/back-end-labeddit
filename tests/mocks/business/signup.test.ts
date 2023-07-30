import { UserBussiness } from "../../../src/business/UserBusiness"
import { SignupSchema } from "../../../src/dtos/users/signup.dto"
import { HashManagerMock } from "../HashManagerMock"
import { IdGeneratorMock } from "../IdGeneratorMock"
import { TokenManagerMock } from "../TokenManagerMock"
import { UserDataBaseMock } from "../UserDataBaseMock"

describe("testando signup",()=>{
    const userBusiness= new UserBussiness(
        new UserDataBaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("deve gerar um token ao cadastrar", async()=>{
        const input = SignupSchema.parse({
            name: "Maria lucia",
            email: "mariaLucia@email.com",
            password: "123456"    
        })

        const output = await userBusiness.signup(input)

        expect(output).toEqual({
            token:"token-mock"
        })
    })

})