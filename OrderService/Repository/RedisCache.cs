using Newtonsoft.Json;
using StackExchange.Redis;

namespace OrderService.Repository
{
    public class RedisCache
    {
        private IDatabase _db;

        public RedisCache(IConnectionMultiplexer connectionMultiplexer)
        {
            _db = connectionMultiplexer.GetDatabase();
        }
        public async Task<T> GetCacheData<T>(string key)
        {
            var value = await _db.StringGetAsync(key);
            if (!string.IsNullOrEmpty(value))
            {
                return JsonConvert.DeserializeObject<T>(value);

            }
            return default(T);

        }

        public async Task<object> RemoveData(string key)
        {
            bool _isKeyExist = await _db.KeyExistsAsync(key);

            if (_isKeyExist == true)
            {
                return _db.KeyDelete(key);
            }
            return false;
        }

        public async Task<bool> SetCacheData<T>(string key, T value, DateTimeOffset expirationTime)
        {
            try
            {
                TimeSpan expiryTime = expirationTime.DateTime.ToUniversalTime().Subtract(DateTime.UtcNow);
                return await _db.StringSetAsync(key, JsonConvert.SerializeObject(value), expiryTime);
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                throw new Exception("Error setting cache data.", ex);
            }
        }



        public async Task<List<string>> GetKeysByPattern(string pattern)
        {

            var keys = new List<string>();
            try
            {
                var endpoint = _db.Multiplexer.GetEndPoints().FirstOrDefault();
                if (endpoint == null)
                {
                    return keys;
                }

                var server = _db.Multiplexer.GetServer(endpoint);

                keys = server.Keys(pattern: pattern).Select(k => k.ToString()).ToList();
            }
            catch (Exception)
            {
                // Log lỗi hoặc xử lý lỗi nếu có
                // Ví dụ: _logger.LogError($"Redis error: {ex.Message}");
            }

            return keys;
        }

    }
}
