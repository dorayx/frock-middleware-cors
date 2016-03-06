'use strict'

const test = require('tape')
const httpMock = require('node-mocks-http')
const lib = require('./../lib')

const frock = {}

const log = {
  debug: () => {},
  error: () => {}
}

test('preflight requests', (t) => {
  t.plan(1)

  const expectedHeaders = [
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Credentials',
    'Access-Control-Max-Age'
  ]

  const req = httpMock.createRequest({method: 'OPTIONS'})
  const res = httpMock.createResponse()
  const handler = lib(frock, log)

  handler(req, res)

  t.same(Object.keys(res._getHeaders()), expectedHeaders)
})

test('passes control to next frock middleware', (t) => {
  const req = httpMock.createRequest()
  const res = httpMock.createResponse()
  const done = () => { t.end() }
  const handler = lib(frock, log)

  handler(req, res, done)
})

test('no OPTIONS call enables default CORS to all origins', (t) => {
  t.plan(2)

  const req = httpMock.createRequest()
  const res = httpMock.createResponse()
  const done = () => {}
  const handler = lib(frock, log)

  handler(req, res, done)

  t.equal(res.get('Access-Control-Allow-Origin'), '*')
  t.is(res.get('Access-Control-Allow-Methods'), undefined)
})

test('origin defaults to *', (t) => {
  t.plan(1)

  const req = httpMock.createRequest({method: 'OPTIONS'})
  const res = httpMock.createResponse()
  const handler = lib(frock, log)

  handler(req, res)

  t.equal(res.get('Access-Control-Allow-Origin'), '*')
})

test('overrides origin', (t) => {
  t.plan(1)

  const options = {allowOrigin: ['foo.com']}

  const req = httpMock.createRequest({method: 'OPTIONS'})
  const res = httpMock.createResponse()
  const handler = lib(frock, log, options)

  handler(req, res)

  t.equal(res.get('Access-Control-Allow-Origin'), 'foo.com')
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

test('overrides credentials', (t) => {
  t.plan(1)

  const options = {allowCredentials: true}

  const req = httpMock.createRequest({method: 'OPTIONS'})
  const res = httpMock.createResponse()
  const handler = lib(frock, log, options)

  handler(req, res)

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
