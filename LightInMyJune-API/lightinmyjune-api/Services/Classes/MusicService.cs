using System.Net.Http;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using lightinmyjune_api.Services.Interfaces;
using lightinmyjune_api.Models; 
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Text;
using System.Linq;

namespace lightinmyjune_api.Services.Classes
{
    public class MusicService : IMusicService
    {
        private readonly HttpClient _httpClient;
        private readonly string _lastFmApiKey;
        private readonly HttpClient _spotifyClient;

        public MusicService(HttpClient httpClient, HttpClient spotifyClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _spotifyClient = spotifyClient;
            _lastFmApiKey = configuration["LastFm:ApiKey"];
        }

        // Получение токена Spotify
        public async Task<string> GetSpotifyAccessTokenAsync()
        {
            var clientId = "5050f4b1bc30494d8303ba323eceb67d";
            var clientSecret = "8050cb1626614833a2c9ba58716bf875";

            var authToken = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));

            var request = new HttpRequestMessage(HttpMethod.Post, "https://accounts.spotify.com/api/token");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", authToken);
            request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                { "grant_type", "client_credentials" }
            });

            var response = await _httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var json = JsonDocument.Parse(await response.Content.ReadAsStreamAsync());
            var token = json.RootElement.GetProperty("access_token").GetString();

            return token;
        }

        public async Task<List<Song>> GetTrackUrlsByMoodAsync(string mood)
        {
            var spotifyToken = await GetSpotifyAccessTokenAsync();

            var random = new Random();
            // Случайная страница от 1 до 4
            var page = random.Next(1, 5);

            var url = $"https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag={Uri.EscapeDataString(mood)}&api_key={_lastFmApiKey}&format=json&limit=10&page={page}";

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            using var stream = await response.Content.ReadAsStreamAsync();
            var json = await JsonDocument.ParseAsync(stream);

            var result = new List<Song>();

            if (json.RootElement.TryGetProperty("tracks", out var tracks) &&
                tracks.TryGetProperty("track", out var trackList))
            {
                foreach (var track in trackList.EnumerateArray())
                {
                    var name = track.GetProperty("name").GetString();
                    var artist = track.GetProperty("artist").GetProperty("name").GetString();

                    var spotifyUrl = await SearchSpotifyTrackUrlAsync(name, artist, spotifyToken);

                    result.Add(new Song
                    {
                        Artist = artist,
                        Name = name,
                        Url = spotifyUrl ?? track.GetProperty("url").GetString()
                    });
                }
            }

            // Перемешиваем и берем первые 5 треков (если меньше 5 — сколько есть)
            var shuffled = result.OrderBy(x => random.Next()).Take(5).ToList();

            return shuffled;
        }

        public async Task<string> SearchSpotifyTrackUrlAsync(string trackName, string artistName, string accessToken)
        {
            var query = Uri.EscapeDataString($"track:{trackName} artist:{artistName}");
            var request = new HttpRequestMessage(HttpMethod.Get, $"https://api.spotify.com/v1/search?q={query}&type=track&limit=1");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _spotifyClient.SendAsync(request);
            if (!response.IsSuccessStatusCode) return null;

            var json = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());

            if (json.RootElement.TryGetProperty("tracks", out var tracks) &&
                tracks.GetProperty("items").GetArrayLength() > 0)
            {
                var firstTrack = tracks.GetProperty("items")[0];
                if (firstTrack.TryGetProperty("external_urls", out var externalUrls) &&
                    externalUrls.TryGetProperty("spotify", out var spotifyLink))
                {
                    return spotifyLink.GetString();
                }
            }

            return null;
        }
    }
}