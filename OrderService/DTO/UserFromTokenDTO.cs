namespace OrderService.DTO
{
    public class UserFromTokenDTO
    {
        public string? msg { get; set; }
        public UserFromTokenDataDTO? data { get; set; }
    }

    public class UserFromTokenDataDTO
    {
        public string? UserId { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? CustomerId { get; set; }
        public string? Address { get; set; }
        public string? PhoneNumber { get; set; }
    }
}
