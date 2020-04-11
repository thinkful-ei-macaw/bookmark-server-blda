/* eslint-disable strict */
const express = require('express');
const uuid = require('uuid/v4');
const { isWebUri } = require('valid-url');
const logger = require('./logger');
const xss = require('xss');
const BookmarksService = require('./bookmarks-service');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

const serializeBookmark = (bookmark) => ({
  id: bookmark.id,
  title: xss(bookmark.title),
  url: bookmark.url,
  description: xss(bookmark.description),
  rating: parseInt(bookmark.rating)
});

bookmarksRouter.route('/bookmarks')
  .get((req, res, next) => {
    // move implementation logic into here
    BookmarksService.getAllBookmarks(req.app.get('db'))
      .then(bookmarks => {
        res.json(bookmarks.map(serializeBookmark));
      })
      .catch(next);
  })

  .post(bodyParser, (req, res, next)=>{
    // move implementation logic into here
    for (const keys of ['title', 'url', 'rating', 'description']) {
      if (!req.body[keys]) {
        logger.error(`${keys} is required`);
        return res.status(400)
          .send({
            error: { message: `${keys} is required`}
          });
      }
    }
    
    const { title, url, rating, description } = req.body;

    const ratingValue = Number(rating);

    if (!isWebUri(url)) {
      logger.error(`Invalid url '${url}' supplied`);
      return res.status(400) 
        .send('url must be valid');
    }
      
    if (!Number.isInteger(ratingValue) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating '${rating}' supplied`);
      return res.status(400).send({
        error: { message: 'rating must be 1 - 5'}
      });
    }
    
    const newBookmark = { title, url, description, rating };

    BookmarksService.insertBookmark(
      req.app.get('db'),
      newBookmark
    ).then(bookmark => {
      logger.info(`bookmark ${bookmark.id} created`);
      res.status(201)
        .location(`/bookmarks/${bookmark.id}`)
        .json(serializeBookmark(bookmark));
    })
      .catch(next);
  });

bookmarksRouter.route('/bookmarks/:bookmark_id')
  .all((req, res, next) => {
    const { bookmark_id } = req.params;
    BookmarksService.getBookmarkId(req.app.get('db'), bookmark_id)
      .then(bookmark => {
        if (!bookmark) {
          logger.error(`bookmark ${bookmark_id} not found`);
          return res.status(404).json({
            error: { message: 'bookmark not found' }
          });
        }
        res.bookmark = bookmark;
        next();
      })
      .catch(next);
  })
  .get((req, res) => {
    res.json(serializeBookmark(res.bookmark));
  })
  .delete((req, res, next) => {
    const { bookmark_id } = req.params;
    BookmarksService.deleteBookmark(
      req.app.get('db'),
      bookmark_id
    )
      .then(res => {
        logger.info(`bookmark ${bookmark_id} deleted`);
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(bodyParser, (req, res, next) => {
    for (const keys of ['title', 'url', 'rating', 'description']) {
      if (!req.body[keys]) {
        return res.status(400).send({
          error: `${keys} is required`
        });
      }
    }

    const { title, url, rating, description } = req.body;

    const ratingValue = Number(rating);
    
    if (!isWebUri(url)) {
      logger.error(`Invalid url '${url}' supplied`);
      return res.status(400) 
        .send('url must be valid');
    }
      
    if (!Number.isInteger(ratingValue) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating '${rating}' supplied`);
      return res.status(400).send({
        error: { message: 'rating must be 1 - 5' }
      });
    }
    
    const newBookmark = { title, url, description, rating };

    BookmarksService.updateBookmark(
      req.app.get('db'),
      req.params.bookmark_id,
      newBookmark
    ).then(bookmark => {
      logger.info(`bookmark ${bookmark.id} updated`);
      res.status(200)
        .location(`/bookmarks/${bookmark.id}`)
        .json(serializeBookmark(bookmark));
    })
      .catch(next);
  });

module.exports = bookmarksRouter;