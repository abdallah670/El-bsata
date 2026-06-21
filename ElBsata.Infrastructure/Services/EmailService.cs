using ElBsata.Application.Common.Interfaces;
using ElBsata.Domain.Entities;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;

namespace ElBsata.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;
    public EmailService(IConfiguration config, ILogger<EmailService> logger) { _config = config; _logger = logger; }
    public async Task<bool> SendOrderEmailAsync(Order order)
    {
        var smtpUser = Environment.GetEnvironmentVariable("SMTP_USER");
        var smtpPass = Environment.GetEnvironmentVariable("SMTP_PASS");
        var smtpHost = Environment.GetEnvironmentVariable("SMTP_HOST") ?? "smtp.gmail.com";
        var smtpPort = int.TryParse(Environment.GetEnvironmentVariable("SMTP_PORT"), out var port) ? port : 587;
        var recipient = Environment.GetEnvironmentVariable("SMTP_RECIPIENT") ?? "binfof123@gmail.com";
        if (string.IsNullOrWhiteSpace(smtpUser) || string.IsNullOrWhiteSpace(smtpPass))
        { _logger.LogInformation("SMTP not configured. Order {OrderId} saved locally.", order.Id); return false; }
        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("وسط البساطة - طلبات", smtpUser));
            message.To.Add(MailboxAddress.Parse(recipient));
            message.Subject = $"طلب جديد: {order.Id} - {order.Customer.Name}";
            message.Body = new BodyBuilder { HtmlBody = order.EmailLog }.ToMessageBody();
            using var client = new SmtpClient();
            await client.ConnectAsync(smtpHost, smtpPort, smtpPort == 465 ? MailKit.Security.SecureSocketOptions.SslOnConnect : MailKit.Security.SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(smtpUser, smtpPass); await client.SendAsync(message); await client.DisconnectAsync(true);
            _logger.LogInformation("Email sent for order {OrderId}", order.Id); return true;
        }
        catch (Exception ex) { _logger.LogError(ex, "Failed to send email for order {OrderId}", order.Id); return false; }
    }
}
