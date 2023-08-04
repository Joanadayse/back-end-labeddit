import { Request, Response } from "express"

import { CreateCommentInputDTO, CreateCommentOutputDTO, DeleteCommentInputDTO, DeleteCommentOutputDTO, GetCommentsInputDTO, LikeOrDislikeCommentInputDTO } from "../dtos/comments.DTO"
import { BaseError } from "../errors/BaseError"
import { CommentBusiness } from "../business/CommentsBusiness"

export class CommentController {
    constructor(
        private commentBusiness: CommentBusiness
    ) {}
    public getPostComments = async (req: Request, res: Response) => {
        try {
            const input: GetCommentsInputDTO = {
                token: req.headers.authorization,
                idToReply: req.params.id
            }
            const output = await this.commentBusiness.getPostComments(input)
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

    public createComment = async (req: Request, res: Response) => {
        try {
            const input: CreateCommentInputDTO = {
                token: req.headers.authorization,
                content: req.body.content,
                idToComment: req.params.id
            }
            await this.commentBusiness.createComment(input)
            
            const output: CreateCommentOutputDTO = {
                message: "Comentário criado com sucesso"
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

    public deleteComment = async (req: Request, res: Response) => {
        try {
            const input: DeleteCommentInputDTO = {
                idToDelete: req.params.id,
                token: req.headers.authorization,
            }
            await this.commentBusiness.deleteComment(input)
            const output: DeleteCommentOutputDTO = {
                message: "Comentário apagado com sucesso"
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

    public likeOrDislikeComment = async (req: Request, res: Response) => {
        try {
            const input: LikeOrDislikeCommentInputDTO = {
                idCommentToLikeOrDislike: req.params.id,
                token: req.headers.authorization,
                like: req.body.like
            }
            const output = await this.commentBusiness.likeOrDislikeComment(input)
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
}