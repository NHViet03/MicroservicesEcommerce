using MongoDB.Bson.Serialization.Attributes;

namespace OrderService.Models
{
    public class Order
    {
        [BsonId]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string? CustomerId { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public string? Address { get; set; }

        public int? OrderStatus { get; set; }

        public decimal? Total { get; set; }
    }
}
