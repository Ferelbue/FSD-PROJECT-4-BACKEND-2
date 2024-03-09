
import { Schema, model } from "mongoose";

export const PostSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        like: {
            type: Boolean,
            require: false,
            default: false,
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Post = model('Post', PostSchema)

export default Post