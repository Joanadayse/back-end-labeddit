import { z } from "zod";

export interface SignupInputDTO{
    name: string,
    email: string,
    password: string
}

export interface SignupOutputDTO{
   token: string
}

export const SignupSchema = z.object({
    name: z.string({invalid_type_error: "name deve ser do tipo string", required_error: "'name' é obrigatório",}).min(2), 
    email:z.string({invalid_type_error: "email deve ser do tipo string", required_error: "'email' é obrigatório",}),
    password: z.string({invalid_type_error: "password deve ser do tipo string", required_error: "'password' é obrigatório",}).min(6)
}).transform(data => data as SignupInputDTO)