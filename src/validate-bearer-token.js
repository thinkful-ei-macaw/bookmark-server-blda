/* eslint-disable strict */
const logger = require('./logger');
const { API_TOKEN } = require('./config');

function validateBearerToken(req, res, next){
  const authToken = req.get('authorization');
  logger.error(`unauthorized request to ${req.path}`);
  
  if(!authToken || authToken.split(' ')[1] !== API_TOKEN){
    logger.error(`unauthorized request to path: ${req.path}`);
    return res.status(401).json({error: 'unathoriszed request'});
  }
  next();
}

module.exports = validateBearerToken;