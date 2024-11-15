using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using OrderService.Models;

namespace OrderService.Repository
{
    public class ProductRepository
    {
        private readonly IMongoCollection<Product> _productCollection;

        public ProductRepository(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);

            var database = client.GetDatabase(settings.Value.DatabaseName);

            _productCollection = database.GetCollection<Product>(settings.Value.ProductCollection);
        }

        public async Task<int> CountProduct()
        {
            return (int)await _productCollection.CountDocumentsAsync(new BsonDocument());
        }

        public async Task<List<Product>> GetAllProduct()
        {
            return await _productCollection.Find(new BsonDocument()).ToListAsync();
        }

        public async Task<Product> GetProductById(string id)
        {
            return await _productCollection.Find(p => p.Id == id).FirstOrDefaultAsync();
        }

        public async Task<int> CountProductByCategory(string categoryId)
        {
            return (int)await _productCollection.CountDocumentsAsync(p => p.CategoryId == categoryId);
        }
    }
}
