'use strict'

import _assign from 'lodash.assign'

function isTypeOf (object, typeName) {
  return Object.prototype.toString.call(object).slice(8, -1) === typeName
}

function isOriginAllowed (origin, allowedOrigins) {
  if (isTypeOf(allowedOrigins, 'String')) {
    return allowedOrigins === origin
  }

  if (isTypeOf(allowedOrigins, 'Array')) {
    return allowedOrigins.filter((allowed) => allowed === origin).length > 0
  }
}

function configureOrigin (request, options) {
  let headers = []
  let requestOrigin = request.headers.origin
  let optionOrigin = options.allowOrigin

  if (optionOrigin === '*') {
    // allow any origin
    headers.push({key: 'Access-Control-Allow-Origin', value: '*'})
  } else if (isTypeOf(optionOrigin, 'String')) {
    // fixed origin
    headers.push({key: 'Access-Control-Allow-Origin', value: optionOrigin})
    headers.push({key: 'Vary', value: 'Origin'})
  } else if (isTypeOf(optionOrigin, 'Array')) {
    // locate whether or not the request origin exists in the allowed origin
    let isAllowed = isOriginAllowed(requestOrigin, optionOrigin)
    headers.push({key: 'Access-Control-Allow-Origin', value: isAllowed ? requestOrigin : false})
    headers.push({key: 'Vary', value: isAllowed ? 'Origin' : false})
  }

  return headers
}

function configureMethods (request, options) {
  let optionMethods = options.allowMethods
  let actualMethods = isTypeOf(optionMethods, 'String') ? optionMethods : optionMethods.join(',')

  return {key: 'Access-Control-Allow-Methods', value: actualMethods}
}

function configureCredentials (request, options) {
  return options.allowCredentials ? {key: 'Access-Control-Allow-Credentials', value: String(options.allowCredentials)} : null
}

function configureHeaders (request, options) {
  let optionHeaders = options.allowHeaders
  let actualHeaders = isTypeOf(optionHeaders, 'String') ? optionHeaders : optionHeaders.join(',')

  return {key: 'Access-Control-Allow-Headers', value: actualHeaders}
}

function configureMaxAge (request, options) {
  let optionMaxAge = String(options.maxAge)
  return {key: 'Access-Control-Max-Age', value: optionMaxAge}
}

function applyHeaders (headers, response) {
  headers.forEach((header) => {
    if (isTypeOf(header, 'Object')) {
      response.setHeader(header.key, header.value)
    } else if (isTypeOf(header, 'Array')) {
      applyHeaders(header, response)
    }
  })
}

function enableCORS (frock, logger, options) {
  const corsOptions = _assign({
    allowOrigin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE', 'CONNECT'],
    allowHeaders: ['X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept'],
    allowCredentials: false,
    maxAge: '86400'
  }, options)

  return function handler (req, res, next) {
    var headers = []

    if (req.method === 'OPTIONS') {
      // a preflight request
      headers.push(configureOrigin(req, corsOptions))
      headers.push(configureCredentials(req, corsOptions))
      headers.push(configureMethods(req, corsOptions))
      headers.push(configureHeaders(req, corsOptions))
      headers.push(configureMaxAge(req, corsOptions))
      applyHeaders(headers, res)

      res.writeHead(204)
      res.end()

      return
    }

    // an actual request
    headers.push(configureOrigin(req, corsOptions))
    headers.push(configureCredentials(req, corsOptions))
    applyHeaders(headers, res)

    next(req, res)
  }
}

module.exports = enableCORS
