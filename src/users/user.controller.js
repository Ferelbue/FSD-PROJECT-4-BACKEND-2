
import { handleError } from "../utils/handleError.js";
import User from "./User.js";



export const getUsers = async (req, res) => {

    try {
        const users = await User
            .find()
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
        if (error.message === "Any user found to retireve") {
            return handleError(res, error.message, 400)
        }

        handleError(res, "Cant retrieve any book", 500)
    }
}





// export const addBookToFavourite = async (req, res) => {
//     try {
//         const bookId = req.body.bookId;
//         // debe venir por el token
//         const userId = req.body.userId;

//         const user = await User.findOne(
//             {
//                 _id: userId
//             }
//         )

//         // console.log(user);

//         //validacion de si el user existe

//         user.favouriteBooks.push(bookId);
//         await user.save();

//         res.status(200).json(
//             {
//                 success: true,
//                 message: `Book added to user as favourite`,
//             }
//         )
//     } catch (error) {
//         res.status(500).json(
//             {
//                 success: false,
//                 message: "Book cant added to user as favourite",
//                 error: error.message
//             }
//         )
//     }
// }