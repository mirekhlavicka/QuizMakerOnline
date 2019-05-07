using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.Cookies;
using QuizMakerOnline.Models;

namespace QuizMakerOnline.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly QuizMakerContext _context;

        public AuthController(QuizMakerContext context)
        {
            _context = context;
        }

        public class loginRequest
        {
            public string userName;
            public string password;
            public bool rememberMe;
        }

        [HttpPost]
        //[Route("login")]
        public async Task<IActionResult> Login([FromBody] loginRequest lr)
        {
            var user = _context.Users.SingleOrDefault(u => u.LoginName == lr.userName);

            if (String.IsNullOrEmpty(lr.userName) || String.IsNullOrEmpty(lr.password) || user == null || user.Password != lr.password)
            {
                return BadRequest();
            }

            var claimsIdentity = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, lr.userName),
                new Claim(ClaimTypes.NameIdentifier, user.IdUser.ToString()),
                new Claim("FullName", user.FullName),
                new Claim(ClaimTypes.Role, "Administrator")
            }, "Cookies");

            var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);
            await Request.HttpContext.SignInAsync("Cookies", claimsPrincipal, new AuthenticationProperties { IsPersistent = lr.rememberMe });

            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await Request.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return NoContent();
        }

        [HttpGet]
        public ActionResult<bool> IsAuthenticated()
        {
            return Request.HttpContext.User.Identity.IsAuthenticated;
        }

        [HttpGet]
        public ActionResult<string> FullName()
        {

            return Request.HttpContext.User.Identity.IsAuthenticated ? Request.HttpContext.User.FindFirst("FullName").Value : "anonymous";
        }
    }
}