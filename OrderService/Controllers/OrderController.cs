using Microsoft.AspNetCore.Mvc;
using OrderService.DTO;
using OrderService.Models;
using OrderService.Repository;

namespace OrderService.Controllers
{
    [Route("api/order")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly OrderRepository _orderRepository;
        private readonly OrderDetailRepository _orderDetailRepository;
        private readonly ProductRepository _productRepository;
        private readonly RedisCache _redisCache;

        public OrderController(OrderRepository orderRepository, OrderDetailRepository orderDetailRepository, ProductRepository productRepository, RedisCache redisCache)
        {
            _orderRepository = orderRepository;
            _orderDetailRepository = orderDetailRepository;
            _productRepository = productRepository;
            _redisCache = redisCache;
        }

        //User API
        [HttpGet]
        [Route("user/getAllOrder/{customerId}")]
        public async Task<IActionResult> GetAllOrder(string customerId)
        {
            try
            {
                // API From Account
                var fakeCustomerId = "645b8a3d9f2a8c0001d7e2a1";
                var result = await _orderRepository.GetAllOrder(fakeCustomerId);

                if (result == null)
                {
                    return NotFound();
                }

                var finalResult = new List<dynamic>();
                foreach (var item in result)
                {
                    var countOrderDetail = await _orderDetailRepository.CountOrderDetailByOrderID(item.Id);
                    var dynamicObj = new
                    {
                        OrderId = item.Id,
                        OrderDate = item.OrderDate,
                        Address = item.Address,
                        OrderStatus = item.OrderStatus,
                        Total = item.Total,
                        Items = countOrderDetail
                    };
                    finalResult.Add(dynamicObj);
                }


                return Ok(new { message = "Orders fetched successfully", orders = finalResult });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpGet]
        [Route("user/getOrder/{orderId}")]
        public async Task<IActionResult> GetOrder(string orderId)
        {
            try
            {
                var result = await _orderRepository.GetOrderById(orderId);

                if (result == null)
                {
                    return NotFound();
                }

                var orderDetails = await _orderDetailRepository.GetOrderDetailByOrderID(orderId);

                // Get Customer Name and Phone Number from Account Service

                var finalResult = new List<dynamic>();
                foreach (var item in orderDetails)
                {
                    var product = await _productRepository.GetProductById(item.ProductId);
                    var dynamicObj = new
                    {
                        Name = product.Name,
                        Price = item.Price,
                        Quantity = item.Quantity,
                        Total = item.Price * item.Quantity,
                        Image = product.Image
                    };
                    finalResult.Add(dynamicObj);
                }

                return Ok(new { message = "Order fetched successfully", order = new { OrderId = result.Id, Address = result.Address, OrderDate = result.OrderDate, OrderStatus = result.OrderStatus, Total = result.Total, Name = "Jane Smith", PhoneNumber = "987-654-3210", OrderDetails = finalResult } });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }

        }

        [HttpPost]
        [Route("user/createOrder")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDTO orderDTO)
        {

            try
            {
                // Check quantity of products
                foreach (var item in orderDTO.orderDetails)
                {
                    var product = await _productRepository.GetProductById(item.ProductId);
                    if (product.Quantity < item.Quantity)
                    {
                        return BadRequest(new { message = $"Quantity of Product - {product.Name} only has {product.Quantity} items left. Please update the quantity and try again." });
                    }
                }

                var order = new Order
                {
                    CustomerId = orderDTO.customerId,
                    OrderDate = DateTime.Now,
                    Address = orderDTO.address,
                    PhoneNumber = orderDTO.phoneNumber,
                    OrderStatus = 0,
                    Total = orderDTO.orderDetails.Sum(o => o.Total)
                };

                var orderResult = await _orderRepository.CreateOrder(order);

                foreach (var item in orderDTO.orderDetails)
                {
                    var orderDetail = new OrderDetail
                    {
                        OrderId = orderResult.Id,
                        ProductId = item.ProductId,
                        Price = item.SalePrice != null ? item.SalePrice : item.Price,
                        Quantity = item.Quantity
                    };
                    await _orderDetailRepository.CreateOrderDetail(orderDetail);
                }

                // Update Product Quantity
                foreach (var item in orderDTO.orderDetails)
                {
                    var product = await _productRepository.GetProductById(item.ProductId);
                    product.Quantity = product.Quantity - item.Quantity;
                    await _productRepository.UpdateProduct(product);
                }


                // Delete Cart From Redis
                var cacheKeyPattern = $"{orderDTO.customerId}-*";
                var cacheKeys = await _redisCache.GetKeysByPattern(cacheKeyPattern);
                foreach (var key in cacheKeys)
                {
                    await _redisCache.RemoveData(key);
                }

                // Update Customer Address and Phone Number
                // API From Account



                return Ok(new { message = "Order created successfully", orderId = orderResult.Id });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });

            }
        }

    }
}
