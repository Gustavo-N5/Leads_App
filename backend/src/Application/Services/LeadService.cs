using Application.DTOs;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.Services;

public class LeadService(ILeadRepository repo)
{
    public async Task<PagedResult<LeadDto>> GetAllAsync(string? search, LeadStatus? status, int page, int pageSize)
    {
        var (items, total) = await repo.GetAllAsync(search, status, page, pageSize);
        var dtos = items.Select(Map);
        return new PagedResult<LeadDto>(dtos, total, page, pageSize);
    }

    public async Task<LeadDto?> GetByIdAsync(int id)
    {
        var lead = await repo.GetByIdAsync(id, includeTasks: true);
        return lead is null ? null : Map(lead);
    }

    public async Task<LeadDto> CreateAsync(LeadCreateDto dto)
    {
        var lead = Lead.Create(dto.Name, dto.Email, dto.Status ?? LeadStatus.New);
        await repo.AddAsync(lead);
        await repo.SaveChangesAsync();
        return Map(lead);
    }

    public async Task<LeadDto?> UpdateAsync(int id, LeadUpdateDto dto)
    {
        var lead = await repo.GetByIdAsync(id);
        if (lead is null) return null;
        lead.Update(dto.Name, dto.Email, dto.Status);
        await repo.SaveChangesAsync();
        return Map(lead);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var lead = await repo.GetByIdAsync(id);
        if (lead is null) return false;
        repo.Remove(lead);
        await repo.SaveChangesAsync();
        return true;
    }

    private static LeadDto Map(Lead l) =>
        new(l.Id, l.Name, l.Email, l.Status, l.CreatedAt, l.UpdatedAt, l.Tasks.Count(t => !t.IsDeleted));
}