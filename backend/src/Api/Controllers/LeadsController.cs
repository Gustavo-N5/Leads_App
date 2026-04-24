using Application.DTOs;
using Application.Services;
using Domain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/leads")]
[Produces("application/json")]
public class LeadsController(LeadService service, IValidator<LeadCreateDto> createValidator, IValidator<LeadUpdateDto> updateValidator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] LeadStatus? status, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        => Ok(await service.GetAllAsync(search, status, page, pageSize));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var lead = await service.GetByIdAsync(id);
        return lead is null ? NotFound() : Ok(lead);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] LeadCreateDto dto)
    {
        var validation = await createValidator.ValidateAsync(dto);
        if (!validation.IsValid) return BadRequest(validation.Errors.Select(e => e.ErrorMessage));
        var result = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] LeadUpdateDto dto)
    {
        var validation = await updateValidator.ValidateAsync(dto);
        if (!validation.IsValid) return BadRequest(validation.Errors.Select(e => e.ErrorMessage));
        var result = await service.UpdateAsync(id, dto);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await service.DeleteAsync(id);
        return deleted ? NoContent() : NotFound();
    }
}