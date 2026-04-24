using Application.DTOs;
using Application.Services;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/leads/{leadId:int}/tasks")]
[Produces("application/json")]
public class TasksController(TaskService service, IValidator<TaskCreateDto> createValidator, IValidator<TaskUpdateDto> updateValidator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll(int leadId)
        => Ok(await service.GetByLeadAsync(leadId));

    [HttpPost]
    public async Task<IActionResult> Create(int leadId, [FromBody] TaskCreateDto dto)
    {
        var validation = await createValidator.ValidateAsync(dto);
        if (!validation.IsValid) return BadRequest(validation.Errors.Select(e => e.ErrorMessage));
        var result = await service.CreateAsync(leadId, dto);
        return result is null ? NotFound("Lead não encontrado.") : Created(string.Empty, result);
    }

    [HttpPut("{taskId:int}")]
    public async Task<IActionResult> Update(int leadId, int taskId, [FromBody] TaskUpdateDto dto)
    {
        var validation = await updateValidator.ValidateAsync(dto);
        if (!validation.IsValid) return BadRequest(validation.Errors.Select(e => e.ErrorMessage));
        var result = await service.UpdateAsync(leadId, taskId, dto);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpDelete("{taskId:int}")]
    public async Task<IActionResult> Delete(int leadId, int taskId)
    {
        var deleted = await service.DeleteAsync(leadId, taskId);
        return deleted ? NoContent() : NotFound();
    }
}