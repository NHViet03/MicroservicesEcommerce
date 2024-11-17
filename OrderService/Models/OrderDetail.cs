using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace OrderService.Models
{
    public class OrderDetail
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } = Guid.NewGuid().ToString();

        public string? OrderId { get; set; }

        public string? ProductId { get; set; }

        public decimal? Price { get; set; }

        public int? Quantity { get; set; }
    }
}
