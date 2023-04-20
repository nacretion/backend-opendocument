const request = require('supertest');
const app = request(require('../app'));
const {saveFile, removeFile} = require('../utils/file');
const {signUser} = require('../utils/user');
const db = require('../database')

const registerPath = '/api/user/register'

describe('POST ' + registerPath, () => {

    const login = "testUser", password = "testPassword", name = "testName"

    it("user can be created",async () => {
        const response = await app
            .post(registerPath)
            .field('login', login)
            .field('password', password)
            .field('name', name)
            .expect(200)
    })


    it('400 if some fields are blank', async () => {
        const noLogin = await app
            .post(registerPath)
            .field('password', password)
            .field('name', name)
            .expect(400)
        const noPassword = await app
            .post(registerPath)
            .field('login', login)
            .field('name', name)
            .expect(400)
        const noName = await app
            .post(registerPath)
            .field('login', login)
            .field('password', password)
            .expect(400)

    });

    it('409 if user already exists', async () => {
        const response = await app
            .post(registerPath)
            .field('login', login)
            .field('password', password)
            .field('name', name)
            .expect(409)
    });


    afterAll(async () => {
        await db.query("DELETE from users where login = $1", [login]);
    });
})