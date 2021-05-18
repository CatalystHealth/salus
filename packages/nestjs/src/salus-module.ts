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
import { APP_INTERCEPTOR, ModuleRef } from '@nestjs/core'
import { Operation } from '@salus-js/http'
import { OpenAPIOptions } from '@salus-js/openapi'
import type { Request, Response } from 'express'

import { MODULE_OPTIONS_TOKEN } from './constants'
import { OperationRegistry } from './operation-registry'
import { SerializationInterceptor } from './serialization-interceptor'

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
      provide: APP_INTERCEPTOR,
      inject: [MODULE_OPTIONS_TOKEN],
      useFactory: () => new SerializationInterceptor()
    },
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
    const openApi = this.options.openApi
    if (!openApi) {
      return
    }

    const openApiMiddleware = (_req: Request, res: Response) => {
      const document = this.registry.createOpenApiDocument(
        {
          ...openApi.options
        },
        this.options.openApi?.filter
      )

      res.send(document)
    }

    consumer.apply(openApiMiddleware).forRoutes({
      method: RequestMethod.GET,
      path: openApi.path
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
