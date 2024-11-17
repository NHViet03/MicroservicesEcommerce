namespace OrderService.DTO
{
    public class GetAllCartDTO
    {
        public string? CartId { get; set; }
        public string? ProductId { get; set; }
        public string? ProductName { get; set; }
        public string? ProductImage { get; set; }
        public decimal? Price { get; set; }

        public decimal? SalePrice { get; set; }

        public int? Quantity { get; set; }

        public decimal? Total { get; set; }

        public string? Status { get; set; }
    }
}
