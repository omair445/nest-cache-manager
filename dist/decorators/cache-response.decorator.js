"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const redis_service_1 = require("../redis/redis.service");
let CacheInterceptor = class CacheInterceptor {
    constructor(redisService, reflector) {
        this.redisService = redisService;
        this.reflector = reflector;
    }
    async intercept(context, next) {
        const key = this.reflector.get('cache_key', context.getHandler());
        const ttl = this.reflector.get('cache_ttl', context.getHandler());
        if (!key) {
            return next.handle();
        }
        const cachedResponse = await this.redisService.getValue(key);
        if (cachedResponse) {
            return (0, rxjs_1.of)(JSON.parse(cachedResponse));
        }
        return next.handle().pipe((0, operators_1.map)(async (response) => {
            await this.redisService.setValue(key, JSON.stringify(response), ttl);
            return response;
        }));
    }
};
CacheInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        core_1.Reflector])
], CacheInterceptor);
function Cache(key, ttl) {
    return function (target, propertyKey, descriptor) {
        (0, common_1.UseInterceptors)(new CacheInterceptor(new redis_service_1.RedisService(), new core_1.Reflector()))(target, propertyKey, descriptor);
        Reflect.defineMetadata('cache_key', key, descriptor.value);
        Reflect.defineMetadata('cache_ttl', ttl, descriptor.value);
    };
}
exports.Cache = Cache;
//# sourceMappingURL=cache-response.decorator.js.map