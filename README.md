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

Simple toolkit for converting Tsio schemas to their OpenAPI equivalents.