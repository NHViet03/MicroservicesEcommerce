using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using OrderService.Models;

namespace OrderService.Repository
{
    public class CategoryRepository
    {
        private readonly IMongoCollection<Category> _categoryCollection;

        public CategoryRepository(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);

            var database = client.GetDatabase(settings.Value.DatabaseName);

            _categoryCollection = database.GetCollection<Category>(settings.Value.CategoryCollection);
        }

        public async Task<string> GetNameCategoryByID(string id)
        {
            var category = await _categoryCollection.Find(c => c.Id == id).FirstOrDefaultAsync();

            return category.Name ?? "";
        }

        public async Task<List<Category>> GetAllCategory()
        {
            return await _categoryCollection.Find(new BsonDocument()).ToListAsync();
        }
    }
}
