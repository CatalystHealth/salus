import * as io from '@tsio/codec/src'
import * as util from 'util'

import { OpenAPIBuilder } from './builder'
import { postOperation } from './operation'

const CreateUserParams = io.object({
  first_name: io.string,
  last_name: io.string
})

const UserResource = io.object({
  object: io.literal('user').document({
    description: 'Always `user`'
  }),
  first_name: io.string.document({
    description: 'First name for the user',
    example: 'Colin'
  }),
  last_name: io.string.document({
    description: 'Last name for the user',
    example: 'Morelli'
  })
})

const UpdateUserPathParams = io.object({
  id: io.string.document({
    description: 'Unique ID for the user to update'
  })
})

const GlobalQueryParams = io.object({
  expand: io.array(io.string).document({
    description: 'Properties to expand on the response'
  })
})

const UpdateUserOperation = postOperation('/v1/users/{id}', {
  description: 'Creates a new user',
  params: UpdateUserPathParams,
  query: GlobalQueryParams,
  body: CreateUserParams,
  response: UserResource
})

const generator = OpenAPIBuilder.create({
  info: {
    version: '1.0',
    title: 'Catalyst API'
  }
}).addServer({
  url: 'https://api.withcatalyst.com/v1',
  description: 'Production Server'
})

console.log(util.inspect(generator.operation(UpdateUserOperation).build(), false, 20, true))
