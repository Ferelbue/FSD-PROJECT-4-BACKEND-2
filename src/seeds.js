
import User from "./users/User.js";
import Post from "./posts/Posts.js";
import { faker } from '@faker-js/faker';
import "dotenv/config";
import { dbConnection } from "./db.js";
import mongoose from "mongoose";

let usersId = []

export const seedDatabase = async () => {
    try {
        await dbConnection();

        //Generate fixed test users
        const user1 = new User({
            firstName: "user",
            lastName: "user",
            email: "user@user.com",
            password: "$2b$08$lV2.D7/ibyEeWGbaJibeb.FknmnrSlcfpsYfNqbgZJJ0pKolyvObG",
            role: "user",
            public: "true"
        })
        await user1.save();

        const user2 = new User({
            firstName: "admin",
            lastName: "admin",
            email: "admin@admin.com",
            password: "$2b$08$lV2.D7/ibyEeWGbaJibeb.FknmnrSlcfpsYfNqbgZJJ0pKolyvObG",
            role: "admin",
            public: "true"
        })
        await user2.save();

        const user3 = new User({
            firstName: "superAdmin",
            lastName: "superAdmin",
            email: "superAdmin@superAdmin.com",
            password: "$2b$08$lV2.D7/ibyEeWGbaJibeb.FknmnrSlcfpsYfNqbgZJJ0pKolyvObG",
            role: "super-admin",
            public: "true"
        })
        await user3.save();

        // Generate ramdom users
        for (let i = 0; i < 7; i++) {

            const user = new User({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: "$2b$08$lV2.D7/ibyEeWGbaJibeb.FknmnrSlcfpsYfNqbgZJJ0pKolyvObG",
                public: faker.datatype.boolean()
            })
            await user.save();
            const userId = user._id.toString()
            usersId.push(userId)
        }

        console.log("---------------------------------------")
        console.log("++++++++ USUARIOS CREADOS (10) ++++++++")
        console.log("---------------------------------------")

        //Generate ramdom posts
        for (let i = 0; i < 50; i++) {

            const user = new Post({
                title: faker.word.words(5),
                description: faker.word.words(50),
                userId: usersId[Math.floor(Math.random() * usersId.length)]
            })
            await user.save();
        }

        console.log("---------------------------------------")
        console.log("++++++++++ POSTS CREADOS (50) +++++++++")
        console.log("---------------------------------------")

    } catch (error) {
        console.log(error);

    } finally {
        mongoose.connection.close();
    }
}

seedDatabase()
