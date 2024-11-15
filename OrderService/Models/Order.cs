using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace OrderService.Models
{
    public class Order
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        public string? CustomerId { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public string? Address { get; set; }

        public int? OrderStatus { get; set; }

        public decimal? Total { get; set; }
    }
}
