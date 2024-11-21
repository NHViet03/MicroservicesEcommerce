using Microsoft.AspNetCore.Mvc;
using OrderService.Models;
using OrderService.Repository;

namespace OrderService.Controllers
{
    [Route("api/product")]
    [ApiController]
    public class ProductController : ControllerBase
    {

        private readonly ProductRepository _productRepository;
        private readonly CategoryRepository _categoryRepository;

        public ProductController(ProductRepository productRepository, CategoryRepository categoryRepository)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
        }



        //User API
        [HttpGet]
        [Route("user/countProduct")]
        public async Task<IActionResult> CountProduct([FromQuery] string categoryId)
        {
            try
            {
                var result = await _productRepository.CountProductByCategory(categoryId);


                return Ok(new { count = result });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpGet]
        [Route("user/getAllProduct")]
        public async Task<IActionResult> GetAllProduct([FromQuery] string categoryId = "", [FromQuery] int pageSize = 1, [FromQuery] int sortType = 0)
        {
            try
            {
                var result = new List<Product>();
                if (categoryId != "")
                {
                    result = await _productRepository.GetAllProductByCategory(categoryId);

                }
                else
                {
                    result = await _productRepository.GetAllProduct();
                }

                // Page Size Take 5 Skip 5
                if (pageSize > 1)
                {
                    result = result.Skip((pageSize - 1) * 5).Take(5).ToList();
                }

                // Sort Type = 1: Price Ascending, 2: Price Descending , 3 : Sale Price Ascending
                if (sortType == 1)
                {
                    result = result.OrderBy(p => p.Price).ToList();
                }
                else if (sortType == 2)
                {
                    result = result.OrderByDescending(p => p.Price).ToList();
                }
                else if (sortType == 3)
                {
                    result = result.OrderBy(p => p.SalePrice).ToList();
                }

                if (result == null)
                {
                    return NotFound();
                }

                var finalResult = new List<dynamic>();
                foreach (var item in result)
                {
                    var categoryName = await _categoryRepository.GetNameCategoryByID(item.CategoryId);
                    var dynamicObj = new
                    {
                        ProductId = item.Id,
                        CategoryId = item.CategoryId,
                        CategoryName = categoryName,
                        Name = item.Name,
                        Price = item.Price,
                        SalePrice = item.SalePrice,
                        ProductImage = new List<string> { item.Image }
                    };
                    finalResult.Add(dynamicObj);
                }
                return Ok(finalResult);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpGet]
        [Route("user/getProduct/{productId}")]
        public async Task<IActionResult> GetProduct(string productId)
        {
            try
            {
                var result = await _productRepository.GetProductById(productId);

                if (result == null)
                {
                    return NotFound();
                }

                var categoryName = await _categoryRepository.GetNameCategoryByID(result.CategoryId);
                var finalResult = new
                {
                    ProductId = result.Id,
                    CategoryId = result.CategoryId,
                    CategoryName = categoryName,
                    ProductName = result.Name,
                    Description = result.Description,
                    Price = result.Price,
                    SalePrice = result.SalePrice,
                    Quantity = result.Quantity,
                    ProductImage = new List<string> { result.Image }
                };
                return Ok(finalResult);
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }
    }
}
