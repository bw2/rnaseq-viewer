import redis
import settings


def get_redis_client():
    return redis.StrictRedis(host=settings.REDIS_SERVICE_HOSTNAME, socket_connect_timeout=3)
