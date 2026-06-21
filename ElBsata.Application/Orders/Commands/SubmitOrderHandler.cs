using AutoMapper;
using MediatR;
using ElBsata.Application.Common.Interfaces;
using ElBsata.Application.Orders.DTOs;
using ElBsata.Domain.Entities;
using ElBsata.Domain.Enums;

namespace ElBsata.Application.Orders.Commands;

public class SubmitOrderHandler : IRequestHandler<SubmitOrderCommand, SubmitOrderResult>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;
    private readonly IMapper _mapper;

    public SubmitOrderHandler(IUnitOfWork unitOfWork, IEmailService emailService, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _emailService = emailService;
        _mapper = mapper;
    }

    public async Task<SubmitOrderResult> Handle(SubmitOrderCommand cmd, CancellationToken ct)
    {
        if (cmd.Request.Items == null || cmd.Request.Items.Count == 0)
            return new SubmitOrderResult { Success = false, Message = "\u0639\u0646\u0627\u0635\u0631 \u0627\u0644\u0637\u0644\u0628 \u0645\u0641\u0642\u0648\u062F\u0629" };

        var orderId = $"ORD-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() % 1_000_000:D6}";

        var newOrder = _mapper.Map<Order>(cmd.Request);
        newOrder.Id = orderId;
        newOrder.Status = OrderStatus.Pending;
        newOrder.CreatedAt = DateTime.UtcNow.ToString("o");

        newOrder.EmailLog = GenerateEmailHtml(newOrder);
        var emailSent = await _emailService.SendOrderEmailAsync(newOrder);
        newOrder.Status = OrderStatus.Sent;

        await _unitOfWork.Orders.AddAsync(newOrder, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        return new SubmitOrderResult
        {
            Success = true,
            OrderId = orderId,
            EmailSent = emailSent,
            IsMock = !emailSent,
            Order = newOrder,
            Message = emailSent ? "\u062a\u0645 \u0627\u0644\u0625\u0631\u0633\u0627\u0644" : "\u062a\u0645 \u0627\u0644\u062D\u0641\u0638 (\u0645\u062D\u0627\u0643\u0627\u0629)"
        };
    }

    private static string GenerateEmailHtml(Order order)
    {
        var itemsHtml = string.Join("", order.Items.Select(i => $@"
            <tr>
                <td style=""padding:8px; border-bottom:1px solid #eee;"">{i.Item.Name}</td>
                <td style=""padding:8px; border-bottom:1px solid #eee; text-align:center;"">{i.Quantity}</td>
                <td style=""padding:8px; border-bottom:1px solid #eee; text-align:right;"">{(i.Item.Price ?? 0) * i.Quantity} ج.م</td>
            </tr>"));

        return $@"
        <html>
        <body style=""font-family: Arial, sans-serif; direction: rtl;"">
            <h2>طلب جديد #{order.Id}</h2>
            <p><strong>العميل:</strong> {order.Customer.Name}</p>
            <p><strong>الهاتف:</strong> {order.Customer.Phone}</p>
            <p><strong>العنوان:</strong> {order.Customer.Address}</p>
            <hr/>
            <table style=""width:100%; border-collapse:collapse;"">
                <thead>
                    <tr style=""background:#f5f5f5;"">
                        <th style=""padding:8px; text-align:right;"">المنتج</th>
                        <th style=""padding:8px; text-align:center;"">الكمية</th>
                        <th style=""padding:8px; text-align:right;"">السعر</th>
                    </tr>
                </thead>
                <tbody>{itemsHtml}</tbody>
            </table>
            <h3 style=""text-align:left;"">الإجمالي: {order.TotalPrice} ج.م</h3>
        </body>
        </html>";
    }
}
