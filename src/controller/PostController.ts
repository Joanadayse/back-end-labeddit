import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { CreatePostSchema } from "../dtos/posts/createPosts.dto";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";

export class PostController{
    constructor(
        private postBusiness: PostBusiness
    ){}
    
    public createPost = async (req: Request , res: Response)=>{
        try{
          const input= CreatePostSchema.parse({
            content: req.body.content,
            token: req.headers.authorization
          })
          console.log(req.body)
          console.log(req.headers)

          const output= await this.postBusiness.createPost(input)
          res.status(201).send(output)

        }catch(error){
            console.log(error)

            if (error instanceof ZodError) {
              res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
              res.status(error.statusCode).send(error.message)
            } else {
              res.status(500).send("Erro inesperado")
            }
        }
    }
}