using lightinmyjune_api.Models;
using lightinmyjune_api.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace lightinmyjune_api.Controllers;
[ApiController]
[Route("api/[controller]")]
public class MusicController : ControllerBase
{
    private readonly IMusicService _musicService;

    public MusicController(IMusicService musicService)
    {
        _musicService = musicService;
    }

    [HttpPost("recommend")]
    public async Task<IActionResult> GetMusicByMood([FromBody] MoodRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.mood))
            return BadRequest("Mood is required.");

        var tracks = await _musicService.GetTracksByMoodAsync(request.mood);

        return Ok(tracks);
    }
}