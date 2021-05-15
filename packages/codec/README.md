# Intro

A library for defining codecs that can safely translate between runtime and over-the-wire types, helping you build more robust systems in TypeScript.

# Usage

Everything in `@salus-js/codec` revolves around a Codec. Codecs have a generic type signature of `Codec<RuntimeType, WireType>` where `RuntimeType` is the data type that the application consumes at runtime, and `WireType` is the type in its serialized form. The codec is responsible for safely converting between those two types.

The most simple codecs are primitives, such as `t.string` which is a `Codec<string, string>`. In other words, it takes a `string` and translates it to a `string` (itself!). Let's see an example:

```typescript
import { t } from '@salus-js/codec'

console.log(t.string.encode('Hello World')) // prints: Hello World
```

You can always access the runtime and wire types of codecs by using the included type helpers. This will become very important as we see later.

```typescript
import { t, TypeOf, OutputOf } from '@salus-js/codec'

type ApplicationType = TypeOf<typeof t.string> // string
type WireType = OutputOf<typeof t.string> // string
```

The real power of Codcs, though, is when you're decoding unknown or untrusted data.

```typescript
import { t } from '@salus-js/codec'

const result = t.string.decode(123)
if (result.success) {
  console.log(result.value)
} else {
  console.log(`error: ${result.errors[0].message}`)
}

// Prints: error: must be a string
```

Using the decoding functionality, you can transform untrusted data from an IO boundary (such as an HTTP request) into trusted, statically typed data in your application.

# Built-Ins

Salus includes a number of codecs out of the box.

## Primitives

First, Salus supports all the following TypeScript primitives:

- string
- number
- boolean
- null
- undefined

## Objects

The most common codec included in Salus is the Object codec. Object codecs define an object consisting of multiple properties, each of which is, in turn, another codec. Here's an example:

```typescript
import { t, TypeOf } from '@salus-js/codec'

const User = t.object({
  firstName: t.string,
  lastName: t.string
})

type User = TypeOf<typeof User> // { firstName: string; lastName: string; }
```

## Arrays

You can also describe arrays which map to their TypeScript equivalent

```typescript
import { t, TypeOf } from '@salus-js/codec'

const User = t.object({
  firstName: t.string,
  lastName: t.string
})

const Users = t.array(User)
type Users = TypeOf<typeof Users> // Array<{ firstName: string; lastName: string; }>
```

## Enums

Salus also includes support for encoding and decoding string-based TypeScript enums (note that only string enums are supported)

```typescript
import { t, TypeOf } from '@salus-js/codec'

enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

const User = t.object({
  id: t.string,
  status: t.enum(Status)
})

type UserStatus = TypeOf<typeof Users> // Array<{ id: string; status: Status; }>
```

## Optional

By default, all object properties are required. Salues will throw an error when decoding an object if any properties are missing values. You can, however, make any codec optional. This allows `undefined` to be successfully parsed, and updates the static definition of the containing object to make the property optional. Let's see an example

```typescript
import { t } from '@salus-js/codec'

const createUserParameters = t.partial({
  firstName: t.string.optional()
})

type CreateUserParameters = TypeOf<typeof createUserParameters> // { firstName?: string | undefined }

createUserParameters.decode({}) // passes with {}
createUserParameters.decode({ firstName: 'Salus' }) // passes with { firstName: 'Salus' }
```