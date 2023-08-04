import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './routes/userRouter'
import { postRouter } from './routes/postRouter'
import { commentRouter } from './routes/commentsRouter'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.listen(Number(process.env.PORT || 3003), () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`)
})

app.use("/users", userRouter)
app.use("/posts", postRouter)
app.use("/comments", commentRouter)

app.get("/ping", (req,res)=>{
    res.send("Pong!")
})