using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using OrderService.Repository;

namespace OrderService.Controllers
{
    [EnableCors("MyPolicy")]
    [Route("api/category")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryRepository _categoryRepository;
        private readonly ProductRepository _productRepository;

        public CategoryController(CategoryRepository categoryRepository, ProductRepository productRepository)
        {
            _categoryRepository = categoryRepository;
            _productRepository = productRepository;
        }

        //User API
        [DisableCors]
        [HttpGet]
        [Route("user/getAllCategory")]
        public async Task<IActionResult> GetAllCategory()
        {
            try
            {
                var result = await _categoryRepository.GetAllCategory();

                if (result == null)
                {
                    return NotFound();
                }


                var finalResult = new List<dynamic>();
                foreach (var item in result)
                {
                    var productCount = await _productRepository.CountProductByCategory(item.Id);
                    var dynamicObj = new
                    {
                        id = item.Id,
                        name = item.Name,
                        product_count = productCount
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
    }
}
