# Intro

Library for typesafe encoding and decoding at IO boundaries in TypeScript.

Features:

- Runtime and static type safety from a single source of truth
- Simple DX with no code generation
- Compatible with any runtime
- Zero dependencies

# Usage

Let's start with a simple example of decoding an incoming message:

```typescript
import * as s from '@tsio/schema'

const Person = s.type({
  firstName: s.string,
  lastName: s.string
})

type Person = s.TypeOf<typeof Person>

// Equivalent To:

interface Person {
  firstName: string
  lastName: string
}

const result = Person.decode(input)
if (result.valid) {
  console.log(result.value.firstName)
} else {
  console.log(result.errors)
}

```

# Schemas

Schemas define how data is transformed between its runtime and over-the-wire representations. Every schema is immutable, so all modifications create new instances.

Each schema has a runtime type and wire-type (how it looks when it's encoded, or before it's decoded). For most built-in types, these are the same; a string is the same at runtime and when it's encoded. However, more complex types may need these to diverge. For example, a `Date` at runtime can be serialized into a `string` (if using ISO 8601 dates), or a `number` (if using Unix timestamps).

## Supported Schemas

Tsio is completely flexible allowing you to define your own schemas. Out of the box, there is support for:

- **Strings**: `s.string`
- **Numbers**: `s.number`
- **Booleans**: `s.boolean`
- **Objects**: `s.type({ key: s.string })`
- **Records**: `s.record(s.string)`
- **Arrays**: `s.array(s.string)`
- **Null**: `s.null`
- **Undefined**: `s.undefined`
- **Unions**: `s.union([s.string, s.number])`
- **Enums**: `s.enum(EnumType)`
- **Literals**: `s.literal('literal')`

# Refinements

Refinements are additional runtime restrictions to the type that can't be (practically) modeled in the type system directly. For example, you may want to enforce a maximum length to strings. Built-in types often have support for a number of refinements out of the box, but you can always add your own custom ones.

For example, strings have out-of-the-box support for a maximum length refinement:

```typescript
s.string.maxLength(10)
```

However if you wanted to do something more sophisticated (maybe you want to verify that a string is a palindrome), you can do so with custom refinements

```typescript
s.string.refinement((value) => value.reverse() === value, 'must be a palindrome')
```

Note that all schemas are immutable, so refinements *return a new type instance*.

# Optional Properties

Tsio has special handling for optional properties that is compatible with the TypeScript type system. You can make any schema optional by chaining a call to `.optional()`

**Note**: Currently, there is a limitation that `.optional()` must be called after `.nullable()` if both are going to be used.

# Documentation

Tsio also supports documentation-as-code so you can document your types alongside their definition. Documentation is also typesafe, ensuring examples reflect the correct runtime type. Let's look at a simple example:

```typescript
const Person = s.type({
  firstName: s.string.document({
    description: 'First name for the person',
    example: 'John'
  }),
  lastName: s.string.document({
    description: 'Last name for the person',
    example: 'Smith'
  })
})
```

The documentation can be introspected at runtime by accessing the options of each schema, or can be used by the OpenAPI package