import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { BaseError } from "../errors/BaseError";
import {  CreatePostInputDTO,  CreatePostOutputDTO,  DeletePostInputDTO,  DeletePostOutputDTO,  EditPostInputDTO,  EditPostOutputDTO,  GetPostByIdInputDTO,  LikeOrDislikePostInputDTO } from "../dtos/posts/post.dto";


export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ) {}
    public getPosts = async (req: Request, res: Response) => {
        try {
            const input: any = {
                q: req.query.q,
                token: req.headers.authorization
            }
            const output = await this.postBusiness.getPosts(input)
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if(error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public getPostById = async (req: Request, res: Response) => {
        try {
            const input: GetPostByIdInputDTO = {
                id: req.params.id, 
                token: req.headers.authorization
            }
            const output = await this.postBusiness.getPostById(input)
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if(error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createPost = async (req: Request, res: Response) => {
        try {
            const input: CreatePostInputDTO = {
                token: req.headers.authorization,
                content: req.body.content
            }
            await this.postBusiness.createPost(input)
            const output: CreatePostOutputDTO = {
                message: "Post criado com sucesso!",
            }
            res.status(201).send(output)
        } catch (error) {
            console.log(error)
            if(error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public editPost = async (req: Request, res: Response) => {
        try {
            const input: EditPostInputDTO = {
                idToEdit: req.params.id,
                token: req.headers.authorization,
                content: req.body.content
            }
            
            await this.postBusiness.editPost(input)
            const output: EditPostOutputDTO = {
                message: "Post editado com sucesso"
            }
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if(error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public deletePost = async (req: Request, res: Response) => {
        try {
            const input: DeletePostInputDTO = {
                idToDelete: req.params.id,
                token: req.headers.authorization,
            }
            await this.postBusiness.deletePost(input)
            const output: DeletePostOutputDTO = {
                message: "Post apagado com sucesso!"
            }
            res.status(200).send(output)
        } catch (error) {
            console.log(error)
            if(error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public likeOrDislikePost = async (req: Request, res: Response) => {
        try {
            const input: LikeOrDislikePostInputDTO = {
                idToLikeOrDislike: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }
            await this.postBusiness.likeOrDislikePost(input)
            res.status(200).end()
        } catch (error) {
            console.log(error)
            if(error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}