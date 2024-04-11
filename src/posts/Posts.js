
import { Schema, model } from "mongoose";

export const PostSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        like: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        comments: [
            {
                commentatorName: {
                    type: String
                },
                commentary: {
                    type: String
                }
            }
        ],
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Post = model('Post', PostSchema)

export default Post