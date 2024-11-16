namespace OrderService.Models
{
    public class Cart
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        public string? CustomerId { get; set; }

        public string? ProductId { get; set; }

        public int? Quantity { get; set; }
    }
}
