
import { handleError } from "../utils/handleError.js";
import User from "../users/User.js";
import Post from "./Posts.js";

export const createPost = async (req, res) => {

    try {

        //Retrive data
        const userId = req.tokenData.userId
        const title = req.body.title
        const description = req.body.description

        const user = await User.findById(userId)

        //Password validation


        //Create in data base
        const newPost = await Post.create({
            title,
            description,
            userId: user._id
        })

        //Data response
        const printDescription = {
            title: newPost.title,
            description: newPost.description,
            user: newPost.userId,
        }

        //Response
        res.status(201).json({
            success: true,
            message: "User registered succesfully",
            data: printDescription
        })

    } catch (error) {

        if (error.message === "Password must contain between 6 and 10 characters") {
            return handleError(res, error.message, 400)
        }

        if (error.message === "format email invalid") {
            return handleError(res, error.message, 400)
        }

        handleError(res, "Cant create post", 500)
    }
}

export const deletePostById = async (req, res) => {

    try {
        const postId = req.params.id
        
        const postToDelete = await Post.findOneAndDelete(
            {
                _id: postId
            }
            )
            console.log(postId)
            console.log(postToDelete)
            .select('-_id -description -updatedAt')

        if (!postToDelete) {
            throw new Error("Any post to update")
        }

        res.status(200).json({
            success: true,
            message: "Post deleted",
            data: postToDelete
        })

    } catch (error) {
        if (error.message === "Any user found to update") {
            return handleError(res, error.message, 400)
        }

        handleError(res, "Cant delete any post", 500)
    }
}





































export const getUsers = async (req, res) => {

    try {

        const queryFilters = {}
        console.log(1)
        // Se declara la constante queryFiters de tipo queryFilters

        if (req.query.firstName) {
            queryFilters.firstName = new RegExp(req.query.firstName);
        }
        if (req.query.lastName) {
            queryFilters.lastName = new RegExp(req.query.lastName);
        }
        if (req.query.email) {
            queryFilters.email = new RegExp(req.query.email);
        }


        const users = await User
            .find(queryFilters)
            .select('-_id -password -createdAt -updatedAt')

        if (!users) {
            throw new Error("Any user found to retireve")
        }



        res.status(200).json({
            success: true,
            message: "all users retrieved",
            data: users
        })

    } catch (error) {
        if (error.message === "Any user found to retireve") {
            return handleError(res, error.message, 400)
        }

        handleError(res, "Cant retrieve any book", 500)
    }
}

export const getUserProfile = async (req, res) => {

    try {
        const name = req.body.name
        console.log(name)
        const userId = req.tokenData.userId
        console.log(userId)
        const user = await User
            .findById(userId)
            .select('-_id -password -createdAt -updatedAt')

        if (!user) {
            throw new Error("Any user found to retireve")
        }

        res.status(200).json({
            success: true,
            message: "User retrieved",
            data: user
        })

    } catch (error) {
        if (error.message === "Any user found to retireve") {
            return handleError(res, error.message, 400)
        }

        handleError(res, "Cant retrieve any book", 500)
    }
}

export const updateUserProfile = async (req, res) => {

    try {
        const userId = req.tokenData.userId
        const firstName = req.body.firstName
        const lastName = req.body.lastName
        const email = req.body.email

        if (!userId || !firstName || !lastName || !email) {
            throw new Error("You should to introuce any data to update")
        }

        const queryFilters = {
            firstName: undefined,
            lastName: undefined,
            email: undefined
        }

        const userUpdated = await User.findOneAndUpdate(
            {
                _id: userId
            },
            {
                firstName,
                lastName,
                email
            },
            {
                new: true
            },
        )
            .select('-_id -password -createdAt -updatedAt')



        res.status(200).json({
            success: true,
            message: "User retrieved",
            data: userUpdated
        })

    } catch (error) {
        if (error.message === "You should to introuce any data to update") {
            return handleError(res, error.message, 400)
        }

        handleError(res, "Cant update any propery", 500)
    }
}

// interface queryFilters {
//     email?: FindOperator<string>,
//     firstName?: FindOperator<string>,
//     lastName?: FindOperator<string>
// }
// // Se declara la constante queryFiters de tipo queryFilters
// const queryFilters: queryFilters = {}

// if (req.query.email) {
//     queryFilters.email = Like("%" + req.query.email.toString() + "%");
// }

export const deleteUserById = async (req, res) => {

    try {
        const userId = req.params.id

        const userUpdated = await User.findOneAndDelete(
            {
                _id: userId
            }
        )
            .select('-_id -password -createdAt -updatedAt')

        if (!userUpdated) {
            throw new Error("Any user found to update")
        }

        res.status(200).json({
            success: true,
            message: "User deleted",
            data: userUpdated
        })

    } catch (error) {
        if (error.message === "Any user found to update") {
            return handleError(res, error.message, 400)
        }

        handleError(res, "Cant update any propery", 500)
    }
}


export const updateUserRole = async (req, res) => {

    try {
        console.log(1)
        const userId = req.params.id
        const role = req.body.role

        if (!role) {
            throw new Error("You should to introuce any data to update")
        }

        const queryFilters = {
            firstName: undefined,
            lastName: undefined,
            email: undefined
        }

        const userUpdated = await User.findOneAndUpdate(
            {
                _id: userId
            },
            {
                role
            },
            {
                new: true
            },
        )
            .select('-_id -password -createdAt -updatedAt')



        res.status(200).json({
            success: true,
            message: "User retrieved",
            data: userUpdated
        })

    } catch (error) {
        if (error.message === "You should to introuce any data to update") {
            return handleError(res, error.message, 400)
        }

        handleError(res, "Cant update any propery", 500)
    }
}