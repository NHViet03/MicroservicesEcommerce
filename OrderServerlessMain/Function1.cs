using Microsoft.Azure.WebJobs;
using Microsoft.Extensions.Logging;
using OrderServerlessMain.DTO;
using System.Net.Mail;
using System.Text.Json;
using System.Threading.Tasks;

namespace OrderServerlessMain
{
    public class Function1
    {
        [FunctionName("Function1")]
        public async Task Run([ServiceBusTrigger("orderqueue", Connection = "OrderServerlessConnection")] string myQueueItem, ILogger log)
        {
            log.LogInformation($"C# ServiceBus queue trigger function processed message: {myQueueItem}");

            //SendEmailDTO = message.Body
            var sendEmailDTO = JsonSerializer.Deserialize<SendEmailDTO>(myQueueItem.ToString());

            var subject = $"Order {sendEmailDTO?.OrderId} Infomation";
            var recetor = sendEmailDTO?.Email;
            var email = "forecastweather230@gmail.com";
            var password = "vdtc yisl llfw jgrg";
            var host = "smtp.gmail.com";
            var port = 587;
            var smtpClient = new SmtpClient(host, port);

            smtpClient.EnableSsl = true;
            smtpClient.UseDefaultCredentials = false;

            smtpClient.Credentials = new System.Net.NetworkCredential(email, password);

            // create body send mail
            var body = $"Dear {sendEmailDTO.FullName},\n\n" +
                $"Thank you for your order. Here is the information of your order:\n\n" +
                $"Order ID: {sendEmailDTO.OrderId}\n" +
                $"Total Price: {sendEmailDTO.TotalPrice}\n\n" +
                $"Best regards,\n" +
                $"Order Serverless";

            var messageSendMail = new MailMessage(email, recetor, subject, body);

            await smtpClient.SendMailAsync(messageSendMail);



            // Complete the message
            await Task.CompletedTask;
        }
    }
}
