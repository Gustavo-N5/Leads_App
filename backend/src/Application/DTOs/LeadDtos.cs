using Domain.Entities;

namespace Application.DTOs;

public record LeadCreateDto(string Name, string Email, LeadStatus? Status);
public record LeadUpdateDto(string Name, string Email, LeadStatus Status);
public record LeadDto(int Id, string Name, string Email, LeadStatus Status, DateTime CreatedAt, DateTime UpdatedAt, int TasksCount);
public record PagedResult<T>(IEnumerable<T> Items, int Total, int Page, int PageSize);