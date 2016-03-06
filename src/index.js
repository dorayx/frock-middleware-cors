'use strict'

module.exports = enableCORS

function enableCORS (frock, logger, options) {
  const corsOptions = Object.assign({
    allowOrigin: ['*'],
    allowMethods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE', 'CONNECT'],
    allowHeaders: ['X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept'],
    allowCredentials: false,
    maxAge: '86400'
  }, options)

  return function handler (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', corsOptions.allowOrigin.join(','))

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', corsOptions.allowMethods.join(','))
      res.setHeader('Access-Control-Allow-Headers', corsOptions.allowHeaders.join(','))
      res.setHeader('Access-Control-Allow-Credentials', String(corsOptions.allowCredentials))
      res.setHeader('Access-Control-Max-Age', String(corsOptions.maxAge))

      res.writeHead(200)
      res.end()

      return
    }

    next(req, res)
  }
}
