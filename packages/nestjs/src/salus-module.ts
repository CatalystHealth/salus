import {
  Abstract,
  DynamicModule,
  Inject,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  Type
} from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { Operation } from '@salus-js/http'
import { OpenAPIOptions, toOpenApi } from '@salus-js/openapi'
import type { Request, Response } from 'express'

import { MODULE_OPTIONS_TOKEN } from './constants'
import { OperationRegistry } from './operation-registry'

export interface SalusModuleOptions {
  /**
   * Append a base URL to the generated OpenAPI documentation
   */
  readonly baseUrl?: string

  /**
   * Path to mount on the server for the OpenAPI definition
   */
  readonly openApi?: {
    readonly path: string
    readonly options: Omit<OpenAPIOptions, 'operations'>
    readonly filter?: (operation: Operation) => boolean
  }
}

export interface SalusModuleOptionsFactory {
  /**
   * Items to inject into the factory
   */
  readonly inject: Array<string | symbol | Type<any> | Abstract<any>>

  /**
   * Factory function for
   */
  readonly useFactory: (...dependencies: any[]) => Promise<SalusModuleOptions>
}

@Module({
  providers: [
    {
      provide: OperationRegistry,
      inject: [ModuleRef],
      useFactory: (module) => OperationRegistry.from(module)
    }
  ]
})
export class SalusModule implements NestModule {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly options: SalusModuleOptions,
    @Inject(OperationRegistry) private readonly registry: OperationRegistry
  ) {}

  public configure(consumer: MiddlewareConsumer): void {
    if (!this.options.openApi) {
      return
    }

    const options = this.options.openApi.options
    const openApiMiddleware = (_req: Request, res: Response) => {
      const operations = this.registry.scanOperations(this.options.openApi?.filter)
      const document = toOpenApi({
        ...options,
        operations
      })

      res.send(document)
    }

    consumer.apply(openApiMiddleware).forRoutes({
      method: RequestMethod.GET,
      path: this.options.openApi.path
    })
  }

  public static forRoot(options: SalusModuleOptions = {}): DynamicModule {
    return {
      module: SalusModule,
      providers: [
        {
          provide: MODULE_OPTIONS_TOKEN,
          useValue: options
        }
      ]
    }
  }

  public static forRootAsync(factory: SalusModuleOptionsFactory): DynamicModule {
    return {
      module: SalusModule,
      providers: [
        {
          provide: MODULE_OPTIONS_TOKEN,
          inject: factory.inject,
          useFactory: factory.useFactory
        }
      ]
    }
  }
}
