# Intro

A library for making type-safe HTTP requests built on the popular Axios client.

# Usage

`@salus-js/http-client` builds on `@salus-js/codec` and `@salus-js/http` to make runtime type-checked HTTP requests a breeze. Let's run through a quick sample:

```typescript
import { t } from '@salus-js/codec'
import { http } from '@salus-js/http'
import { AxiosClient } from '@salus-js/http-client'

const todoResource = t.object({
  userId: t.number,
  id: t.number,
  title: t.string,
  completed: t.boolean
})

const todoParams = t.object({
  id: t.number
})

const getTodo = http.get('/todos/:id', {
  params: todoParams,
  response: todoResource
})

const client = AxiosClient.create('https://jsonplaceholder.typicode.com/')

const responsePromise = client.execute(getTodo, {
  params: {
    id: 1
  }
})

responsePromise.then((response) => {
  console.log(response.data)
})
```

# Guide

## Client Instance

When creating a new instance of the Salus Axios client, you need to specify a default baseURL. This URL will be prepended to all paths defined in your operations. Note that you are able to override the baseURL for a specific request.