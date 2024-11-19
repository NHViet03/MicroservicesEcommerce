using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OrderService.DTO;
using OrderService.Models;
using OrderService.Repository;
using System.Net;

namespace OrderService.Controllers
{
    [Route("api/customer")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly RedisCache redisCache;
        private readonly ProductRepository productRepository;


        public CartController(RedisCache redisCache, ProductRepository productRepository)
        {
            this.redisCache = redisCache;
            this.productRepository = productRepository;
        }

        private async Task<UserFromTokenDTO?> ValidateToken()
        {
            //var token = Request.Headers["Authorization"].ToString();
            // Get token from header Bearer
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token))
            {
                throw new UnauthorizedAccessException("Authorization header is missing");
            }

            using HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", token);
            string url = "http://localhost:5000/api/validate";
            HttpResponseMessage response = await client.PostAsync(url, null);

            if (response.StatusCode != HttpStatusCode.OK)
            {
                throw new UnauthorizedAccessException("Invalid token");
            }

            var responseData = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<UserFromTokenDTO>(responseData);
        }


        [HttpPost]
        [Route("user/addToCart")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDTO addToCartDTO)
        {
            try
            {
                var customerDataToken = await ValidateToken();
                var cacheKey = $"{addToCartDTO.CustomerId}-{addToCartDTO.ProductId}";
                var cartExist = await redisCache.GetCacheData<Cart>(cacheKey);
                if (cartExist != null)
                {
                    cartExist.Quantity += 1;
                    await redisCache.SetCacheData(cacheKey, cartExist, DateTimeOffset.Now.AddDays(1.0));
                }
                else
                {
                    var cart = new Cart
                    {
                        CustomerId = addToCartDTO.CustomerId,
                        ProductId = addToCartDTO.ProductId,
                        Quantity = 1
                    };
                    await redisCache.SetCacheData(cacheKey, cart, DateTimeOffset.Now.AddDays(1.0));
                }

                return Ok(new { message = "Product added to cart" });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }

        }


        [HttpPost]
        [Route("user/updateAllCart")]

        public async Task<IActionResult> UpdateAllCart([FromBody] List<UpdateAllCartDTO> carts)
        {
            try
            {
                var customerDataToken = await ValidateToken();
                foreach (var cart in carts)
                {
                    var cacheKeyPattern = $"*-*";
                    var cacheKeys = await redisCache.GetKeysByPattern(cacheKeyPattern);
                    foreach (var cacheKey in cacheKeys)
                    {
                        var cartExits = await redisCache.GetCacheData<Cart>(cacheKey);

                        if (cartExits.Id == cart.CartId)
                        {
                            if (cart.Status == "UPDATE")
                            {
                                cartExits.Quantity = cart.Quantity;
                                await redisCache.SetCacheData(cacheKey, cartExits, DateTimeOffset.Now.AddDays(1.0));
                            }
                            else if (cart.Status == "DELETE")
                            {
                                await redisCache.RemoveData(cacheKey);
                            }
                        }

                    }
                }

                return Ok(new { message = "Cart updated" });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpGet]
        [Route("user/getAllCart/{customerId}")]
        public async Task<IActionResult> GetAllCart(string customerId)
        {

            var getAllCart = new List<GetAllCartDTO>();
            try
            {
                var customerDataToken = await ValidateToken();
                // Get all keys from Redis like "customerId-*"
                var cacheKeyPattern = $"{customerId}-*";
                var cacheKeys = await redisCache.GetKeysByPattern(cacheKeyPattern);
                foreach (var cacheKey in cacheKeys)
                {
                    var cart = await redisCache.GetCacheData<Cart>(cacheKey);
                    if (cart != null)
                    {
                        var product = await productRepository.GetProductById(cart.ProductId);
                        var cartDTO = new GetAllCartDTO
                        {
                            CartId = cart.Id,
                            ProductId = cart.ProductId,
                            ProductName = product?.Name,
                            ProductImage = product?.Image,
                            Price = product?.Price,
                            SalePrice = product?.SalePrice,
                            Quantity = cart.Quantity,
                            Total = product?.SalePrice * cart.Quantity,
                            Status = ""
                        };
                        getAllCart.Add(cartDTO);

                    }
                }
                return Ok(getAllCart);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpGet]
        [Route("user/getAllCartAuth/{customerId}")]
        public async Task<IActionResult> GetAllCartAuth(string customerId)
        {
            var getAllCart = new List<GetAllCartAuthDTO>();
            try
            {
                var customerDataToken = await ValidateToken();
                // Get all keys from Redis like "customerId-*"
                var cacheKeyPattern = $"{customerId}-*";
                var cacheKeys = await redisCache.GetKeysByPattern(cacheKeyPattern);
                foreach (var cacheKey in cacheKeys)
                {
                    var cart = await redisCache.GetCacheData<Cart>(cacheKey);
                    if (cart != null)
                    {
                        var product = await productRepository.GetProductById(cart.ProductId);
                        var cartDTO = new GetAllCartAuthDTO
                        {
                            CartId = cart.Id,
                            ProductId = cart.ProductId,
                            Quantity = cart.Quantity,
                        };
                        getAllCart.Add(cartDTO);

                    }
                }
                return Ok(getAllCart);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }
    }
}



