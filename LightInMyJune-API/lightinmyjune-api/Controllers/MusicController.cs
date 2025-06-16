using Microsoft.AspNetCore.Mvc;
using lightinmyjune_api.Models;
using lightinmyjune_api.Services.Interfaces;
using LightInMyJuneAPI.Models;

namespace lightinmyjune_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MusicController : ControllerBase
    {
        private readonly IMusicService _lastFmMoodService;

        public MusicController(IMusicService lastFmMoodService)
        {
            _lastFmMoodService = lastFmMoodService;
        }

        [HttpPost("recommend")]
        public async Task<IActionResult> Recommend([FromBody] MoodRequest request)
        {
            var result = await _lastFmMoodService.GetTrackUrlsByMoodAsync(request.Mood);
            return Ok(result);
        }
    }
}