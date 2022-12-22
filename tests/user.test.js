const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../src/models/user.model');

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
      .send({ username: 'user1' })
      .type('form');
    expect(response.statusCode).toBe(201);
    expect(response.body.username).toEqual('user1');
  });
});

describe('POST /api/users/:_id/exercises', () => {
  it("should add an exercise to the user's logs", async () => {
    const user = await User.findOne({ username: 'user1' });

    const response = await request(app)
      .post(`/api/users/${user.id}/exercises`)
      .send({
        description: 'This is a description.',
        duration: '120',
        date: '2012-5-13',
      })
      .type('form');

    expect(response.statusCode).toBe(201);
    expect(response.body.username).toEqual('user1');
    expect(response.body.description).toEqual('This is a description.');
    expect(response.body.date).toEqual('Sun May 13 2012');
    expect(user.count).toBe(user.log.length);
  });
});
