import { Abstract, DynamicModule, Module, Type } from '@nestjs/common'
import { APP_INTERCEPTOR, ModuleRef } from '@nestjs/core'
import { OpenAPIBuilder } from '@salus-js/openapi'

import { MODULE_OPTIONS_TOKEN } from './constants'
import { OperationRegistry } from './operation-registry'
import { SerializationInterceptor } from './serialization-interceptor'

export interface SalusModuleOptions {
  /**
   * Append a base URL to the generated OpenAPI documentation
   */
  readonly baseUrl?: string
  /**
   * Append a base URL to the generated OpenAPI documentation
   */
  readonly openApiOptions?: OpenAPIBuilder['options']
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
export class SalusModule {
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
