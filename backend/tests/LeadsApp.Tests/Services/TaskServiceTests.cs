using Application.DTOs;
using Application.Services;
using Domain.Entities;
using Domain.Interfaces;
using FluentAssertions;
using Moq;

namespace LeadsApp.Tests.Services;

public class TaskServiceTests
{
    private readonly Mock<ITaskRepository> _taskRepoMock = new();
    private readonly Mock<ILeadRepository> _leadRepoMock = new();
    private readonly TaskService _sut;

    public TaskServiceTests() => _sut = new TaskService(_taskRepoMock.Object, _leadRepoMock.Object);

    [Fact]
    public async Task CreateAsync_ShouldReturnNull_WhenLeadNotFound()
    {
        _leadRepoMock.Setup(r => r.GetByIdAsync(99, false)).ReturnsAsync((Lead?)null);

        var result = await _sut.CreateAsync(99, new TaskCreateDto("Title", null, null));

        result.Should().BeNull();
    }

    [Fact]
    public async Task CreateAsync_ShouldReturnTaskDto_WhenLeadExists()
    {
        var lead = Lead.Create("Lead", "lead@email.com");
        _leadRepoMock.Setup(r => r.GetByIdAsync(1, false)).ReturnsAsync(lead);
        _taskRepoMock.Setup(r => r.AddAsync(It.IsAny<TaskItem>()))
                     .ReturnsAsync((TaskItem t) => t);
        _taskRepoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

        var result = await _sut.CreateAsync(1, new TaskCreateDto("My Task", null, TaskItemStatus.Todo));

        result.Should().NotBeNull();
        result!.Title.Should().Be("My Task");
        result.Status.Should().Be(TaskItemStatus.Todo);
    }

    [Fact]
    public async Task UpdateAsync_ShouldReturnNull_WhenTaskNotFound()
    {
        _taskRepoMock.Setup(r => r.GetByIdAsync(1, 99)).ReturnsAsync((TaskItem?)null);

        var result = await _sut.UpdateAsync(1, 99, new TaskUpdateDto("X", null, TaskItemStatus.Done));

        result.Should().BeNull();
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdate_WhenFound()
    {
        var task = TaskItem.Create(1, "Old Title", null);
        _taskRepoMock.Setup(r => r.GetByIdAsync(1, 1)).ReturnsAsync(task);
        _taskRepoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

        var result = await _sut.UpdateAsync(1, 1, new TaskUpdateDto("New Title", null, TaskItemStatus.Done));

        result.Should().NotBeNull();
        result!.Title.Should().Be("New Title");
        result.Status.Should().Be(TaskItemStatus.Done);
    }

    [Fact]
    public async Task DeleteAsync_ShouldReturnTrue_WhenFound()
    {
        var task = TaskItem.Create(1, "Task", null);
        _taskRepoMock.Setup(r => r.GetByIdAsync(1, 1)).ReturnsAsync(task);
        _taskRepoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

        var result = await _sut.DeleteAsync(1, 1);

        result.Should().BeTrue();
    }

    [Fact]
    public async Task GetByLeadAsync_ShouldReturnMappedDtos()
    {
        var tasks = new List<TaskItem>
        {
            TaskItem.Create(1, "T1", null),
            TaskItem.Create(1, "T2", DateTime.UtcNow.AddDays(1))
        };
        _taskRepoMock.Setup(r => r.GetByLeadIdAsync(1)).ReturnsAsync(tasks);

        var result = await _sut.GetByLeadAsync(1);

        result.Should().HaveCount(2);
    }
}