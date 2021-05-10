<div align="center">
  <h1 align="center">
    <img src="./www/static/img/logo-text.png" alt="Tsio" height="100" />
  </h1>
  <p>Toolkit for building typesafe APIs (pronounced see-oh)</p>
</div>

# Intro

Library for building typesafe IO boundaries such as APIs, job queues, and more in TypeScript.

Features:

- Runtime and static type safety from a single source of truth
- Simple DX with no code generation
- Compatible with any runtime
- Zero dependencies

# Packages

Tsio is composed from multiple individual packages.

## [@tsio/schema](/packages/schema)

Powerful library for defining IO schemas that are able to convert to and from JSON.

## [@tsio/openapi](/packages/openapi)

Simple toolkit for converting Tsio schemas to their OpenAPI equivalent.

# OpenAPI Support

You can use the `@tsio/openapi` package to convert Tsio schemas into OpenAPI-compatible definitions. Here's a brief example:

```typescript
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

const generator = toOpenApi(Person)
```

This would generate the following OpenAPI schema:

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

**Note**: OpenAPI support for built-in types is exhaustive. However, it is possible to model custom schemas that cannot be fully represented in OpenAPI. For example, types with custom refinements that cannot be statically inferred. This is usually fine! You'll still get runtime type safety that you expect, it just won't be statically analyzable in OpenAPI if there's no way to define the constraint.