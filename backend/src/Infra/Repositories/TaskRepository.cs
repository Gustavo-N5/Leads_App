using Domain.Entities;
using Domain.Interfaces;
using Infra.Data;
using Microsoft.EntityFrameworkCore;

namespace Infra.Repositories;

public class TaskRepository(AppDbContext db) : ITaskRepository
{
    public Task<IEnumerable<TaskItem>> GetByLeadIdAsync(int leadId)
        => db.Tasks.Where(x => x.LeadId == leadId).AsNoTracking()
               .OrderBy(x => x.CreatedAt).ToListAsync()
               .ContinueWith(t => t.Result.AsEnumerable());

    public Task<TaskItem?> GetByIdAsync(int leadId, int taskId)
        => db.Tasks.FirstOrDefaultAsync(x => x.LeadId == leadId && x.Id == taskId);

    public async Task<TaskItem> AddAsync(TaskItem task) { db.Tasks.Add(task); return task; }
    public void Update(TaskItem task) => db.Tasks.Update(task);
    public void Remove(TaskItem task) => task.SoftDelete();
    public Task<int> SaveChangesAsync() => db.SaveChangesAsync();
}