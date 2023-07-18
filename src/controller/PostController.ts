import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { CreatePostSchema } from "../dtos/posts/createPosts.dto";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { GetPostsScherma } from "../dtos/posts/getPosts.dto";
import { PostCommentSchema } from "../dtos/posts/createPostComents.dto";
import { GetCommentsScherma } from "../dtos/posts/getComments.dto";
import { EditPostScherma } from "../dtos/posts/editPost.dto";
import { DeletePostScherma } from "../dtos/posts/deletePost.dto";
import { likeOrDislikePostsScherma } from "../dtos/posts/likeOrDislikePosts.dto";

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

    public getPost= async(req:Request, res:Response)=>{
      try{
        const input= GetPostsScherma.parse({
          token: req.headers.authorization
        })

        const output = await this.postBusiness.getPost(input)
        res.status(200).send(output)

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

    public addComments= async (req:Request, res:Response)=>{
      try {
        const input = PostCommentSchema.parse({
          token: req.headers.authorization,
          postId: req.params.id,
          comments: req.body.comments,
        });

        console.log(input)
  
        const output = await this.postBusiness.addComments(input);
  
        res.status(201).send(output);
      } catch(error){
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


    // public getCommentsPostId= async(req:Request, res:Response)=>{
    //   try{
    //     const input= GetCommentsScherma.parse({
    //       postId: req.params.id
    //     })

    //     const output = await this.postBusiness.getComments(input)
    //     res.status(200).send(output)

    //   }catch(error){
    //       console.log(error)

    //       if (error instanceof ZodError) {
    //         res.status(400).send(error.issues)
    //       } else if (error instanceof BaseError) {
    //         res.status(error.statusCode).send(error.message)
    //       } else {
    //         res.status(500).send("Erro inesperado")
    //       }
    //   }

    // }


    public editPost= async (req:Request, res:Response)=>{
      try {
        const input = EditPostScherma.parse({
          token: req.headers.authorization,
          content: req.body.content,
          idToEdit: req.params.id
        })

        console.log(input)
  
        const output = await this.postBusiness.editPost(input);
  
        res.status(200).send(output);
      } catch(error){
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
    public deletPost= async (req:Request, res:Response)=>{
      try {
        const input = DeletePostScherma.parse({
          token: req.headers.authorization,
          idToDelete: req.params.id
        })

        console.log(input)
  
        const output = await this.postBusiness.deletPost(input);
  
        res.status(200).send(output);
      } catch(error){
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
    public likeOrDislike= async (req:Request, res:Response)=>{
      try {
        const input = likeOrDislikePostsScherma.parse({
          token: req.headers.authorization,
          postId: req.params.id,
          like:req.body.like
        })

        console.log(input)
  
        const output = await this.postBusiness.likeOrDislike(input);
  
        res.status(200).send(output);
      } catch(error){
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