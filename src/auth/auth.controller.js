
import bcrypt from "bcrypt";
import "dotenv/config";
import jwt from "jsonwebtoken";
import User from "../users/User.js";
import { handleError } from "../utils/handleError.js";

export const register = async (req, res) => {

    try {

        //Retrive data
        const firstName = req.body.firstName
        const lastName = req.body.lastName
        const email = req.body.email
        const password = req.body.password

        //Data input validation
        if(!firstName || !email || !password){
            throw new Error("First name, email and password are mandatory to register")
        }

        //Password validation
        if (password.length < 6 || password.length > 20) {
            throw new Error("Password must contain between 6 and 10 characters")
        }

        //Email validation
        const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;

        if (!validEmail.test(email)) {
            throw new Error("format email invalid")
        }

        //Encrypt password
        const passwordEncrypted = bcrypt.hashSync(password, 10)

        //Create in data base
        const newUser = await User.create(
            {
                email: email,
                password: passwordEncrypted,
                firstName: firstName,
                lastName: lastName
            }
        )

        //Data response
        const printUser = {
            userId:newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role
        }

        //Response
        res.status(201).json({
            success: true,
            message: "User registered succesfully",
            data: printUser
        })

    } catch (error) {

        if (error.message === "First name, email and password are mandatory to register") {
            return handleError(res, error.message, 400)
        }
        if (error.message === "Password must contain between 6 and 10 characters") {
            return handleError(res, error.message, 401)
        }

        if (error.message === "format email invalid") {
            return handleError(res, error.message, 400)
        }
        
        handleError(res, "Cant create book", 500)
    }
}

export const login = async (req, res) => {

    try {

        //Retrieve data
        const email = req.body.email
        const password = req.body.password

        //Validation data
        if (!email || !password) {
            throw new Error("email and password are mandatories")
        }

        //Password validation
        if (password.length < 6 || password.length > 20) {
            throw new Error("Password must contain between 6 and 10 characters")
        }

        //Email validation
        const validEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        if (!validEmail.test(email)) {
            throw new Error("Email format is not valid")
        }

        //Find in BD
        const user = await User.findOne(
            {
                email: email
            }
        )

        const isValidPassword = bcrypt.compareSync(password, user.password)

        if (!isValidPassword) {
            throw new Error("Email or password invalid")
        }

        if (!user) {
            throw new Error("Email or password invalid")
        }

        //TOKEN CREATION
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

        res.status(202).json({
            success: true,
            message: "User logged succesfully",
            token: token
        })

    } catch (error) {

        if (error.message === "email and password are mandatories") {
            return handleError(res, error.message, 404)
        }
        if (error.message === "Password must contain between 6 and 10 characters") {
            return handleError(res, error.message, 404)
        }

        if (error.message === "Email format is not valid") {
            return handleError(res, error.message, 400)
        }
        
        if (error.message === "Email or password invalid") {
            return handleError(res, error.message, 400)
        }
        
        handleError(res, "User cant login", 500)
    }
}
