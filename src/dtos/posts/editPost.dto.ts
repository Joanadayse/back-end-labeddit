
import z from "zod"

export interface EditPostInputDTO{
    content: string,
    token:string,
    idToEdit:string
    
}
export type EditPostOutputDTO = undefined


export const EditPostScherma= z.object({
    content: z.string().min(2),
    token: z.string().min(2),
    idToEdit:z.string().min(2) 
}).transform(data => data as EditPostInputDTO)