namespace OrderService.Models
{
    public class MongoDBSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;

        public string CategoryCollection { get; set; } = null!;

        public string ProductCollection { get; set; } = null!;

        public string OrderCollection { get; set; } = null!;

        public string OrderDetailCollection { get; set; } = null!;
    }
}
