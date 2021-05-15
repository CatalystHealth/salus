import { MetadataScanner, ModuleRef, NestContainer } from '@nestjs/core'
import { Module } from '@nestjs/core/injector/module'
import { OpenAPIBuilder, Operation, OpenAPIObject } from '@tsio/openapi'

import { OPERATION_METADATA_KEY } from './constants'

export class OperationRegistry {
  constructor(private readonly operations: Operation[]) {}

  public createOpenApiDocument(
    options: OpenAPIBuilder['options'],
    filter?: (operation: Operation) => boolean
  ): OpenAPIObject {
    const filteredOperations = !filter ? this.operations : this.operations.filter(filter)

    return OpenAPIBuilder.create(options)
      .operation(...filteredOperations)
      .build()
  }

  public static from(module: ModuleRef): OperationRegistry {
    const container = (module as any).container as NestContainer
    const scanner = new MetadataScanner()
    const modules: Module[] = [...container.getModules().values()]
    const controllers = modules.flatMap(({ controllers }) => [...controllers.values()])
    const operations = controllers.flatMap((controller) => {
      const refinedInstance = controller.instance as Record<string, unknown>
      const prototype = Object.getPrototypeOf(refinedInstance)
      const scanned = scanner.scanFromPrototype(refinedInstance, prototype, (name) => {
        return Reflect.getMetadata(
          OPERATION_METADATA_KEY,
          refinedInstance[name] as Object
        ) as Operation | null
      })

      return scanned.filter((operation) => !!operation) as Operation[]
    })

    return new OperationRegistry(operations)
  }
}
