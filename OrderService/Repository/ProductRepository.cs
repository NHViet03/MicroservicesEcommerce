using Microsoft.Extensions.Options;
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

        public async Task CreateProduct(Product product)
        {
            await _productCollection.InsertOneAsync(product);
        }
    }
}
