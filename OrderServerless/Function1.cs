using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using OrderServerless.DTO;
using System.Net.Mail;
using System.Text.Json;

namespace OrderServerless
{
    public class Function1
    {
        private readonly ILogger<Function1> _logger;

        public Function1(ILogger<Function1> logger)
        {
            _logger = logger;
        }

        [Function(nameof(Function1))]
        public async Task Run(
            [ServiceBusTrigger("orderqueue", Connection = "OrderServerlessConnection")]
            ServiceBusReceivedMessage message,
            ServiceBusMessageActions messageActions)
        {
            _logger.LogInformation("Message Body: {body}", message.Body);

            //SendEmailDTO = message.Body
            var sendEmailDTO = JsonSerializer.Deserialize<SendEmailDTO>(message.Body.ToString());

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
            await messageActions.CompleteMessageAsync(message);
        }
    }
}
