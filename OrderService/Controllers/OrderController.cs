using Azure.Messaging.ServiceBus;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OrderService.DTO;
using OrderService.Models;
using OrderService.Repository;
using System.Net;
using System.Text;

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
        private readonly IConfiguration _configuration;

        public OrderController(OrderRepository orderRepository, OrderDetailRepository orderDetailRepository, ProductRepository productRepository, RedisCache redisCache, IConfiguration configuration)
        {
            _orderRepository = orderRepository;
            _orderDetailRepository = orderDetailRepository;
            _productRepository = productRepository;
            _redisCache = redisCache;
            _configuration = configuration;
        }
        private async Task<UserFromTokenDTO?> ValidateToken()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token))
            {
                throw new UnauthorizedAccessException("Authorization header is missing");
            }

            using HttpClient client = new HttpClient();
            client.DefaultRequestHeaders.Add("Authorization", token);
            string url = "http://account:5000/api/validate";
            HttpResponseMessage response = await client.PostAsync(url, null);

            if (response.StatusCode != HttpStatusCode.OK)
            {
                throw new UnauthorizedAccessException("Invalid token");
            }

            var responseData = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<UserFromTokenDTO>(responseData);
        }

        //User API
        [HttpGet]
        [Route("user/getAllOrder/{customerId}")]
        public async Task<IActionResult> GetAllOrder(string customerId)
        {
            try
            {
                var customerDataToken = await ValidateToken();

                // API From Account
                var result = await _orderRepository.GetAllOrder(customerDataToken.data.CustomerId);

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
                var customerDataToken = await ValidateToken();
                var result = await _orderRepository.GetOrderById(orderId);

                if (result == null)
                {
                    return NotFound();
                }

                var orderDetails = await _orderDetailRepository.GetOrderDetailByOrderID(orderId);



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

                return Ok(new
                {
                    message = "Order fetched successfully",
                    order = new
                    {
                        OrderId = result.Id,
                        Address = result.Address,
                        OrderDate = result.OrderDate,
                        OrderStatus = result.OrderStatus,
                        Total = result.Total,
                        Name = customerDataToken.data.FirstName + " " + customerDataToken.data.LastName,
                        PhoneNumber = customerDataToken.data.PhoneNumber,
                        OrderDetails = finalResult
                    }
                });
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
                var customerDataToken = await ValidateToken();


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

                // Start ==> Update Customer Address and Phone Number
                // API From Account
                var customer = new UpdateDeliveryInfoDTO
                {
                    customerId = customerDataToken.data.CustomerId,
                    address = orderDTO.address,
                    phoneNumber = orderDTO.phoneNumber
                };

                // Put API to localhost:3000/api/updateDeliveryInfo with body  UpdateDeliveryInfoDTO
                using HttpClient client = new HttpClient();
                client.DefaultRequestHeaders.Add("Authorization", Request.Headers["Authorization"].ToString());
                string url = "http://account:5000/api/updateDeliveryInfo";
                var json = JsonConvert.SerializeObject(customer);
                var data = new StringContent(json, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PutAsync(url, data);

                //End  Start ==> Update Customer Address and Phone Number

                // Start => Call Azure Bus Service Order
                var connectionStringAzureBus = _configuration["AzureServiceBus:ConnectionString"];
                var clientAzureBus = new ServiceBusClient(connectionStringAzureBus);
                var sender = clientAzureBus.CreateSender("orderqueue");
                var body = new OrderSendMailDTO
                {
                    OrderId = orderResult.Id,
                    Email = customerDataToken.data.Email,
                    FullName = customerDataToken.data.FirstName + " " + customerDataToken.data.LastName,
                    TotalPrice = orderResult.Total
                };
                // JsonSerializer.Serialize
                var serializedMailBody = System.Text.Json.JsonSerializer.Serialize(body);
                var message = new ServiceBusMessage(serializedMailBody);
                await sender.SendMessageAsync(message);
                // End => Call Azure Bus Service Order

                return Ok(new { message = "Order created successfully", orderId = orderResult.Id });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });

            }
        }

    }
}
