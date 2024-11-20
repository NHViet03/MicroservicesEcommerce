namespace OrderServerlessMain.DTO
{
    public class SendEmailDTO
    {
        public string? Email { get; set; }

        public string? FullName { get; set; }
        public string? OrderId { get; set; }
        public decimal? TotalPrice { get; set; }
    }
}
