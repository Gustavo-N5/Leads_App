using Application.Services;
using Application.Validators;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<LeadService>();
        services.AddScoped<TaskService>();
        services.AddValidatorsFromAssemblyContaining<LeadCreateValidator>();
        return services;
    }
}