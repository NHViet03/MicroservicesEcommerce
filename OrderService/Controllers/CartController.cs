using Microsoft.AspNetCore.Mvc;
using OrderService.DTO;
using OrderService.Models;
using OrderService.Repository;

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

        [HttpPost]
        [Route("user/addToCart")]
        public async Task<IActionResult> AddToCart([FromBody] AddToCartDTO addToCartDTO)
        {
            try
            {
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



