'use strict';

module.exports = enableCORS;

function enableCORS(frock, logger, options = {
  allowOrigin: '*',
  allowMethods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE, CONNECT',
  allowHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
  allowCredentials: false,
  maxAge: '86400'
}) {
  return function handler (req, res, next) {
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Origin', options.allowOrigin);
      res.setHeader('Access-Control-Allow-Methods', options.allowMethods);
      res.setHeader('Access-Control-Allow-Headers', options.allowHeaders);
      res.setHeader('Access-Control-Allow-Credentials', options.allowCredentials);
      res.setHeader('Access-Control-Max-Age', String(options.maxAge));

      res.writeHead(200);
      res.end();

      return;
    }

    next(req, res);
  }
}
