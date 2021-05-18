import { Any } from '@salus-js/codec'
import { Operation } from '@salus-js/http'

import {
  createRequestFactory,
  createResponseFactory,
  RequestFactory,
  ResponseFactory
} from './factories'
import {
  OpenAPIObject,
  InfoObject,
  ServerObject,
  TagObject,
  SecurityRequirementObject,
  SchemaObject,
  OperationObject,
  isSchemaObject,
  ComponentsObject
} from './openapi'
import { SchemaVisitor } from './visitor'

export interface OpenAPIOptions {
  readonly info: InfoObject
  readonly tags?: TagObject[]
  readonly servers?: ServerObject[]
  readonly security?: SecurityRequirementObject[]
  readonly components?: ComponentsObject
  readonly requestBodyFactory?: RequestFactory
  readonly responseBodyFactory?: ResponseFactory
  readonly operations: Operation[]
  readonly extraCodecs?: Any[]
}

export function toOpenApi(providedOptions: OpenAPIOptions): OpenAPIObject {
  const {
    info,
    tags = [],
    servers = [],
    security = [],
    requestBodyFactory = createRequestFactory('application/json'),
    responseBodyFactory = createResponseFactory('application/json'),
    extraCodecs = [],
    operations,
    components
  } = providedOptions

  const schemas: Record<string, SchemaObject> = {}
  const document: OpenAPIObject = {
    openapi: '3.0.0',
    info,
    servers,
    security,
    tags,
    paths: {},
    components
  }

  const visitor = new SchemaVisitor({
    referenceRoot: '/components/schemas',
    namedSchemaVisitor: (name, generate) => {
      if (typeof schemas[name] === 'undefined') {
        schemas[name] = {}
        schemas[name] = generate()
      }
    }
  })

  for (const operation of operations) {
    const documentedOperation = {} as OperationObject
    const pathParameters = {} as any

    if (operation.options.description) {
      documentedOperation.description = operation.options.description
    }

    if (operation.options.tags) {
      documentedOperation.tags = operation.options.tags
    }

    if (operation.options.params) {
      const converted = visitor.convert(operation.options.params)
      if (!isSchemaObject(converted) || converted.type !== 'object') {
        throw new Error('Path parameters must always generate an object schema')
      }

      const parameterEntries = Object.entries(converted.properties || {})
      documentedOperation.parameters ||= []
      documentedOperation.parameters.push(
        ...parameterEntries.map(([key, schema]) => ({
          in: 'path' as const,
          style: 'simple' as const,
          explode: true,
          name: key,
          schema: schema,
          required: true,
          description: isSchemaObject(schema) ? schema.description : undefined
        }))
      )

      for (const [name] of parameterEntries) {
        pathParameters[name] = `{${name}}`
      }
    }

    if (operation.options.query) {
      const converted = visitor.convert(operation.options.query)
      if (!isSchemaObject(converted) || converted.type !== 'object') {
        throw new Error('Path parameters must always generate an object schema')
      }

      documentedOperation.parameters ||= []
      documentedOperation.parameters.push(
        ...Object.entries(converted.properties || {}).map(([key, schema]) => ({
          in: 'query' as const,
          style: 'form' as const,
          explode: true,
          name: key,
          schema: schema,
          required: (converted.required?.indexOf(key) ?? -1) > -1,
          description: isSchemaObject(schema) ? schema.description : undefined
        }))
      )
    }

    if (operation.options.body) {
      documentedOperation.requestBody = requestBodyFactory(
        operation,
        visitor.convert(operation.options.body)
      )
    }

    documentedOperation.responses = responseBodyFactory(
      operation,
      visitor.convert(operation.options.response)
    )

    const path = operation.formatPath(pathParameters)
    document.paths[path] ||= {}
    document.paths[path][operation.options.method] = documentedOperation
  }

  // Iterate the extra codecs and convert them. If they're named codecs, they will
  // be added to the schema. If they're not named, they'll be ignored since there's
  // nothing to do with them anyway
  for (const codec of extraCodecs) {
    visitor.convert(codec)
  }

  document.components ||= {}
  document.components.schemas = schemas

  return document
}
