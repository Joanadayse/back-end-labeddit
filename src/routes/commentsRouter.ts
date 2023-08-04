import express from "express"

import { CommentDatabase } from "../database/CommentDatabase"
import { TokenManager } from "../services/TokenManager"
import { PostDatabase } from "../database/PostDatabase"
import { IdGenerator } from "../services/idGenerator"
import { CommentController } from "../controller/CommentsController"
import { CommentBusiness } from "../business/CommentsBusiness"

export const commentRouter  = express.Router()

const commentController = new CommentController(
    new CommentBusiness( new CommentDatabase(), new PostDatabase(), new TokenManager(), new IdGenerator() ))

commentRouter.get("/:id", commentController.getPostComments)
commentRouter.post("/:id", commentController.createComment)
commentRouter.put("/:id/like", commentController.likeOrDislikeComment)
commentRouter.delete("/:id", commentController.deleteComment)