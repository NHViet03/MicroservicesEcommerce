namespace OrderService.DTO
{
    public class CreateOrderDTO
    {
        public string? address { get; set; }
        public string? phoneNumber { get; set; }

        public string? customerId { get; set; }

        public List<CreateOrderDetailDTO>? orderDetails { get; set; }
    }

    public class CreateOrderDetailDTO
    {
        public string? ProductId { get; set; }
        public decimal? Price { get; set; }

        public decimal? SalePrice { get; set; }
        public int? Quantity { get; set; }

        public decimal? Total { get; set; }
    }
}
