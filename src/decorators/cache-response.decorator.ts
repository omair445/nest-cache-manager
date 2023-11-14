import {
  Injectable,
  UseInterceptors,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { NestInterceptor } from '@nestjs/common/interfaces/features/nest-interceptor.interface';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { RedisService } from '../redis/redis.service';

@Injectable()
class CacheInterceptor implements NestInterceptor {
  constructor(
    private readonly redisService: RedisService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const key = this.reflector.get<string>('cache_key', context.getHandler());
    const ttl = this.reflector.get<number>('cache_ttl', context.getHandler());

    if (!key) {
      return next.handle();
    }

    const cachedResponse = await this.redisService.getValue(key);
    if (cachedResponse) {
      return of(JSON.parse(cachedResponse));
    }

    return next.handle().pipe(
      map(async (response) => {
        await this.redisService.setValue(key, JSON.stringify(response), ttl);
        return response;
      }),
    );
  }
}

export function Cache(key: string, ttl: number): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    UseInterceptors(new CacheInterceptor(new RedisService(), new Reflector()))(
      target,
      propertyKey,
      descriptor,
    );
    Reflect.defineMetadata('cache_key', key, descriptor.value);
    Reflect.defineMetadata('cache_ttl', ttl, descriptor.value);
  };
}
