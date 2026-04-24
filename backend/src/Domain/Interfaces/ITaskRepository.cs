using Domain.Entities;

namespace Domain.Interfaces;

public interface ITaskRepository
{
    Task<IEnumerable<TaskItem>> GetByLeadIdAsync(int leadId);
    Task<TaskItem?> GetByIdAsync(int leadId, int taskId);
    Task<TaskItem> AddAsync(TaskItem task);
    void Update(TaskItem task);
    void Remove(TaskItem task);
    Task<int> SaveChangesAsync();
}