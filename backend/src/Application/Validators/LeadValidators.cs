using Application.DTOs;
using FluentValidation;

namespace Application.Validators;

public class LeadCreateValidator : AbstractValidator<LeadCreateDto>
{
    public LeadCreateValidator()
    {
        RuleFor(x => x.Name).MinimumLength(3).WithMessage("Nome deve ter ao menos 3 caracteres.");
        RuleFor(x => x.Email).EmailAddress().WithMessage("E-mail inválido.");
    }
}

public class LeadUpdateValidator : AbstractValidator<LeadUpdateDto>
{
    public LeadUpdateValidator()
    {
        RuleFor(x => x.Name).MinimumLength(3).WithMessage("Nome deve ter ao menos 3 caracteres.");
        RuleFor(x => x.Email).EmailAddress().WithMessage("E-mail inválido.");
    }
}