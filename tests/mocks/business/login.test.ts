import { UserBussiness } from "../../../src/business/UserBusiness"
import { LoginSchema } from "../../../src/dtos/users/login.dto"
import { HashManagerMock } from "../HashManagerMock"
import { IdGeneratorMock } from "../IdGeneratorMock"
import { TokenManagerMock } from "../TokenManagerMock"
import { UserDataBaseMock } from "../UserDataBaseMock"


describe("testando login",()=>{
    const userBusiness= new UserBussiness(
        new UserDataBaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("deve gerar um token ao cadastrar", async()=>{
        const input = LoginSchema.parse({
            email: "fulano@email.com",
      password: "fulano123",     
        })

        const output = await userBusiness.login(input)

        expect(output).toEqual({
            token:"token-mock-fulano"
        })
    })

})