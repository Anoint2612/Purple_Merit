const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user.model');
const { generateToken } = require('../src/utils/jwt');

let userToken;
let adminToken;
let userId;

beforeAll(async () => {
    try {
        await User.collection.drop();
    } catch (error) {
        // Ignore error if collection doesn't exist
    }

    // Create User
    const user = await User.create({
        fullName: 'Normal User',
        email: 'user@example.com',
        password: 'Password123',
        role: 'user'
    });
    userId = user._id;
    userToken = generateToken({ userId: user._id, role: user.role });

    // Create Admin
    const admin = await User.create({
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'Password123',
        role: 'admin'
    });
    adminToken = generateToken({ userId: admin._id, role: admin.role });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Admin Endpoints', () => {
    it('should block non-admin users from accessing admin routes', async () => {
        const res = await request(app)
            .get('/api/admin/users')
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toEqual(403);
    });

    it('should allow admin to access admin routes', async () => {
        const res = await request(app)
            .get('/api/admin/users')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
    });

    it('should allow admin to deactivate a user', async () => {
        const res = await request(app)
            .patch(`/api/admin/users/${userId}/deactivate`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.status).toBe('inactive');
    });
});
