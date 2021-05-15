# Intro

A module for statically defining type-safe HTTP operations. These can be leveraged by other modules to build type-safe clients or servers that can execute the requests.

# Usage

Defining requests with `@salus-js/http` is simple. Let's start with a basic GET request that has no parameters and responds with just a string.

```typescript
import { t } from '@salus-js/codec'
import { http, ResponseOf } from '@salus-js/http'

const getHelloWorld = http.get('/v1/hello', {
  response: t.string
})

type HelloWorldResponse = ResponseOf<typeof getHelloWorld> // string
```

Most of the time, though, you'll have more exciting endpoints than this. Let's take a look at a complete description for an endpoint that creates a contact:

```typescript
import { t } from '@salus-js/codec'
import { http, BodyOf, ResponseOf } from '@salus-js/http'

const contactParameters = t.partial({
  firstName: t.string.document({
    description: 'First name for the contact'
  }),
  lastName: t.string.document({
    description: 'Last name for the contact'
  })
})

const contactResource = t.object({
  object: t.literal('contact').document({
    description: 'Always `contact`.'
  }),
  id: t.string.document({
    description: 'Unique ID for the contact'
  }),
  firstName: t.string.nullable().document({
    description: 'First name for the contact'
  }),
  lastName: t.string.nullable().document({
    description: 'Last name for the contact'
  })
})

const createContact = http.post('/v1/contacts', {
  description: 'Creates a new contact.',
  body: contactParameters,
  response: contactResource
})

type CreateContactBody = BodyOf<typeof createContact> // { firstName?: string; lastName?: string }
type CreateContactResponse = ResponseOf<typeof createContact> // { object: string; id: string; firstName: string | null; lastName: string | null }
```

# Related

Typically, you won't use `@salus-js/http` directly, but rather through one of the clients or servers. `@salus-js/http` is used internally by `@salus-js/nestjs` for server-side endpoints that are compatible with the NestJS framework, or with `@salus-js/axios` to create a type-safe HTTP client.