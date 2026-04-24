using Application;
using Infra;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfra(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();
builder.Services.AddCors(opt =>
    opt.AddPolicy("dev", p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("dev");
app.MapControllers();

using var scope = app.Services.CreateScope();
var db = scope.ServiceProvider.GetRequiredService<Infra.Data.AppDbContext>();
await db.Database.MigrateAsync();

app.Run();