const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { createBookmarks }  = require('./bookmarks.fixtures');
describe('App', () => {

  // default endpoint
  describe('GET /', () => {

    // happy test
    it('responds with 200 containing "Hello, world!"', () => {
      return supertest(app)
        .get('/')
        .expect(200, 'Hello, world!');
    });

  });
  
});