using Domain.Entities;

namespace Domain.Interfaces;

public interface ILeadRepository
{
    Task<(IEnumerable<Lead> Items, int Total)> GetAllAsync(string? search, LeadStatus? status, int page, int pageSize);
    Task<Lead?> GetByIdAsync(int id, bool includeTasks = false);
    Task<Lead> AddAsync(Lead lead);
    void Update(Lead lead);
    void Remove(Lead lead);
    Task<int> SaveChangesAsync();
}