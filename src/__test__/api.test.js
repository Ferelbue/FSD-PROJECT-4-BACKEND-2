import request from "supertest"
import { dbConnection } from "../database/db.js"
import { app } from "../app.js"
import "dotenv/config"
import mongoose from "mongoose"

let server
let superToken = "";
let userToken = "";


beforeAll(async () => {
    await dbConnection()

    server = app.listen(4001)
})

afterAll(async () => {
    try {
        if (server) {
            await server.close()
            console.log('Server closed')
        }

        await mongoose.connection.close()
    } catch (error) {
        console.error('Error closing server and destroying database connection:', error)
        throw error
    }
})

//SERVER CONNECTED TEST

describe("server test", () => {

    test("get healthy", async () => {
        const { status, body } = await request(server)
            .get("/api/healthy")

        expect(status).toBe(200)
        expect(body).toEqual({
            success: true,
            message: "Server is healthy",
        })
    })
})


//REGISTER TESTS

let userId;

describe('register tests', () => {

    test('register user', async () => {
        const { status, body } = await request(server)
            .post('/api/auth/register')
            .send({
                firstName: "Pepe",
                email: "pepe@pepe.com",
                password: "123456"
            })

        expect(status).toBe(201)

        userId = body.data.userId
    })

    test('register user wihtout password', async () => {
        const { status, body } = await request(server)
            .post('/api/auth/register')
            .send({
                firstName: "Pepe",
                email: "pepe@pepe.com",
                password: ""
            })
        expect(status).toBe(400)
    })

    test('register user wrong email', async () => {
        const { status, body } = await request(server)
            .post('/api/auth/register')
            .send({
                firstName: "Pepe",
                email: "pepepepecom",
                password: "123456"
            })
        expect(status).toBe(400)
    })

    test('register user short password', async () => {
        const { status, body } = await request(server)
            .post('/api/auth/register')
            .send({
                firstName: "Pepe",
                email: "pepe@pepe.com",
                password: "12345"
            })
        expect(status).toBe(401)
    })

    test('register user long password', async () => {
        const { status, body } = await request(server)
            .post('/api/auth/register')
            .send({
                firstName: "Pepe",
                email: "pepe@pepe.com",
                password: "123456778945612304562"
            })
        expect(status).toBe(401)
    })

})

//LOGIN TESTS

describe('login tests', () => {

    test('login user', async () => {
        const { status, body } = await request(server)
            .post('/api/auth/login')
            .send({
                email: "super@super.com",
                password: "123456"
            })

        expect(status).toBe(202)

        superToken = body.token
    })

    test('login user', async () => {
        const { status, body } = await request(server)
            .post('/api/auth/login')
            .send({
                email: "pepe@pepe.com",
                password: "123456"
            })

        expect(status).toBe(202)

        userToken = body.token
    })

    test('login user wrong email', async () => {
        const { status, body } = await request(server)
            .post('/api/auth/login')
            .send({
                email: "s@s.com",
                password: "123456"
            })

        expect(status).toBe(500)
    })

    test('login user wrong format email', async () => {
        const { status, body } = await request(server)
            .post('/api/auth/login')
            .send({
                email: "pepepepecom",
                password: "123456"
            })

        expect(status).toBe(400)
    })

    test('login user wrogn password', async () => {
        const { status, body } = await request(server)
            .post('/api/auth/login')
            .send({
                email: "pepepepecom",
                password: "123465"
            })

        expect(status).toBe(400)
    })

    test('login user short password', async () => {
        const { status, body } = await request(server)
            .post('/api/auth/login')
            .send({
                email: "pepepepecom",
                password: "12346"
            })

        expect(status).toBe(404)
    })

    test('login user long password', async () => {
        const { status, body } = await request(server)
            .post('/api/auth/login')
            .send({
                email: "pepepepecom",
                password: "12346456123456789456123"
            })

        expect(status).toBe(404)
    })
})


describe('user tests', () => {

    test('get all users', async () => {

        const { status, body } = await request(server)
            .get('/api/users')
            .set('Authorization', `Bearer ${superToken}`)

        expect(status).toBe(200)
    })

    test('get all users wihtout TOKEN', async () => {

        const { status, body } = await request(server)
            .get('/api/users')
            .set('Authorization', 'Bearer')

        expect(status).toBe(401)
    })

    test('get user profile', async () => {

        const { status, body } = await request(server)
            .get('/api/users/profile')
            .set('Authorization', `Bearer ${superToken}`)

        expect(status).toBe(200)
    })

    test('get user profile wihtout TOKEN', async () => {

        const { status, body } = await request(server)
            .get('/api/users/profile')
            .set('Authorization', 'Bearer')
 
        expect(status).toBe(401)
    })

    test('update user profile', async () => {

        const { status, body } = await request(server)
            .put('/api/users/profile')
            .set('Authorization', `Bearer ${superToken}`)
            .send({
                email: "jose@jose.com"
            })

        expect(status).toBe(200)
    })

    test('update user profile email', async () => {

        const { status, body } = await request(server)
            .put('/api/users/profile')
            .set('Authorization', `Bearer ${superToken}`)
            .send({
                email: "super@super.com"
            })

        expect(status).toBe(200)
    })

    test('update user profile email', async () => {

        const { status, body } = await request(server)
            .put('/api/users/profile')
            .set('Authorization', `Bearer ${superToken}`)
            .send({
                email: "supersuper.com"
            })

        expect(status).toBe(400)
    })

    test('update user profile', async () => {

        const { status, body } = await request(server)
            .put('/api/users/profile')
            .set('Authorization', `Bearer ${superToken}`)
            .send({
            })
        expect(status).toBe(400)
    })

    test('update user profile', async () => {

        const { status, body } = await request(server)
            .put('/api/users/profile')
            .set('Authorization', `Bearer ${superToken}`)
            .send({
            })
        expect(status).toBe(400)
    })

    test('update user role superToken', async () => {

        const { status, body } = await request(server)
            .put(`/api/users/${userId}/role`)
            .set('Authorization', `Bearer ${superToken}`)
            .send({
                role: "admin"
            })

        expect(status).toBe(200)
    })

    test('update user role userToken', async () => {

        const { status, body } = await request(server)
            .put(`/api/users/${userId}/role`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
                role: "admin"
            })

        expect(status).toBe(401)
    })
    
    test('update user role userToken', async () => {

        const { status, body } = await request(server)
            .put(`/api/users/${userId}/role`)
            .set('Authorization', `Bearer ${superToken}`)
            .send({

            })

        expect(status).toBe(400)
    })

    test('update user role wrong role', async () => {

        const { status, body } = await request(server)
            .put(`/api/users/${userId}/role`)
            .set('Authorization', `Bearer ${superToken}`)
            .send({
                role: "admi"
            })

        expect(status).toBe(400)
    })

    test('get post by user ID', async () => {

        const { status, body } = await request(server)
            .get(`/api/users/posts/${userId}`)
            .set('Authorization', `Bearer ${superToken}`)

        expect(status).toBe(200)
    })

    test('get post by user ID', async () => {

        const { status, body } = await request(server)
            .get(`/api/users/posts/${userId}`)
            .set('Authorization', `Bearer ${userToken}`)

        expect(status).toBe(401)
    })

    test('get post by user ID', async () => {

        const { status, body } = await request(server)
            .get(`/api/users/posts/`)
            .set('Authorization', `Bearer ${superToken}`)

        expect(status).toBe(404)
    })
    
    test('follow user by ID', async () => {

        const { status, body } = await request(server)
            .put(`/api/users/follow/${userId}`)
            .set('Authorization', `Bearer ${superToken}`)

        expect(status).toBe(200)
    })

    test('follow user by ID wrong ID', async () => {

        const { status, body } = await request(server)
            .put(`/api/users/follow/${1}`)
            .set('Authorization', `Bearer ${superToken}`)

        expect(status).toBe(500)
    })

    test('delete user wrong ID', async () => {

        const { status, body } = await request(server)
            .delete(`/api/users/${1}`)
            .set('Authorization', `Bearer ${superToken}`)

        expect(status).toBe(500)
    })

    test('delete user userToken', async () => {

        const { status, body } = await request(server)
            .delete(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${userToken}`)

        expect(status).toBe(401)
    })


    test('delete user', async () => {

        const { status, body } = await request(server)
            .delete(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${superToken}`)

        expect(status).toBe(200)
    })

})