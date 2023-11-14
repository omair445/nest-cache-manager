# NestJS Redis Caching Manager

This package provides a simple and effective way to cache responses in your NestJS applications using Redis. It includes a Redis service and a custom `@Cache` decorator that can be applied to controller methods for caching their responses.

## Installation

First, you need to install the package:

```bash
npm install nest-cache-manager
```
# Usage
## Setting Up Redis Service
Import the RedisService from the package and use it in your module.

```typescript
import { RedisService } from 'nest-cache-manager';

@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class YourModule {}

```

# Using the Cache Decorator
The `@Cache` decorator can be applied to controller methods to cache their responses. It accepts a `CacheOptions` object as an argument. The `CacheOptions` object has the following properties:
Here's a basic example:

```typescript
import { Cache } from 'nest-cache-manager';
import { Controller, Get } from '@nestjs/common';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @Cache('itemsList', 3600) // Cache key: 'itemsList', TTL: 3600 seconds
  async findAll() {
    // Your logic here
    return this.itemsService.findAll();
  }
}
```
In this example, the findAll method's response is cached for 1 hour (3600 seconds). If the same request is made within this period, the response will be served from the cache.

## Cache Variables for .env
```dotenv
REDIS_PORT=6379
REDIS_HOST=localhost
```

# Custom TTL and Cache Keys
```typescript
@Cache('customKey', 1200) // TTL set to 1200 seconds
```

### Example Usage in NestJS
See the project in `example` directory for a working example.

# Author
- [Omair Afzal](omair445@live.com)