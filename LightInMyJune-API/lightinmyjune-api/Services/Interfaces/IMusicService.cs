using System.Collections.Generic;
using System.Threading.Tasks;
using lightinmyjune_api.Models;

namespace lightinmyjune_api.Services.Interfaces
{
    public interface IMusicService
    {
        Task<List<Song>> GetTrackUrlsByMoodAsync(string mood);
        Task<string> SearchSpotifyTrackUrlAsync(string trackName, string artistName, string accessToken);

    }
}