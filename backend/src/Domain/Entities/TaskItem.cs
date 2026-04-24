namespace Domain.Entities;

public class TaskItem
{
    public int Id { get; private set; }
    public int LeadId { get; private set; }
    public string Title { get; private set; } = null!;
    public DateTime? DueDate { get; private set; }
    public TaskItemStatus Status { get; private set; } = TaskItemStatus.Todo;
    public bool IsDeleted { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;
    public Lead? Lead { get; private set; }

    protected TaskItem() { }

    public static TaskItem Create(int leadId, string title, DateTime? dueDate, TaskItemStatus status = TaskItemStatus.Todo)
        => new() { LeadId = leadId, Title = title, DueDate = dueDate, Status = status };

    public void Update(string title, DateTime? dueDate, TaskItemStatus status)
    {
        Title = title; DueDate = dueDate; Status = status;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SoftDelete() { IsDeleted = true; UpdatedAt = DateTime.UtcNow; }
}

public enum TaskItemStatus { Todo = 0, Doing = 1, Done = 2 }