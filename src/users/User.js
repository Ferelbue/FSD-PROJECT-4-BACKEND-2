
import { Schema, model } from "mongoose";

export const UserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: false
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
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'super-admin'],
            default: 'user'
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const User = model('User', UserSchema)

export default User