import { Any } from '@salus-js/codec'
import { Operation } from '@salus-js/http'

import { SchemaConverter } from './converter'
import {
  createJsonRequestFactory,
  createJsonResponseFactory,
  RequestFactory,
  ResponseFactory
} from './factories'
import {
  ComponentsObject,
  InfoObject,
  isSchemaObject,
  OpenAPIObject,
  OperationObject,
  ParameterObject,
  ReferenceObject,
  SchemaObject,
  SecurityRequirementObject,
  ServerObject,
  TagObject
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
  readonly additionalConverters?: SchemaConverter[]
}

export function toOpenApi(providedOptions: OpenAPIOptions): OpenAPIObject {
  const {
    info,
    tags = [],
    servers = [],
    security = [],
    requestBodyFactory = createJsonRequestFactory(),
    responseBodyFactory = createJsonResponseFactory(),
    additionalConverters,
    extraCodecs = [],
    operations,
    components
  } = providedOptions

  const schemas: Record<string, SchemaObject | ReferenceObject> = {}
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
    },
    additionalConverters
  })

  for (const operation of operations) {
    const documentedOperation = {} as OperationObject
    const pathParameters = {} as any

    if (operation.options.summary) {
      documentedOperation.summary = operation.options.summary
    }

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
      const parameters: ParameterObject[] = parameterEntries.map(([key, schema]) => {
        const parameter: ParameterObject = {
          in: 'path' as const,
          style: 'simple' as const,
          explode: true,
          name: key,
          schema: schema,
          required: true
        }

        if (isSchemaObject(schema) && schema.description) {
          parameter.description = schema.description
        }

        return parameter
      })

      documentedOperation.parameters ||= parameters

      for (const [name] of parameterEntries) {
        pathParameters[name] = `{${name}}`
      }
    }

    if (operation.options.query) {
      const converted = visitor.convert(operation.options.query)
      if (!isSchemaObject(converted) || converted.type !== 'object') {
        throw new Error('Query parameters must always generate an object schema')
      }

      const parameters: ParameterObject[] = Object.entries(converted.properties || {}).map(
        ([key, schema]) => {
          const parameter: ParameterObject = {
            in: 'query' as const,
            style: 'form' as const,
            explode: true,
            name: key,
            schema: schema,
            required: (converted.required?.indexOf(key) ?? -1) > -1
          }

          if (isSchemaObject(schema) && schema.description) {
            parameter.description = schema.description
          }

          return parameter
        }
      )

      documentedOperation.parameters ||= parameters
    }

    if (operation.options.body) {
      documentedOperation.requestBody = requestBodyFactory(operation, visitor)
    }

    documentedOperation.responses = responseBodyFactory(operation, visitor)

    if (operation.options.extensions) {
      for (const [key, value] of Object.entries(operation.options.extensions)) {
        documentedOperation[`x-${key}`] = value
      }
    }

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
