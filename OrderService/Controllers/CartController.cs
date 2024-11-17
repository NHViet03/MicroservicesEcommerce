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
                    await redisCache.SetCacheData(cacheKey, cartExist, DateTimeOffset.Now.AddMinutes(2.0));
                }
                else
                {
                    var cart = new Cart
                    {
                        CustomerId = addToCartDTO.CustomerId,
                        ProductId = addToCartDTO.ProductId,
                        Quantity = 1
                    };
                    await redisCache.SetCacheData(cacheKey, cart, DateTimeOffset.Now.AddMinutes(2.0));
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
                    if (cart.Status == "DELETE")
                    {
                        //var cacheKey = $"{cart.CartId}";
                        var cacheKey = await redisCache.GetCacheKeyFromCartId(cart.CartId);

                        await redisCache.RemoveData(cacheKey);
                    }
                    else if (cart.Status == "UPDATE")
                    {
                        var cacheKey = await redisCache.GetCacheKeyFromCartId(cart.CartId);
                        var cartExist = await redisCache.GetCacheData<Cart>(cacheKey);
                        if (cartExist != null)
                        {
                            cartExist.Quantity = cart.Quantity;
                            await redisCache.SetCacheData(cacheKey, cartExist, DateTimeOffset.UtcNow.AddMinutes(5));
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
                            ProductName = product.Name,
                            ProductImage = product.Image,
                            Price = product.Price,
                            SalePrice = product.SalePrice,
                            Quantity = cart.Quantity,
                            Total = product.SalePrice * cart.Quantity,
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
    }
}



