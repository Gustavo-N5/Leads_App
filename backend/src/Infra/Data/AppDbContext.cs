using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infra.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Lead> Leads => Set<Lead>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.Entity<Lead>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(150).IsRequired();
            e.Property(x => x.Email).HasMaxLength(200).IsRequired();
            e.Property(x => x.Status).HasConversion<int>();
            e.HasQueryFilter(x => !x.IsDeleted);
            e.HasMany(x => x.Tasks).WithOne(x => x.Lead).HasForeignKey(x => x.LeadId);
        });

        mb.Entity<TaskItem>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(250).IsRequired();
            e.Property(x => x.Status).HasConversion<int>();
            e.HasQueryFilter(x => !x.IsDeleted);
        });
    }
}