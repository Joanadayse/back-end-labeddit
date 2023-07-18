import express from "express"
import { PostController } from "../controller/PostController"
import { PostBusiness } from "../business/PostBusiness"
import { PostDatabase } from "../database/PostDatabase"
import { IdGenerator } from "../services/idGenerator"
import { TokenManager } from "../services/TokenManager"
import { HashManager } from "../services/HashManager"

export const postRouter= express.Router()


const postController= new PostController(
    new PostBusiness(
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager(),
        
    )
)

postRouter.post("/",postController.createPost)
postRouter.get("/",postController.getPost )
postRouter.post("/:id/comments", postController.addComments);
postRouter.put("/:id", postController.editPost);
postRouter.delete("/:id", postController.deletPost);
postRouter.put("/:id/like", postController.likeOrDislike);