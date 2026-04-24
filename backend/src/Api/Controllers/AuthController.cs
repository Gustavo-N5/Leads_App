using Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(TokenService tokenService, IConfiguration config) : ControllerBase
{
    public record LoginRequest(string Username, string Password);
    public record LoginResponse(string Token, string Username, DateTime ExpiresAt);

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest req)
    {
        var validUser = config["Auth:Username"];
        var validPass = config["Auth:Password"];

        if (req.Username != validUser || req.Password != validPass)
            return Unauthorized(new { error = "Credenciais inválidas." });

        var token = tokenService.Generate(req.Username);
        return Ok(new LoginResponse(token, req.Username, DateTime.UtcNow.AddMinutes(60)));
    }
}