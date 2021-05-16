# Intro

A library for converting Salus codecs and HTTP operations into OpenAPI specifications.

# Usage

The `@salus-js/openapi` package is intended to be used alongside `@salus-js/codec` and `@salus-js/http` to turn your codecs and operations into an OpenAPI schema. Let's take a look at a simple example:

```typescript
import { t } from '@salus-js/codec'
import { http } from '@salus-js/http'
import { toOpenApi } from '@salus-js/openapi'

const getUser = http.get('/v1/users/:id', {
  summary: 'Retrieve a user',
  description: 'Fetches the user associated with the given ID',
  params: t.object({
    id: t.string.document({
      description: 'Unique ID for the user to retrieve'
    })
  }),
  response: t.object({
    id: t.string.document({
      description: 'Unique ID for the user'
    }),
    name: t.string.document({
      description: 'Name for the user'
    })
  })
})

toOpenApi({
  info: {
    version: '1.0.0',
    title: 'Salus API'
  },
  operations: [
    getUser
  ]
})
```

The operations above will yield the following OpenAPI 3.0 schema:

```yaml
openapi: 3.0.0
info:
  version: '1.0.0'
  title: Salus API
servers: []
security: []
tags: []
paths:
  "/v1/users/{id}":
    get:
      description: Fetches the user associated with the given ID
      parameters:
      - in: path
        style: simple
        explode: true
        name: id
        schema:
          type: string
          description: Unique ID for the user to retrieve
        required: true
        description: Unique ID for the user to retrieve
      responses:
        default:
          description: Successful response.
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                    description: Unique ID for the user
                  name:
                    type: string
                    description: Name for the user
                required:
                - id
                - name
```

# Custom Codecs

The Salus OpenAPI module includes out-of-the-box support for all built-in codecs. If you create a custom codec, however, you'll also have to define a converter that is able to map between your custom codecs and their OpenAPI equivalent. The Salus OpenAPI builder accepts a list of schema converters that will be executed in order.

Let's look at a sample converter that always returns a string schema.

```typescript
import { SchemaConverter, SchemaVisitor, SchemaObject } from '@salus-js/openapi'

class MyCustomConverter implements SchemaConverter {

  public convert(codec: Codec<any, any>, visitor: SchemaVisitor, next: () => SchemaObject): SchemaObject {
    return {
      type: 'string'
    }
  }

}
```

You can use your custom converter when mapping to OpenAPI:

```typescript
import { toOpenApi, SchemaConverters } from '@salus-js/openapi'

toOpenApi({
  converters: SchemaConverters.create()
    .append(new MyCustomConverter())
})
```

If you'd like to completely replace the Salus built-in converters, pass `false` to `SchemaConverters.create()`. This will create a new instance of `SchemaConverters` without including the built-ins.