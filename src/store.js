/* eslint-disable strict */
const uuid = require('uuid/v4');

const bookmarks = [
  {
    id: uuid(),
    title: 'Thinkful',
    url: 'https://www.thinkful.com',
    description: 'coding bootcamp',
    rating:5
  },
  {
    id: uuid(),
    title: 'instagram',
    url: 'https://www.instagram.com',
    description: 'ouroboros of desperation',
    rating:1
  },
  {
    id: uuid(),
    title: 'Google',
    url: 'https://www.google.com',
    description: 'find any website!',
    rating:5
  },
];

module.exports = {bookmarks};