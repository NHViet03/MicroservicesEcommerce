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

        public async Task<List<Order>> GetAllOrder(string customerId)
        {
            return await _orderCollection.Find(o => o.CustomerId == customerId).ToListAsync();
        }
        public async Task<Order> GetOrderById(string id)
        {
            return await _orderCollection.Find(o => o.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Order> GetOrder(string orderId)
        {
            return await _orderCollection.Find(o => o.Id == orderId).FirstOrDefaultAsync();
        }

        //CreateOrder
        public async Task<Order> CreateOrder(Order order)
        {


            await _orderCollection.InsertOneAsync(order);
            // Return Order From OrderDate
            var result = await _orderCollection.Find(o => o.OrderDate == order.OrderDate).FirstOrDefaultAsync();
            return result;
        }

    }
}
