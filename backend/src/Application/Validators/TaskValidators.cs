using Application.DTOs;
using FluentValidation;

namespace Application.Validators;

public class TaskCreateValidator : AbstractValidator<TaskCreateDto>
{
    public TaskCreateValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MinimumLength(3).WithMessage("Título deve ter ao menos 3 caracteres.");
    }
}

public class TaskUpdateValidator : AbstractValidator<TaskUpdateDto>
{
    public TaskUpdateValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MinimumLength(3).WithMessage("Título deve ter ao menos 3 caracteres.");
    }
}