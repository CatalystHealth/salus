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
  SecuritySchemeObject,
  SecurityRequirementObject,
  SchemaObject,
  OperationObject,
  isSchemaObject
} from './openapi'
import { SchemaVisitor } from './visitor'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

interface OpenAPIBuilderOptions {
  readonly info: InfoObject
  readonly requestBodyFactory: RequestFactory
  readonly responseBodyFactory: ResponseFactory
}

export type OpenAPIInputOptions = WithOptional<
  OpenAPIBuilderOptions,
  'requestBodyFactory' | 'responseBodyFactory'
>

export class OpenAPIBuilder {
  private readonly options: OpenAPIBuilderOptions
  private readonly document: OpenAPIObject
  private readonly visitor: SchemaVisitor

  private constructor(options: OpenAPIBuilderOptions) {
    this.options = options
    this.document = {
      openapi: '3.1.0',
      info: options.info,
      servers: [],
      security: [],
      tags: [],
      paths: {},
      components: {}
    }

    this.visitor = new SchemaVisitor({
      referenceRoot: '/components/schemas',
      namedSchemaVisitor: (name, generate) => {
        if (!this.document.components?.schemas?.[name]) {
          this.addSchema(name, generate())
        }
      }
    })
  }

  public addTag(tag: TagObject): OpenAPIBuilder {
    this.document.tags ||= []
    this.document.tags.push(tag)

    return this
  }

  public addSecurity(name: string, security: SecuritySchemeObject): OpenAPIBuilder {
    this.document.components ||= {}
    this.document.components.securitySchemes ||= {}
    this.document.components.securitySchemes[name] = security

    return this
  }

  public addSecurityRequirement(
    name: string | SecurityRequirementObject,
    requirements: string[] = []
  ): OpenAPIBuilder {
    let requirement: SecurityRequirementObject

    if (typeof name === 'string') {
      requirement = { [name]: requirements }
    } else {
      requirement = name
    }

    this.document.security ||= []
    this.document.security.push(requirement)

    return this
  }

  public addSchema(name: string, schema: SchemaObject): OpenAPIBuilder {
    this.document.components ||= {}
    this.document.components.schemas ||= {}
    this.document.components.schemas[name] = schema

    return this
  }

  /**
   * Adds a new server definition to the OpenAPI document
   *
   * @param server information about the server to add
   * @returns the OpenAPI document builder
   */
  public addServer(server: ServerObject): OpenAPIBuilder {
    this.document.servers ||= []
    this.document.servers.push(server)

    return this
  }

  public operation(operations: Operation<any, any, any, any>[]): OpenAPIBuilder {
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
        const converted = this.visitor.convert(operation.options.params)
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
        const converted = this.visitor.convert(operation.options.query)
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
        documentedOperation.requestBody = this.options.requestBodyFactory(
          operation,
          this.visitor.convert(operation.options.body)
        )
      }

      documentedOperation.responses = this.options.responseBodyFactory(
        operation,
        this.visitor.convert(operation.options.response)
      )

      const path = operation.formatPath(pathParameters)
      this.document.paths[path] ||= {}
      this.document.paths[path][operation.options.method] = documentedOperation
    }

    return this
  }

  public build(): OpenAPIObject {
    return this.document
  }

  /**
   * Create a new OpenAPI generator with the required info object completed
   *
   * @param options info object to attach to the document
   * @returns a new OpenAPI generator
   */
  public static create(options: OpenAPIInputOptions): OpenAPIBuilder {
    return new OpenAPIBuilder({
      requestBodyFactory: createRequestFactory('application/json'),
      responseBodyFactory: createResponseFactory('application/json'),
      ...options
    })
  }
}
