
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
        like: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        comment: [
            {
                text: { type: String },
                userId: { type: Schema.Types.ObjectId, ref: 'User' },
                likes: { type: Schema.Types.ObjectId, ref: 'User' }
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