import { PostCreatorModel, PostDB } from "../types"

export class Post {
    constructor(
        private id: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private replies: number,
        private createdAt: string,
        private updatedAt: string,
        private creator: {
            id: string,
            nickName: string
        }
    ) {}

    public toDBModel(): PostDB {
        return {  id: this.id, content: this.content, likes: this.likes, dislikes: this.dislikes, replies: this.replies, created_at: this.createdAt, updated_at: this.updatedAt, creator_id: this.creator.id,}}

    public toBusinessModel(): PostCreatorModel {
        return{ id: this.id, content: this.content, likes: this.likes, dislikes: this.dislikes, replies: this.replies, createdAt: this.createdAt, updatedAt: this.updatedAt, creator: this.creator} }

    public getId(): string {
        return this.id
    }

    public setId(value: string): void {
        this.id = value
    }

    public getContent(): string {
        return this.content
    }

    public setContent(value: string): void {
        this.content = value
    }
    public getLikes(): number {
        return this.likes
    }

    public setLikes(value: number): void {
        this.likes = value
    }

    public addLike() {
        this.likes += 1
    }

    public removeLike() {
        this.likes -= 1
    }

    public addDislike() {
        this.dislikes += 1
    }

    public removeDislike() {
        this.dislikes -= 1
    }

    public getDislikes(): number {
        return this.dislikes
    }

    public setDislikes(value: number): void {
        this.dislikes = value
    }

    public getReplies(): number {
        return this.replies
    }

    public setReplies(value: number): void {
        this.replies = value
    }

    public addReply() {
        this.replies += 1
    }

    public removeReply() {
        this.replies -= 1
    }

    public getCreatedAt(): string {
        return this.createdAt
    }

    public setCreatedAt(value: string): void {
        this.createdAt = value
    }

    public getUpdatedAt(): string {
        return this.updatedAt
    }

    public setUpdatedAt(value: string): void {
        this.updatedAt = value
    }
    
    public getCreator(): {
        id: string,
        nickName: string
    } {
        return this.creator
    }

    public setCreator(value: {
        id: string,
        nickName: string
    } ): void {
        this.creator = value
    }
}