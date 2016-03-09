'use strict'

const test = require('tape')
const httpMock = require('node-mocks-http')
const lib = require('./../lib')

const includesAll = (tested, target) => Object.keys(tested).every((t) => target.indexOf(t) !== -1)

const frock = {}

const log = {
  debug: () => {},
  error: () => {}
}

test('the response headers to a preflight request with no credentials', (t) => {
  t.plan(2)

  const expectedHeaders = [
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers',
    'Access-Control-Max-Age'
  ]

  const req = httpMock.createRequest({method: 'OPTIONS'})
  const res = httpMock.createResponse()
  const handler = lib(frock, log)

  handler(req, res)

  t.equals(res._getStatusCode(), 204)
  t.assert(includesAll(res._getHeaders(), expectedHeaders))
})

test('the response headers to a preflight request with credentials', (t) => {
  t.plan(2)

  const options = {
    allowCredentials: true
  }

  const expectedHeaders = [
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Credentials',
    'Access-Control-Max-Age'
  ]

  const req = httpMock.createRequest({method: 'OPTIONS'})
  const res = httpMock.createResponse()
  const handler = lib(frock, log, options)

  handler(req, res)

  t.equals(res._getStatusCode(), 204)
  t.assert(includesAll(res._getHeaders(), expectedHeaders))
})

test('passes control to next frock middleware', (t) => {
  const req = httpMock.createRequest()
  const res = httpMock.createResponse()
  const done = () => { t.end() }
  const handler = lib(frock, log)

  handler(req, res, done)
})

test('no OPTIONS call with no options initialized enables default CORS to all origins', (t) => {
  t.plan(2)

  const req = httpMock.createRequest()
  const res = httpMock.createResponse()
  const done = () => {}
  const handler = lib(frock, log)

  handler(req, res, done)

  t.equal(res.get('Access-Control-Allow-Origin'), '*')
  t.is(res.get('Access-Control-Allow-Credentials'), undefined)
})

test('origin defaults to *', (t) => {
  t.plan(1)

  const req = httpMock.createRequest({method: 'OPTIONS'})
  const res = httpMock.createResponse()
  const handler = lib(frock, log)

  handler(req, res)

  t.equal(res.get('Access-Control-Allow-Origin'), '*')
})

test('overrides origin and matches the request origin against a single origin configured', (t) => {
  t.plan(2)

  const options = {allowOrigin: 'http://foo.com'}

  const req = httpMock.createRequest({method: 'OPTIONS'})
  const res = httpMock.createResponse()
  const handler = lib(frock, log, options)

  handler(req, res)

  t.equal(res.get('Access-Control-Allow-Origin'), 'http://foo.com')
  t.equal(res.get('Vary'), 'Origin')
})

test('overrides origin and matches the request origin against an array of origins configured', (t) => {
  t.plan(2)

  const options = {allowOrigin: ['http://foo.com', 'http://bar.com']}

  const req = httpMock.createRequest({method: 'OPTIONS'})
  const res = httpMock.createResponse()
  const handler = lib(frock, log, options)

  req.headers.origin = 'http://bar.com'
  handler(req, res)

  t.equal(res.get('Access-Control-Allow-Origin'), 'http://bar.com')
  t.equal(res.get('Vary'), 'Origin')
})

test('overrides origin and fails to match the request origin against an array of origins configured', (t) => {
  t.plan(2)

  const options = {allowOrigin: ['http://foo.com', 'http://bar.com']}

  const req = httpMock.createRequest({method: 'OPTIONS'})
  const res = httpMock.createResponse()
  const handler = lib(frock, log, options)

  req.headers.origin = 'http://baz.com'
  handler(req, res)

  t.is(res.get('Access-Control-Allow-Origin'), undefined)
  t.is(res.get('Vary'), undefined)
})

test('methods defaults to GET, POST, OPTIONS, PUT, PATCH, DELETE, CONNECT', (t) => {
  t.plan(1)

  const req = httpMock.createRequest({method: 'OPTIONS'})
  const res = httpMock.createResponse()
  const handler = lib(frock, log)

  handler(req, res)

  t.equal(res.get('Access-Control-Allow-Methods'), 'GET,POST,OPTIONS,PUT,PATCH,DELETE,CONNECT')
})

test('overrides methods', (t) => {
  t.plan(1)

  const options = {allowMethods: ['GET', 'POST']}

  const req = httpMock.createRequest({method: 'OPTIONS'})
  const res = httpMock.createResponse()
  const handler = lib(frock, log, options)

  handler(req, res)

  t.equal(res.get('Access-Control-Allow-Methods'), 'GET,POST')
})

test('overrides credentials for a preflight request', (t) => {
  t.plan(1)

  const options = {allowCredentials: true}

  const req = httpMock.createRequest({method: 'OPTIONS'})
  const res = httpMock.createResponse()
  const handler = lib(frock, log, options)

  handler(req, res)

  t.equal(res.get('Access-Control-Allow-Credentials'), 'true')
})

test('overrides credentials for an actual request', (t) => {
  t.plan(1)

  const options = {allowCredentials: true}

  const next = () => {}
  const req = httpMock.createRequest()
  const res = httpMock.createResponse()
  const handler = lib(frock, log, options)

  handler(req, res, next)

  t.equal(res.get('Access-Control-Allow-Credentials'), 'true')
})

test('overrides max-age', (t) => {
  t.plan(1)

  const options = {maxAge: '123'}

  const req = httpMock.createRequest({method: 'OPTIONS'})
  const res = httpMock.createResponse()
  const handler = lib(frock, log, options)

  handler(req, res)

  t.equal(res.get('Access-Control-Max-Age'), '123')
})
