using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Nihonlet.Application.Flashcards.Commands;
using Nihonlet.Application.Flashcards.Queries;

namespace Nihonlet.API.Controllers;

// [Authorize] // Yêu cầu người dùng phải đăng nhập (gửi kèm Token JWT)
// [ApiController]
// [Route("api/[controller]")]
// public class FlashcardSetController : ControllerBase
// {
//     private readonly IMediator _mediator;

//     public FlashcardSetController(IMediator mediator)
//     {
//         _mediator = mediator;
//     }

//     /// <summary>
//     /// API Tạo mới một bộ Flashcard thủ công
//     /// </summary>
//     [HttpPost]
//     public async Task<ActionResult<int>> Create(CreateFlashcardSetCommand command)
//     {
//         // Trích xuất UserId từ các Claims trong JWT Token của người dùng đang đăng nhập
//         var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

//         if (string.IsNullOrEmpty(userId))
//             return Unauthorized("Không tìm thấy thông tin người dùng trong Token.");

//         // Gán UserId vào command trước khi gửi xuống Application Layer
//         command.UserId = Guid.Parse(userId);

//         // Gửi command cho MediatR xử lý và nhận về Id của bộ thẻ vừa tạo
//         var id = await _mediator.Send(command);

//         return Ok(id);
//     }

//     /// <summary>
//     /// API Lấy toàn bộ danh sách bộ thẻ mà người dùng hiện tại đã tạo
//     /// </summary>
//     [HttpGet]
//     public async Task<ActionResult<List<FlashcardSetDto>>> GetMySets()
//     {
//         var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);

//         if (string.IsNullOrEmpty(userIdStr))
//             return Unauthorized();

//         var userId = Guid.Parse(userIdStr);

//         // Gửi Query để lấy danh sách rút gọn các bộ thẻ
//         var result = await _mediator.Send(new GetMyFlashcardSetsQuery(userId));

//         return Ok(result);
//     }

//     /// <summary>
//     /// API Lấy chi tiết 1 bộ thẻ bao gồm danh sách tất cả các Flashcard bên trong
//     /// Dùng cho giao diện Học Flashcard
//     /// </summary>
//     [HttpGet("{id}")]
//     public async Task<ActionResult<FlashcardSetDetailDto>> GetById(int id)
//     {
//         // Gửi Query lấy chi tiết kèm các Card con (sử dụng .Include trong Handler)
//         var result = await _mediator.Send(new GetFlashcardSetByIdQuery(id));

//         if (result == null)
//             return NotFound("Bộ flashcard không tồn tại.");

//         return Ok(result);
//     }
// }

// [Authorize] // 1. Tạm thời comment dòng này lại
[ApiController]
[Route("api/[controller]")]
public class FlashcardSetController : ControllerBase
{
    private readonly IMediator _mediator;
    public FlashcardSetController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<ActionResult<int>> Create(CreateFlashcardSetCommand command)
    {
        // 2. Thay vì lấy từ Token, hãy dùng một Guid cố định để test
        // Bạn nên lấy 1 ID có thật trong bảng AspNetUsers của bạn để tránh lỗi Foreign Key
        command.UserId = Guid.Parse("74de6223-0458-46a8-9d9a-08de57fd3312");

        // Hoặc nếu bạn đã chạy Seed dữ liệu, hãy lấy ID của User Admin/Test dán vào đây

        var id = await _mediator.Send(command);
        return Ok(id);
    }

    // 2. API LẤY DANH SÁCH BỘ THẺ (Dùng cho trang Library)
    [HttpGet]
    public async Task<ActionResult<List<FlashcardSetDto>>> GetMySets()
    {
        // Tương tự cho hàm lấy danh sách
        var mockUserId = Guid.Parse("74de6223-0458-46a8-9d9a-08de57fd3312"); // Thay bằng một Guid có thật trong DB của bạn
        return await _mediator.Send(new GetMyFlashcardSetsQuery(mockUserId));
    }

    // 3. API LẤY CHI TIẾT 1 BỘ THẺ (Dùng cho trang Học Flashcard)
    [HttpGet("{id}")] // Cấu hình route để nhận ID từ URL (vd: /api/FlashcardSet/1)
    public async Task<ActionResult<FlashcardSetDetailDto>> GetById(int id)
    {
        // Gửi Query để lấy bộ thẻ kèm danh sách các card bên trong
        var result = await _mediator.Send(new GetFlashcardSetByIdQuery(id));

        if (result == null)
        {
            return NotFound($"Không tìm thấy bộ thẻ có ID = {id}");
        }

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<bool>> Delete(int id)
    {
        var result = await _mediator.Send(new DeleteFlashcardSetCommand(id));
        if (!result) return NotFound();
        return Ok(result);
    }

}