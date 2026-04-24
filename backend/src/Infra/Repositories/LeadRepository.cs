using Domain.Entities;
using Domain.Interfaces;
using Infra.Data;
using Microsoft.EntityFrameworkCore;

namespace Infra.Repositories;

public class LeadRepository(AppDbContext db) : ILeadRepository
{
    public async Task<(IEnumerable<Lead> Items, int Total)> GetAllAsync(string? search, LeadStatus? status, int page, int pageSize)
    {
        var q = db.Leads.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(x => x.Name.Contains(search) || x.Email.Contains(search));

        if (status.HasValue)
            q = q.Where(x => x.Status == status);

        var total = await q.CountAsync();
        var items = await q
            .Include(x => x.Tasks)
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, total);
    }

    public Task<Lead?> GetByIdAsync(int id, bool includeTasks = false)
    {
        var q = db.Leads.AsQueryable();
        if (includeTasks) q = q.Include(x => x.Tasks);
        return q.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Lead> AddAsync(Lead lead) { db.Leads.Add(lead); return lead; }
    public void Update(Lead lead) => db.Leads.Update(lead);
    public void Remove(Lead lead) => lead.SoftDelete();
    public Task<int> SaveChangesAsync() => db.SaveChangesAsync();
}