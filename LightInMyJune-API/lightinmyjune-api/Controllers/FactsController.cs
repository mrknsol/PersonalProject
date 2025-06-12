using lightinmyjune_api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;


namespace lightinmyjune_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FactsController : ControllerBase
    {
        private readonly IFactService _factService;

        public FactsController(IFactService factService)
        {
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
                return StatusCode(500, $"Ошибка при получении факта: {ex.Message}");
            }
        }
    }
}