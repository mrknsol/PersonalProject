using lightinmyjune_api.Models;

namespace lightinmyjune_api.Services.Interfaces
{
    public interface IMusicService
    {
        public Task AuthenticateAsync();
        public Task<List<TrackDto>> GetTracksByAudioFeatures(string mood);
        public Task<List<TrackDto>> GetTracksFromMoodPlaylists(string mood);
        public Task<List<TrackDto>> GetTracksByMoodAsync(string mood);
    }
}