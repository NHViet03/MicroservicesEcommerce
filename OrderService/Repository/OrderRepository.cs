using Microsoft.Extensions.Options;
using MongoDB.Driver;
using OrderService.Models;

namespace OrderService.Repository
{
    public class OrderRepository
    {
        private readonly IMongoCollection<Order> _orderCollection;

        public OrderRepository(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);

            var database = client.GetDatabase(settings.Value.DatabaseName);

            _orderCollection = database.GetCollection<Order>(settings.Value.OrderCollection);
        }

    }
}
