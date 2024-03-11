import request from "supertest"
import { dbConnection } from "../database/db.js"
import { app } from "../app.js"
import "dotenv/config"
import mongoose from "mongoose"

let server

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

describe("control healthy", () => {
    test("GET healthy", async () => {
        const { status, body } = await request(server).get("/api/healthy")
        expect(status).toBe(200)
        expect(body).toEqual({
            success: true,
            message: "Server is healthy",
        })
    })
})