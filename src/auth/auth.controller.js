
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../users/User.js";


export const register = async (req, res) => {

    try {

        //Retrive data
        const email = req.body.email
        const password = req.body.password

        //Password validation
        if (password.length < 6 || password.length > 20) {
            return res.status(400).json({
                success: false,
                message: "Password must contain between 6 and 10 characters"
            })
        }

        //Email validation
        const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

        if (!validEmail.test(email)) {
            return res.status(400).json({
                success: false,
                message: "format email invalid"
            })
        }

        //Encrypt password
        const passwordEncrypted = bcrypt.hashSync(password, 5)

        //Create in data base
        const newUser = await User.create(
            {
                email: email,
                password: passwordEncrypted
            }
        )

        //Response
        res.status(201).json({
            success: true,
            message: "User registered succesfully",
            data: newUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User cant be registered",
            error: error
        }
        )
    }
}




export const login = async (req, res) => {

    try {

        //Retrieve data
        const email = req.body.email
        const password = req.body.password

        //Validation data
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password are mandatories"
            })
        }

        const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        if (!validEmail.test(email)) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Email format is not valid"
                }
            )
        }

        //Find in BD
        const user = await User.findOne(
            {
                email: email
            }
        )

        if (!user) {
            res.status(400).json({
                success: false,
                message: "Email or password invalid"
            })
        }

        const isValidPassword = bcrypt.compareSync(password, user.password)

        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: "Email or password invalid"
            })
        }

        const token = jwt.sign(
            {
                userId: user._id,
                roleName: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        )
        res.status(200).json({
            success: true,
            message: "User logged succesfully",
            token: token
        })

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "User cant be logged",
            error: error
        })
    }
}
