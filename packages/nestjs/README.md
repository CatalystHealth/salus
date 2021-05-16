# Intro

A library for mounting Salus operations at NestJS controllers. Retains full compatibility with the NestJS controller ecosystem.

# Usage

The `@salus-js/nestjs` is a simple drop-in to any NestJS application. Let's look at handling a simple operation.

```typescript
import { t } from '@salus-js/codec'
import { http } from '@salus-js/http'
import { Operation, Input, InputOf, OutputOf, SalusModule } from '@salus-js/nestjs'

const getUser = http.get('/v1/users/:id', {
  summary: 'Retrieve a user',
  description: 'Fetches the user associated with the given ID',
  params: t.object({
    id: t.string.document({
      description: 'Unique ID for the user to retrieve'
    })
  }),
  response: t.object({
    id: t.string.document({
      description: 'Unique ID for the user'
    }),
    name: t.string.document({
      description: 'Name for the user'
    })
  })
})

@Controller()
class UsersController {

  @Operation(getUser)
  public getUser(@Input() input: InputOf<typeof getUser>): OutputOf<typeof getUser> {
    return {
      id: input.params.id,
      name: 'Hello World'
    }
  }

}

@Module({
  imports: [
    SalusModule.forRoot()
  ],
  controllers: [
    UsersController
  ]
})
class AppModule {

}
```

# Interceptor

Salus requires a custom NestJS interceptor to be registered in order for your responses to be serialized correctly. This serializer is automatically registered with the `SalusModule`.

# Registry

When using the Salus NestJS module, you get access to an instance of `OperationRegistry` that can provide you access to all operations that have been mounted in the NestJS. You can inject `OperationRegistry` from `@salus-js/nestjs` in any module.

# OpenAPI

The NestJS module also supports automatically generating OpenAPI documents. You can enable this when importing the Salus module in your application:

```typescript
@Module({
  imports: [
    SalusModule.forRoot({
      openApi: {
        path: '/openapi.yml',
        options: {
          info: {
            version: '1.0',
            title: 'My API
          }
        }
      }
    })
  ],
  controllers: [
    UsersController
  ]
})
class AppModule {

}
```