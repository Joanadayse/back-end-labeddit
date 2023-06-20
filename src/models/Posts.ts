export interface PostDB{
    id:string,
    creator_id:string,
    content: string,
    likes: number,
    dislikes:number,
    created_at: string,
    updated_at: string

}

export interface PostModel{
    id:string,
    creatorId:string,
    content: string,
    likes: number,
    dislikes:number,
    createdAt: string,
    updatedAt: string,
    creator:{
        id:string,
        name:string
    }
}

export class Post{
    constructor(
     private   id:string,
     private   content: string,
     private   likes: number,
     private   dislikes:number,
     private   createdAt: string,
     private   updatedAt: string,
     private   creatorId: string,
     private   creatorName:string
        

    ){}

    public getId(): string{
        return this.id
    }

    public setId(value:string):void{
        this.id= value

    }
    public getName(): string{
        return this.creatorName
    }

    public setName(value:string):void{
        this.creatorName= value

    }

    public getCreatorId(): string{
        return this.creatorId
    }

    public setCreatorId(value:string):void{
        this.creatorId= value

    }

    public getContent(): string{
        return this.content
    }

    public seTcontent(value:string):void{
        this.content= value

    }
    public getLikes(): number{
        return this.likes
    }

    public setLikes(value:number):void{
        this.likes= value

    }
    public addLike():void{
        this.likes++

    }
    public removeLike():void{
        this.likes--

    }
    public addDisLike():void{
        this.dislikes++

    }
    public removeDisLike():void{
        this.dislikes--

    }


    public getCreateAt(): string{
        return this.createdAt
    }

    public setCreateAt(value:string):void{
        this.createdAt= value

    }
    public getDislikes(): number{
        return this.dislikes
    }

    public setDislikes(value:number):void{
        this.dislikes= value 

    }
    public getUpdateAt(): string{
        return this.updatedAt
    }

    public setUpdateAt(value:string):void{
        this.updatedAt= value

    }

    public toDBModel(): PostDB{
        return {
            id: this.id,
            creator_id: this.creatorId,
            content: this.content,
            likes: this.likes,
            dislikes:this.dislikes,
            created_at:this.createdAt,
            updated_at:this.updatedAt
        }
      }



    public toBusinessModel(): PostModel{
        return{
            id:this.id,
            creatorId:this.creatorId,
            content: this.content,
            likes: this.likes,
            dislikes:this.dislikes,
            createdAt:this.createdAt,
            updatedAt:this.updatedAt,
            creator:{
                id: this.creatorId,
                name:this.creatorName
            }

        }
    }
}