using Microsoft.Extensions.Options;
using MongoDB.Driver;
using OrderService.Models;

namespace OrderService.Repository
{
    public class OrderDetailRepository
    {
        private readonly IMongoCollection<OrderDetail> _orderDetailCollection;

        public OrderDetailRepository(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _orderDetailCollection = database.GetCollection<OrderDetail>(settings.Value.OrderDetailCollection);
        }

        public async Task<int> CountOrderDetailByOrderID(string orderId)
        {
            return (int)await _orderDetailCollection.CountDocumentsAsync(od => od.OrderId == orderId);
        }

        public async Task<List<OrderDetail>> GetOrderDetailByOrderID(string orderId)
        {
            return await _orderDetailCollection.Find(od => od.OrderId == orderId).ToListAsync();
        }

        //CreateOrderDetail
        public async Task CreateOrderDetail(OrderDetail orderDetail)
        {
            await _orderDetailCollection.InsertOneAsync(orderDetail);
        }

    }
}
