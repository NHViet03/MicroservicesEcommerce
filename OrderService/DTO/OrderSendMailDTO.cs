namespace OrderService.DTO
{
    public class OrderSendMailDTO
    {
        public string? Email { get; set; }

        public string? FullName { get; set; }
        public string? OrderId { get; set; }
        public decimal? TotalPrice { get; set; }
    }
}
