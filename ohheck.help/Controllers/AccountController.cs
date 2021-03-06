﻿using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication;
using ohheck.help.Models;
using ohheck.help.Models.AccountViewModels;
using ohheck.help.Services;

namespace ohheck.help.Controllers {
    [Authorize]
    public class AccountController : Controller {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IEmailSender _emailSender;
        private readonly ISmsSender _smsSender;
        private readonly ILogger _logger;
        private readonly PasswordHasher<ApplicationUser> _passwordHasher;
        private readonly Secrets _secrets;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IEmailSender emailSender,
            ISmsSender smsSender,
            ILoggerFactory loggerFactory,
            PasswordHasher<ApplicationUser> passwordHasher,
            IOptions<Secrets> secrets) {
            _userManager = userManager;
            _signInManager = signInManager;
            _emailSender = emailSender;
            _smsSender = smsSender;
            _logger = loggerFactory.CreateLogger<AccountController>();
            _passwordHasher = passwordHasher;
            _secrets = secrets.Value;
        }

        //
        // GET: /Account/Login
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Login(string returnUrl = null) {
            // Clear the existing external cookie to ensure a clean login process
            await HttpContext.SignOutAsync();

            ViewData["ReturnUrl"] = returnUrl;

            return View();
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model) {
            if (ModelState.IsValid) {
                // This doesn't count login failures towards account lockout
                // To enable password failures to trigger account lockout, set lockoutOnFailure: true
                var result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberMe, lockoutOnFailure: false);

                if (result.Succeeded) {
                    _logger.LogInformation(1, "User logged in.");

                    return Json(new { success = true });
                }

                if (result.IsLockedOut) {
                    _logger.LogWarning(2, "User account locked out.");

                    return Json(new { success = false, message = "User account locked out" });
                } else {
                    ModelState.AddModelError(string.Empty, "Invalid login attempt.");

                    return Json(new { success = false, message = "Incorrect password" });
                }
            }

            // If we got this far, something failed, redisplay form
            return Json(new { success = false, message = "Something big went wrong." });
        }

        //
        // GET: /Account/Register
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Register(string returnUrl = null) {
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model, string returnUrl = null) {
            ViewData["ReturnUrl"] = returnUrl;

            if (ModelState.IsValid) {
                if (model.Secret != "yes, allow me in") {
                    return View();
                }

                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                var result = await _userManager.CreateAsync(user, model.Password);

                if (result.Succeeded) {
                    // For more information on how to enable account confirmation and password reset please visit http://go.microsoft.com/fwlink/?LinkID=532713
                    // Send an email with this link
                    //var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                    //var callbackUrl = Url.Action(nameof(ConfirmEmail), "Account", new { userId = user.Id, code = code }, protocol: HttpContext.Request.Scheme);
                    //await _emailSender.SendEmailAsync(model.Email, "Confirm your account",
                    //    $"Please confirm your account by clicking this link: <a href='{callbackUrl}'>link</a>");
                    await _signInManager.SignInAsync(user, isPersistent: false);

                    _logger.LogInformation(3, "User created a new account with password.");

                    return RedirectToLocal(returnUrl);
                }

                AddErrors(result);
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        /*[AllowAnonymous]
        public async Task<IActionResult> Make(string u, string email, string password) {
            var user = new ApplicationUser { UserName = u, Email = email };
            var result = await _userManager.CreateAsync(user, password);

            return Json(result.Succeeded);
        }*/

        //
        // POST: /Account/Logout
        public async Task<IActionResult> Logout() {
            await _signInManager.SignOutAsync();
            _logger.LogInformation(4, "User logged out.");
            return RedirectToAction(nameof(HomeController.Index), "Home");
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Connect([FromBody] LoginViewModel model) {
            if (!ModelState.IsValid) {
                return BadRequest();
            }

            var user = await _userManager.FindByNameAsync(model.Username);

            if (user == null || _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, model.Password) != PasswordVerificationResult.Success) {
                return BadRequest();
            }

            var token = await GetJwtSecurityToken(user);

            return Ok(new {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo
            });
        }

        private async Task<JwtSecurityToken> GetJwtSecurityToken(ApplicationUser user) {
            _logger.LogInformation($"Secret key: {_secrets.secretkey}");
            var signingkey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_secrets.secretkey));
            var userClaims = await _userManager.GetClaimsAsync(user);

            return new JwtSecurityToken(
                audience: "http://localhost:5000",
                issuer: "http://localhost:5000",
                claims: GetTokenClaims(user).Union(userClaims),
                expires: DateTime.UtcNow.AddDays(1),
                signingCredentials: new SigningCredentials(signingkey, SecurityAlgorithms.HmacSha256)
            );
        }

        private IEnumerable<Claim> GetTokenClaims(ApplicationUser user) =>
            new List<Claim> {
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName)
            };


        private void AddErrors(IdentityResult result) {
            foreach (var error in result.Errors) {
                ModelState.AddModelError(string.Empty, error.Description);
            }
        }

        private IActionResult RedirectToLocal(string returnUrl) {
            if (Url.IsLocalUrl(returnUrl)) {
                return Redirect(returnUrl);
            } else {
                return RedirectToAction(nameof(HomeController.Index), "Home");
            }
        }
    }
}