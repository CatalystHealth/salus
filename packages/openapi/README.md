# Intro

Library for converting Salus codecs (and operations) into OpenAPI-compatible definitions.

Features:

- Support for all out-of-the-box Salus capabilities
- Easy extension for
- Minimal dependencies

# Usage

Starting with a simple codec defined using `@salus-js/codec`, such as:

```typescript
import * as s from '@salus-js/codec'

const Person = s.type({
  firstName: s.string.maxLength(255).document({
    description: 'First name for the person',
    example: 'John'
  }),
  lastName: s.string.maxLength(255).document({
    description: 'Last name for the person',
    example: 'Smith'
  }),
  suffix: s.string.optional().document({
    description: 'Suffix for the name'
  })
})
```

We can use `@salus-js/openapi` to convert to an OpenAPI compatible codec:

```typescript
import { toJsonSchema } from '@salus-js/openapi'

const schema = toJsonSchema(Person)
```

This will create the following schema

```yaml
type: object
properties:
  firstName:
    type: string
    description: First name for the person
    maxLength: 255
    example: John
  lastName:
    type: string
    description: Last name for the person
    maxLength: 255
    example: Smith
  suffix:
    type: string
    description: Suffix for the person
requiredProperties:
  - firstName
  - lastName
```

# Complex Usage

The example above focuses on generating a single, simple schema. More often than not, when using OpenAPI, you're looking to document a complete API including operations and schemas. This is what the `OpenAPIGenerator` class is for. Let's take a quick look:

```typescript
import * as s from '@salus-js/schema'
import * as o from '@salus-js/operations'

const personResource = s
  .type({
    firstName: s.string,
    lastName: s.string
  })
  .named('person')

const getUser = o.get('/v1/person/:id', {
  path: s.type({
    id: s.string
  }),
  response: personResource
})

const createUser = o.post('/v1/person/:id', {
  body: personResource,
  response: personResource
})

const generator = OpenAPIGenerator.create()
  .operation(getUser)
  .operation(createUser)
  .generate({
    info: {
      version: '1.0.0',
      title: 'Salus API'
    },
    servers: [{
      url: 'https://example.org/api'
    }]
  })
```

```yaml
openapi: '3.1.0'
info:
  version: 1.0.0
  title: Salus API
servers:
  - url: https://example.org/api
paths:
  /v1/person/{id}:
    get:
      operationId: getUser
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/person'
    post:
      operationId: createUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/person'
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/person'
components:
  schemas:
    person:
      type: object
      properties:
        firstName:
          type: string
        lastName:
          type: string
      requiredProperties:
      - firstName
      - lastName
```