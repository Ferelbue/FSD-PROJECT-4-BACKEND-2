
import { handleError } from "../utils/handleError.js";
import User from "../users/User.js";
import Post from "./Posts.js";

export const createPost = async (req, res) => {

    try {
        //Retrive data
        const userId = req.tokenData.userId
        const title = req.body.title
        const description = req.body.description
        const image = req.body.image

        const user = await User.findById(userId)


        //Data validation
        if (!title && !description) {
            throw new Error("You should to introuce any data to update")
        }

        //Create in data base
        const newPost = await Post.create({
            title,
            description,
            image,
            userId: user._id,
            userName: user.firstName
        })
        //Data response
        console.log(newPost)
        const printDescription = {
            title: newPost.title,
            description: newPost.description,
            image: newPost.image,
            user: newPost.userId,
            userName: newPost.userName
        }

        //Response
        res.status(201).json({
            success: true,
            message: "User registered succesfully",
            data: printDescription
        })

    } catch (error) {

        if (error.message === "You should to introuce any data to update") {
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
        const userId = req.tokenData.userId

        const userLoged = req.tokenData.userId
        const roleLoged = req.tokenData.roleName

        const post = await Post.findById(postId)

        if ((userLoged !== post.userId) && (roleLoged !== "super-admin")) {
            throw new Error("You dont have permitions to modidy this role")
        }

        if (!post) {
            throw new Error("Any post to delete")
        }

        if ((userId !== post.userId) && ((roleLoged !== "super-admin"))) {
            throw new Error("Cant delete another person post")
        }

        const postToDelete = await Post.findOneAndDelete(
            {
                _id: postId
            }
        )
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
        if (error.message === "Any post to update") {
            return handleError(res, error.message, 400)
        }
        if (error.message === "Cant modificate another person post") {
            return handleError(res, error.message, 400)
        }

        handleError(res, "Cant delete any post", 500)
    }
}

export const updatePostById = async (req, res) => {

    try {
        const userId = req.tokenData.userId
        const postId = req.params.id

        const title = req.body.title
        const description = req.body.description
        const image = req.body.image

        const post = await Post.findById(postId)
        console.log(post.userId.toString())
        console.log(userId)


        if (!title && !description && !image) {
            throw new Error("You should to introuce any data to update")
        }

        if (!post) {
            throw new Error("Any post to update")
        }

        if (userId !== post.userId.toString()) {
            throw new Error("Cant modificate another person post")
        }

        const postUpdated = await Post.findOneAndUpdate(
            {
                _id: postId
            },
            {
                title,
                description,
                image
            },
            {
                new: true
            },
        )
            .select('-_id -userId -createdAt ')

        res.status(200).json({
            success: true,
            message: "Post updated",
            data: postUpdated
        })

    } catch (error) {
        if (error.message === "You should to introuce any data to update") {
            return handleError(res, error.message, 400)
        }
        if (error.message === "Cant modificate another person post") {
            return handleError(res, error.message, 400)
        }
        if (error.message === "Any post to update") {
            return handleError(res, error.message, 400)
        }

        handleError(res, "Cant update any post", 500)
    }
}

export const getUserPosts = async (req, res) => {

    try {
        //Pagination
        const pageElements = req.query.limit;
        const actualPage = req.query.page;
        const skip = (actualPage - 1) * pageElements;
        const userId = req.tokenData.userId

        const userPosts = await Post
            .find({ userId: userId })
            .select('-password -createdAt -updatedAt')
            .skip(skip)
            .limit(pageElements);

        if (!userPosts) {
            throw new Error("Any user found to retireve")
        }

        res.status(200).json({
            success: true,
            message: "User retrieved",
            data: userPosts
        })

    } catch (error) {
        if (error.message === "Any user found to retireve") {
            return handleError(res, error.message, 400)
        }

        handleError(res, "Cant retrieve any user", 500)
    }
}

export const getPosts = async (req, res) => {

    try {
        //Pagination
        const actualPage = req.query.page;
        const pageElements = req.query.limit;
        const skip = (actualPage - 1) * pageElements;
        console.log(pageElements)
        console.log(actualPage)
        const roleName = req.tokenData.roleName

        const queryFilters = {}

        if (req.query.title) {
            queryFilters.title = new RegExp(req.query.title,'i');   
        }

        const posts = await Post
            .find(queryFilters)
            .select('-password -updatedAt')
            .populate('userId', 'firstName')
            .skip(skip)
            .limit(pageElements);

        if (!posts) {
            throw new Error("Any post found to retireve")
        }

        let publicPosts = []
        console.log(roleName)
        if (roleName === "super-admin" || roleName === "super") {

            return res.status(200).json({
                success: true,
                message: "User retrieved",
                data: posts
            })

        } else {
            for (let i = 0; i < posts.length; i++) {
                const userPublicPosts = await User
                    .find({ _id: posts[i].userId, public: true })
                    .select('-password -createdAt -updatedAt')

                if (userPublicPosts.length > 0) {
                    publicPosts.push(posts[i])
                }
            }
            console.log(publicPosts)

            return res.status(200).json({
                success: true,
                message: "User retrieved",
                data: publicPosts
            })
        }

    } catch (error) {
        if (error.message === "Any post found to retireve") {
            return handleError(res, error.message, 400)
        }

        handleError(res, "Cant retrieve any post", 500)
    }
}

export const getPostById = async (req, res) => {

    try {
        const postId = req.params.id
        const userId = req.tokenData.userId
        console.log(postId)
        console.log(userId)
        const post = await Post.findById(postId)

        if (!post) {
            throw new Error("Any post to retrieve")
        }

        if (userId !== post.userId) {
            throw new Error("Cant retrieve another person post")
        }

        res.status(200).json({
            success: true,
            message: "Post retrieved succesfully",
            data: post
        })

    } catch (error) {
        if (error.message === "Any post to retrieve") {
            return handleError(res, error.message, 400)
        }
        if (error.message === "Cant retrieve another person post") {
            return handleError(res, error.message, 400)
        }

        handleError(res, "Cant retrieve any post", 500)
    }
}

export const postLike = async (req, res) => {

    try {

        const postId = req.params.id
        const userId = req.tokenData.userId

        const post = await Post.findById(postId)
        const user = await User.findById(userId)

        if (post.like.includes(userId)) {

            post.like.splice(post.like.indexOf(userId), 1)
            await post.save()

            user.likes.splice(user.likes.indexOf(postId), 1)
            await user.save()

        } else {

            post.like.push(userId)
            await post.save();

            user.likes.push(postId)
            await user.save();
        }

        const postUpdated = await Post.find(
            {
                _id: postId
            }
        ).select('-_id -userId -createdAt -comments')

        res.status(200).json({
            success: true,
            message: "User updated",
            data: postUpdated
        })

    } catch (error) {
        if (error.message === "You should to introuce any data to update") {
            return handleError(res, error.message, 400)
        }
        if (error.message === "Cant modificate another person post") {
            return handleError(res, error.message, 400)
        }
        if (error.message === "Any post to update") {
            return handleError(res, error.message, 400)
        }

        handleError(res, "Cant update any post", 500)
    }
}

export const postComment = async (req, res) => {

    try {

        const postId = req.params.id
        const commentatorId = req.tokenData.userId
        const commentary = req.body.commentary

        const post = await Post.findById(postId)
        const user = await User.findById(commentatorId)

        post.comments.push({ commentatorName: user.firstName, commentary: commentary })
        await post.save();

        const post2 = await Post.findById(postId)

        const positionLastComment = post2.comments.length - 1

        user.commentarys.push(post2.comments[positionLastComment]._id)
        await user.save();

        const postUpdated = await Post.find(
            {
                _id: postId,
            }
        ).select('-_id -userId -createdAt')

        res.status(200).json({
            success: true,
            message: "Comment updated",
            data: postUpdated
        })

    } catch (error) {

        if (error.message === "Any post to update") {
            return handleError(res, error.message, 400)
        }

        handleError(res, "Cant update any post", 500)
    }
}

export const getFollowersPosts = async (req, res) => {

    try {
        //Pagination
        const userId = req.tokenData.userId
        let posts = []
        const user = await User.findById(userId)

        for (let i = 0; i < user.follower.length; i++) {
            const post = await Post.find(
                {
                    userId: user.follower[i]
                }
            ).select('-_id -comments -updatedAt')
            posts.push(post)
        }

        return res.status(200).json({
            success: true,
            message: "User retrieved",
            data: posts
        })


    } catch (error) {
        if (error.message === "Any post found to retireve") {
            return handleError(res, error.message, 400)
        }

        handleError(res, "Cant retrieve any post", 500)
    }
}