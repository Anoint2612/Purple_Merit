const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user.model');

beforeAll(async () => {
    // Connect to a test database or clear the existing one
    // We drop the collection to ensure old indexes (like username) are removed
    try {
        await User.collection.drop();
    } catch (error) {
        // Ignore error if collection doesn't exist
    }
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send({
                fullName: 'Test User',
                email: 'test@example.com',
                password: 'Password123'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('token');
    });

    it('should login with valid credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'Password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toHaveProperty('token');
    });

    it('should fail login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'WrongPassword123'
            });
        expect(res.statusCode).toEqual(401);
    });

    it('should fail to access protected route without token', async () => {
        const res = await request(app)
            .get('/api/users/me');
        expect(res.statusCode).toEqual(401);
    });
});
