const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

require('dotenv').config();

beforeAll(() => {
  mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('POST /api/users', () => {
  it('should create a new user with given username', async () => {
    const response = await request(app)
      .post('/api/users')
      .send('username=user1');
    expect(response.statusCode).toBe(201);
    expect(response.body.username).toEqual('user1');
  });
});
