export interface GetUserInputDTO { q: string | string[] | undefined , token: string | undefined }

export interface CreateUserInputDTO { nickName: unknown, email: unknown, password: unknown }

export interface CreateUserOutputDTO { message: string, token: string }

export interface GetUserOutputDTO { message: string, 
    user: {
        id: string,
        nickName: string,
        email: string,
        createdAt: string
    }
}

export interface LoginInputDTO { email: unknown,  password: unknown }

export interface LoginOutputDTO { message: string, token: string }