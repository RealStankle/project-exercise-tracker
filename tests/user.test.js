const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');
const User = require('../src/models/user.model');

require('dotenv').config();

beforeAll(() => {
  mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME });
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
    expect(response.body.username).toBe('user1');
    expect(typeof response.body._id).toBe('string');
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
    expect(response.body.username).toBe('user1');
    expect(response.body.description).toBe('This is a description.');
    expect(response.body.date).toBe('Sun May 13 2012');
    expect(user.count).toBe(user.log.length);
  });

  it('should use current date if no date parameter provided', async () => {
    const user = await User.findOne({ username: 'user1' });

    const response = await request(app)
      .post(`/api/users/${user.id}/exercises`)
      .send({
        description: 'This is a description.',
        duration: '120',
      })
      .type('form');

    expect(response.body.date).toBe(new Date().toDateString());
  });
});

describe('GET /api/users/logs', () => {
  let userId;
  it('should return all logs of the user', async () => {
    const {
      body: { _id },
    } = await request(app)
      .post('/api/users')
      .send({ username: 'log_test' })
      .type('form');

    userId = _id;

    for (let i = 1; i <= 20; i++) {
      await request(app)
        .post(`/api/users/${userId}/exercises`)
        .send({
          description: `Description ${i}.`,
          duration: i * 10,
          date: `2022-10-${i}`,
        })
        .type('form');
    }

    const response = await request(app).get(`/api/users/${userId}/logs`);

    const logs = response.body.log;

    expect(response.body.username).toBe('log_test');
    expect(logs.length).toBe(20);
    expect(response.body.count).toBe(logs.length);
    expect(response.body._id).toBe(userId);
    expect(logs[0].description).toBe('Description 1.');
    expect(logs[0].duration).toBe(10);
    expect(logs[0].date).toBe('Sat Oct 01 2022');
  });

  it("should return logs from 'from date' parameter", async () => {
    const response = await request(app).get(
      `/api/users/${userId}/logs?from=2022-10-6`
    );

    const logs = response.body.log;

    expect(logs.length).toBe(15);
    expect(response.body.count).toBe(logs.length);
    expect(logs[0].description).toBe('Description 6.');
    expect(logs[0].duration).toBe(60);
    expect(logs[0].date).toBe('Thu Oct 06 2022');
  });

  it("should return logs from 'from date' parameter to 'to date' parameter", async () => {
    const response = await request(app).get(
      `/api/users/${userId}/logs?from=2022-10-11&to=2022-10-16`
    );

    const logs = response.body.log;

    expect(logs.length).toBe(5);
    expect(response.body.count).toBe(logs.length);
    expect(logs[0].description).toBe('Description 11.');
    expect(logs[0].duration).toBe(110);
    expect(logs[0].date).toBe('Tue Oct 11 2022');
  });

  it('should return logs according to the given limit', async () => {
    const response = await request(app).get(
      `/api/users/${userId}/logs?from=2022-10-11&to=2022-10-16&limit=2`
    );

    const logs = response.body.log;

    expect(logs.length).toBe(2);
    expect(response.body.count).toBe(logs.length);
  });
});
