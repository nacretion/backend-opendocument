const request = require('supertest');
const app = request(require('../app'));
const {signUser} = require('../utils/user');


describe('POST /api/document-template', () => {

    let accessToken;
    let refreshToken;
    let userId;
    let file;

    beforeAll(async () => {
        const user = {
            id: 6,
            email: 'test@example.com',
            password: 'password',
        };
        const tokens = await signUser(user);
        accessToken = tokens.accessToken;
        refreshToken = tokens.refreshToken;
        userId = user.id;

        file = {
            fieldname: 'file',
            originalname: 'test.odt',
            encoding: '7bit',
            mimetype: 'application/vnd.oasis.opendocument.text',
            buffer: Buffer.from('test file contents'),
            size: 14,
        };
    });

    // it('file can be saved', async () => {
    //
    // })


    it('401 if no auth token provided', async () => {
        await app
            .post('/api/document-template')
            .attach('file', file.buffer)
            .field('description', 'test description')
            .expect(401)
    });

    it('401 if invalid auth token provided', async () => {
        await app
            .post('/api/document-template')
            .set('Authorization', 'Bearer invalid-token')
            .attach('file', file.buffer)
            .field('description', 'test description')
            .expect(401)
    });

    it('400 if no file provided', async () => {
        await app
            .post('/api/document-template')
            .set('Authorization', `Bearer ${accessToken}`)
            .field('description', 'test description')
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(400)
    });

    it('400 if invalid file type provided', async () => {
        await app
            .post('/api/document-template')
            .set('Authorization', `Bearer ${accessToken}`)
            .attach('file', Buffer.from('test file contents'), 'test.txt')
            .field('description', 'test description')
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(400)
    });

    it('400 if empty file provided', async () => {
        await app
            .post('/api/document-template')
            .set('Authorization', `Bearer ${accessToken}`)
            .attach('file', Buffer.from(''), 'test.odt')
            .field('description', 'test description')
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(400)
    });

    it('400 if invalid description provided', async () => {
        await app
            .post('/api/document-template')
            .set('Authorization', `Bearer ${accessToken}`)
            .attach('file', file.buffer)
            .field('description', 'a')
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(400)
    });
})