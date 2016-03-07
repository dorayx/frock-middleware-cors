# frock-middleware-cors

A simple frock middleware to enable CORS.

[![Build Status](https://travis-ci.org/dorayx/frock-middleware-cors.svg?branch=master)](https://travis-ci.org/dorayx/frock-middleware-cors)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/feross/standard)

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
              "handler": "frock-middleware-cors"
            }
          ]
        }
      ]
    }
  ]
}
```

## `options` Configuration

### options.allowOrign: Array

An array of `origin`s specify a URI that may access the resource.

It defaults to `['*']`.

```
options: {
  allowOrigin: ['foo.com', 'bar.com']
}
```

### options.allowMethods: Array

An array of methods allowed when accessing the resource.

It defaults to `['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE', 'CONNECT']`.

```
options: {
  allowMethods: ['GET']
}
```

### options.allowHeaders: Array

An array of headers that are used in response to a preflight request to indicate which HTTP headers can be used when the actual request is made.

It defaults to `['X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept']`.

```
options: {
  allowHeaders: ['Content-Type']
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

![[WTFPL](http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-2.png)](http://www.wtfpl.net/)
