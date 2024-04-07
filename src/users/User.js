
import { Schema, model } from "mongoose";
import { boolean } from "webidl-conversions";

export const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: false
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        image: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'super-admin'],
            default: 'user'
        },
        public: {
            type: Boolean,
            required: true,
            default: false
        },
        following: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        follower: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Post'
            }
        ],
        commentarys: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Post'
            }
        ]
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const User = model('User', UserSchema)

export default User