using lightinmyjune_api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;


namespace lightinmyjune_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FactsController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;

        private readonly IFactService _factService;

        public FactsController(IFactService factService, IWebHostEnvironment env)
        {
            _env = env;
            _factService = factService;

        }

        [HttpGet("GetFact")]
        public async Task<IActionResult> Get()
        {
            try
            {
                var fact = await _factService.GetRandomFactAsync();
                return Ok(fact);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error while getting random fact from server with error message: {ex.Message}");
            }
        }
        [HttpGet("CheckFactFile")]
        public IActionResult CheckFactFile()
        {
            var filePath = Path.Combine(_env.ContentRootPath, "Data", "facts.json");
            return System.IO.File.Exists(filePath)
                ? Ok($"Файл найден: {filePath}")
                : NotFound($"Файл не найден: {filePath}");
        }
    }
}