using Application.DTOs;
using Application.Services;
using Domain.Entities;
using Domain.Interfaces;
using FluentAssertions;
using Moq;

namespace LeadsApp.Tests.Services;

public class LeadServiceTests
{
    private readonly Mock<ILeadRepository> _repoMock = new();
    private readonly LeadService _sut;

    public LeadServiceTests() => _sut = new LeadService(_repoMock.Object);

    [Fact]
    public async Task CreateAsync_ShouldReturnLeadDto_WhenValidInput()
    {
        var dto = new LeadCreateDto("John Doe", "john@email.com", LeadStatus.New);
        _repoMock.Setup(r => r.AddAsync(It.IsAny<Lead>()))
                 .ReturnsAsync((Lead l) => l);
        _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

        var result = await _sut.CreateAsync(dto);

        result.Should().NotBeNull();
        result.Name.Should().Be("John Doe");
        result.Email.Should().Be("john@email.com");
        result.Status.Should().Be(LeadStatus.New);
        _repoMock.Verify(r => r.AddAsync(It.IsAny<Lead>()), Times.Once);
        _repoMock.Verify(r => r.SaveChangesAsync(), Times.Once);
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnNull_WhenLeadNotFound()
    {
        _repoMock.Setup(r => r.GetByIdAsync(99, true)).ReturnsAsync((Lead?)null);

        var result = await _sut.GetByIdAsync(99);

        result.Should().BeNull();
    }

    [Fact]
    public async Task GetByIdAsync_ShouldReturnLeadDto_WhenFound()
    {
        var lead = Lead.Create("Jane", "jane@email.com", LeadStatus.Qualified);
        _repoMock.Setup(r => r.GetByIdAsync(1, true)).ReturnsAsync(lead);

        var result = await _sut.GetByIdAsync(1);

        result.Should().NotBeNull();
        result!.Name.Should().Be("Jane");
        result.Status.Should().Be(LeadStatus.Qualified);
    }

    [Fact]
    public async Task UpdateAsync_ShouldReturnNull_WhenLeadNotFound()
    {
        _repoMock.Setup(r => r.GetByIdAsync(99, false)).ReturnsAsync((Lead?)null);

        var result = await _sut.UpdateAsync(99, new LeadUpdateDto("X", "x@x.com", LeadStatus.Won));

        result.Should().BeNull();
    }

    [Fact]
    public async Task UpdateAsync_ShouldUpdateAndReturn_WhenFound()
    {
        var lead = Lead.Create("Old", "old@email.com");
        _repoMock.Setup(r => r.GetByIdAsync(1, false)).ReturnsAsync(lead);
        _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

        var result = await _sut.UpdateAsync(1, new LeadUpdateDto("New", "new@email.com", LeadStatus.Won));

        result.Should().NotBeNull();
        result!.Name.Should().Be("New");
        result.Status.Should().Be(LeadStatus.Won);
    }

    [Fact]
    public async Task DeleteAsync_ShouldReturnFalse_WhenNotFound()
    {
        _repoMock.Setup(r => r.GetByIdAsync(99, false)).ReturnsAsync((Lead?)null);

        var result = await _sut.DeleteAsync(99);

        result.Should().BeFalse();
    }

    [Fact]
    public async Task DeleteAsync_ShouldReturnTrue_WhenFound()
    {
        var lead = Lead.Create("Test", "test@email.com");
        _repoMock.Setup(r => r.GetByIdAsync(1, false)).ReturnsAsync(lead);
        _repoMock.Setup(r => r.SaveChangesAsync()).ReturnsAsync(1);

        var result = await _sut.DeleteAsync(1);

        result.Should().BeTrue();
        _repoMock.Verify(r => r.Remove(lead), Times.Once);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnPagedResult()
    {
        var leads = new List<Lead> { Lead.Create("A", "a@a.com"), Lead.Create("B", "b@b.com") };
        _repoMock.Setup(r => r.GetAllAsync(null, null, 1, 10)).ReturnsAsync((leads, 2));

        var result = await _sut.GetAllAsync(null, null, 1, 10);

        result.Total.Should().Be(2);
        result.Items.Should().HaveCount(2);
    }
}