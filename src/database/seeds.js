
import User from "../users/User.js";
import Post from "../posts/Posts.js";
import { faker } from '@faker-js/faker';
import "dotenv/config";
import { dbConnection } from "./db.js";
import mongoose from "mongoose";

let usersId = []
let postsId = []

export const seedDatabase = async () => {
    try {
        await dbConnection();

        //Generate fixed test users
        const user1 = new User({
            _id: new mongoose.Types.ObjectId("65ef77678ba420fc69027ce0"),
            firstName: "user",
            lastName: "user",
            email: "user@user.com",
            password: "$2b$08$lV2.D7/ibyEeWGbaJibeb.FknmnrSlcfpsYfNqbgZJJ0pKolyvObG",
            role: "user",
            public: "true"
        })
        await user1.save();

        const user2 = new User({
            _id: new mongoose.Types.ObjectId("65ef77678ba420fc69027ce4"),
            firstName: "admin",
            lastName: "admin",
            email: "admin@admin.com",
            password: "$2b$08$lV2.D7/ibyEeWGbaJibeb.FknmnrSlcfpsYfNqbgZJJ0pKolyvObG",
            role: "admin",
            public: "true"
        })
        await user2.save();

        const user3 = new User({
            _id: new mongoose.Types.ObjectId("65ef77678ba420fc69027ce6"),
            firstName: "superAdmin",
            lastName: "superAdmin",
            email: "super@super.com",
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
        usersId.push(user1._id.toString())
        usersId.push(user2._id.toString())
        usersId.push(user3._id.toString())

        console.log("---------------------------------------")
        console.log("++++++++ USUARIOS CREADOS (10) ++++++++")
        console.log("---------------------------------------")

        //Generate ramdom posts
        for (let i = 0; i < 50; i++) {

            const post = new Post({
                title: faker.lorem.sentence(),
                description: faker.lorem.text(),
                userId: usersId[Math.floor(Math.random() * usersId.length)],
                comments: {
                    commentatorId: usersId[Math.floor(Math.random() * usersId.length)],
                    commentary: faker.lorem.paragraph()
                },
                like: [usersId[Math.floor(Math.random() * usersId.length)], usersId[Math.floor(Math.random() * usersId.length)], usersId[Math.floor(Math.random() * usersId.length)]]
            })
            await post.save();
            const post2 = post._id.toString()
            postsId.push(post2)
        }

        for (let i = 0; i < usersId.length; i++) {
            const update = await User.findOneAndUpdate(
                {
                    _id: usersId[i],
                },
                {
                    following: usersId[Math.floor(Math.random() * usersId.length)],
                    follower: usersId[Math.floor(Math.random() * usersId.length)],
                    likes: postsId[Math.floor(Math.random() * usersId.length)],
                    commentarys: postsId[Math.floor(Math.random() * usersId.length)]
                }
            )
            await update.save();
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
