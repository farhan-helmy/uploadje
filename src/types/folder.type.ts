import { z } from "zod";

const createFolderRequestSchema = z.object({
    name: z.string().min(1),
    parent_folder_id: z.string().optional()
})

const updateFolderRequestSchema = z.object({
    name: z.string().min(1),

})

export { updateFolderRequestSchema, createFolderRequestSchema }