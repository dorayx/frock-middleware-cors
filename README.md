# frock-middleware-cors

A simple frock middleware to enable CORS.

[![Build Status](https://img.shields.io/travis/dorayx/frock-middleware-cors/master.svg?style=flat-square)](https://travis-ci.org/dorayx/frock-middleware-cors/)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)
[![npm](https://img.shields.io/npm/v/frock-middleware-cors.svg?style=flat-square)](https://www.npmjs.com/package/frock-middleware-cors)

## Install

```
npm install --save-dev frock-middleware-cors
```

## `frockfile` Example

You would use this middleware in your `frockfile.json` as follows:

```
{
  "servers": [
    {
      "port": 8080,
      "routes": [
        {
          "path": "/cors-api",
          "methods": ["GET"],
          "handler": "frock-static",
          "middleware": [
            {
              "handler": "frock-middleware-cors",
              "options": {
                "allowOrigin": "http://foo.com",
                "allowCredentials": true
              }
            }
          ]
        }
      ]
    }
  ]
}
```

## `options` Configuration

### options.allowOrign: String|Array

A string or an array of `origin`s specifies URIs that may access the resource.

It defaults to `*`.

```
options: {
  allowOrigin: ['http://foo.com', 'http://bar.com']
}
```

### options.allowMethods: String|Array

A string or an array of methods which are allowed to access the resource.

It defaults to `['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE', 'CONNECT']`.

```
options: {
  allowMethods: 'GET'
}
```

### options.allowHeaders: String|Array

A string or an array of headers that are used in response to a preflight request to indicate which HTTP headers can be used when the actual request is made.

It defaults to `['X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept']`.

```
options: {
  allowHeaders: 'Content-Type'
}
```

### options.allowCredentials: Boolean|String

Indicates whether or nor the response to the request can be exposed when the `crenditials` flag is true.

It defaults to `false`.

```
options: {
  allowCredentials: true
}
```

### options.maxAge: Integer|String

Indicates how long the results of a preflight request can be cached.

It defaults to `86400`.

```
options: {
  maxAge: '86400'
}
```

## License

[![WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-2.png)](http://www.wtfpl.net/)
