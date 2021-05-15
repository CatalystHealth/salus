import { SchemaVisitor } from '@tsio/schema'

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
  ReferenceObject
} from './openapi'
import { Operation } from './operation'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

interface OpenAPIBuilderOptions {
  info: InfoObject
  requestBodyFactory: RequestFactory
  responseBodyFactory: ResponseFactory
}

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

  public operation(...operations: Operation[]): OpenAPIBuilder {
    for (const operation of operations) {
      const documentedOperation = {} as OperationObject

      if (operation.opts.description) {
        documentedOperation.description = operation.opts.description
      }

      if (operation.opts.tags) {
        documentedOperation.tags = operation.opts.tags
      }

      if (operation.opts.body) {
        documentedOperation.requestBody = this.options.requestBodyFactory(
          operation,
          this.visitor.convert(operation.opts.body)
        )
      }

      if (operation.opts.params) {
        const converted = this.visitor.convert(operation.opts.params)
        if (converted.type !== 'object') {
          throw new Error('Path parameters must always generate an object schema')
        }

        documentedOperation.parameters ||= []
        documentedOperation.parameters.push(
          ...Object.entries(converted.properties || {}).map(([key, schema]) => ({
            in: 'path' as const,
            style: 'simple' as const,
            explode: true,
            name: key,
            schema: schema as SchemaObject | ReferenceObject,
            required: true,
            description: (schema as SchemaObject).description
          }))
        )
      }

      if (operation.opts.query) {
        const converted = this.visitor.convert(operation.opts.query)
        if (converted.type !== 'object') {
          throw new Error('Query parameters must always generate an object schema')
        }

        documentedOperation.parameters ||= []
        documentedOperation.parameters.push(
          ...Object.entries(converted.properties || {}).map(([key, schema]) => ({
            in: 'query' as const,
            style: 'form' as const,
            explode: true,
            name: key,
            schema: schema as SchemaObject | ReferenceObject,
            description: (schema as SchemaObject).description
          }))
        )
      }

      documentedOperation.responses = this.options.responseBodyFactory(
        operation,
        this.visitor.convert(operation.opts.response)
      )

      this.document.paths[operation.opts.path] ||= {}
      this.document.paths[operation.opts.path][
        operation.opts.method.toLowerCase() as 'post'
      ] = documentedOperation
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
  public static create(
    options: WithOptional<OpenAPIBuilderOptions, 'requestBodyFactory' | 'responseBodyFactory'>
  ): OpenAPIBuilder {
    return new OpenAPIBuilder({
      requestBodyFactory: createRequestFactory('application/json'),
      responseBodyFactory: createResponseFactory('application/json'),
      ...options
    })
  }
}
