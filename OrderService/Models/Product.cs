using MongoDB.Bson.Serialization.Attributes;

namespace OrderService.Models
{
    public class Product
    {
        [BsonId]
        public string? Id { get; set; }

        public string? CategoryId { get; set; }

        public string? Name { get; set; }

        public string? Description { get; set; }

        public decimal? Price { get; set; }

        public decimal? SalePrice { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public int? Quantity { get; set; }

        public string? Image { get; set; }

        public int? ValidFlag { get; set; }

    }
}
