namespace Domain.Entities;

public class Lead
{
    public int Id { get; private set; }
    public string Name { get; private set; } = null!;
    public string Email { get; private set; } = null!;
    public LeadStatus Status { get; private set; } = LeadStatus.New;
    public bool IsDeleted { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;

    private readonly List<TaskItem> _tasks = [];
    public IReadOnlyCollection<TaskItem> Tasks => _tasks.AsReadOnly();

    protected Lead() { }

    public static Lead Create(string name, string email, LeadStatus status = LeadStatus.New)
        => new() { Name = name, Email = email, Status = status };

    public void Update(string name, string email, LeadStatus status)
    {
        Name = name; Email = email; Status = status;
        UpdatedAt = DateTime.UtcNow;
    }

    public void SoftDelete() { IsDeleted = true; UpdatedAt = DateTime.UtcNow; }
}

public enum LeadStatus { New = 0, Qualified = 1, Won = 2, Lost = 3 }