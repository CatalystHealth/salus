<div align="center">
  <h1 align="center">
    <img src="./www/static/img/logo-text.png" alt="Salus" height="100" />
  </h1>
  <p>Toolkit for building type-safe applications and services</p>
</div>

# Intro

Salus is a toolkit for creating typesafe IO boundaries around APIs, job queues, and more in TypeScript.

Features:

- Runtime and static type safety from a single source of truth
- Simple DX with no code generation
- Compatible with any runtime
- Zero dependencies

# Packages

Salus is composed from multiple individual packages.

## [@salus-js/codec](/packages/codec)

Library for defining codecs that are able to convert between runtime and wire-types.

## [@salus-js/http](/packages/http)

Library for defining HTTP operations and their request/response types