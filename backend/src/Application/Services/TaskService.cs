using Application.DTOs;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.Services;

public class TaskService(ITaskRepository repo, ILeadRepository leadRepo)
{
    public async Task<IEnumerable<TaskDto>> GetByLeadAsync(int leadId)
        => (await repo.GetByLeadIdAsync(leadId)).Select(Map);

    public async Task<TaskDto?> CreateAsync(int leadId, TaskCreateDto dto)
    {
        var lead = await leadRepo.GetByIdAsync(leadId);
        if (lead is null) return null;
        var task = TaskItem.Create(leadId, dto.Title, dto.DueDate, dto.Status ?? TaskItemStatus.Todo);
        await repo.AddAsync(task);
        await repo.SaveChangesAsync();
        return Map(task);
    }

    public async Task<TaskDto?> UpdateAsync(int leadId, int taskId, TaskUpdateDto dto)
    {
        var task = await repo.GetByIdAsync(leadId, taskId);
        if (task is null) return null;
        task.Update(dto.Title, dto.DueDate, dto.Status);
        await repo.SaveChangesAsync();
        return Map(task);
    }

    public async Task<bool> DeleteAsync(int leadId, int taskId)
    {
        var task = await repo.GetByIdAsync(leadId, taskId);
        if (task is null) return false;
        repo.Remove(task);
        await repo.SaveChangesAsync();
        return true;
    }

    private static TaskDto Map(TaskItem t) =>
        new(t.Id, t.LeadId, t.Title, t.DueDate, t.Status, t.CreatedAt, t.UpdatedAt);
}