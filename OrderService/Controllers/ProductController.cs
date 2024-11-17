using Microsoft.AspNetCore.Mvc;
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
        public async Task<IActionResult> CountProduct()
        {
            try
            {
                var result = await _productRepository.CountProduct();


                return Ok(new { count = result });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpGet]
        [Route("user/getAllProduct")]
        public async Task<IActionResult> GetAllProduct()
        {
            try
            {
                var result = await _productRepository.GetAllProduct();

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
