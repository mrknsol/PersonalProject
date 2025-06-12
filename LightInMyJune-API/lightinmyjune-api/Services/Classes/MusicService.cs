using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using System;
using lightinmyjune_api.Models;
using lightinmyjune_api.Services.Interfaces;

namespace lightinmyjune_api.Services.Classes
{
    public class MusicService : IMusicService
    {
        private readonly HttpClient _httpClient;
        private readonly string _clientId;
        private readonly string _clientSecret;
        private string _accessToken;

        // Соответствие настроений аудио-характеристикам
        private readonly Dictionary<string, (string seed, float valence, float energy)> _moodSettings = new()
        {
            {"happy", ("", 0.8f, 0.8f)},
            {"sad", ("", 0.2f, 0.3f)},
            {"relaxed", ("", 0.6f, 0.3f)},
            {"energetic", ("", 0.7f, 0.9f)},
            {"romantic", ("romantic", 0.7f, 0.4f)},
            {"nostalgic", ("nostalgic", 0.5f, 0.5f)},
            {"focus", ("focus", 0.5f, 0.6f)},
            {"party", ("party", 0.8f, 0.9f)}
        };

        public MusicService(HttpClient httpClient, string clientId, string clientSecret)
        {
            _httpClient = httpClient;
            _clientId = clientId;
            _clientSecret = clientSecret;
        }

        public async Task AuthenticateAsync()
        {
            var tokenRequest = new HttpRequestMessage(HttpMethod.Post, "https://accounts.spotify.com/api/token");
            var authHeader = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{_clientId}:{_clientSecret}"));
            tokenRequest.Headers.Authorization = new AuthenticationHeaderValue("Basic", authHeader);
            tokenRequest.Content = new FormUrlEncodedContent(new Dictionary<string, string> { { "grant_type", "client_credentials" } });

            var response = await _httpClient.SendAsync(tokenRequest);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);
            _accessToken = doc.RootElement.GetProperty("access_token").GetString();

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);
        }

        public async Task<List<TrackDto>> GetTracksByMoodAsync(string mood)
        {
            if (string.IsNullOrWhiteSpace(_accessToken))
                await AuthenticateAsync();

            // Нормализация настроения
            var normalizedMood = mood.ToLower().Trim();
            
            // Стратегия 1: Поиск по аудио-характеристикам
            if (_moodSettings.ContainsKey(normalizedMood))
            {
                return await GetTracksByAudioFeatures(normalizedMood);
            }
            
            // Стратегия 2: Поиск по плейлистам (резервный метод)
            return await GetTracksFromMoodPlaylists(normalizedMood);
        }

        public async Task<List<TrackDto>> GetTracksByAudioFeatures(string mood)
        {
            var (seedGenre, targetValence, targetEnergy) = _moodSettings[mood];
            var random = new Random();
            
            // Поиск рекомендаций на основе аудио-характеристик
            var url = "https://api.spotify.com/v1/recommendations?" +
                      $"limit=10&" +
                      $"target_valence={targetValence}&" +
                      $"target_energy={targetEnergy}&" +
                      $"seed_genres={seedGenre}";

            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(json);

            var result = new List<TrackDto>();
            
            foreach (var track in doc.RootElement.GetProperty("tracks").EnumerateArray())
            {
                result.Add(new TrackDto
                {
                    Name = track.GetProperty("name").GetString(),
                    Artist = string.Join(", ", track.GetProperty("artists").EnumerateArray().Select(a => a.GetProperty("name").GetString())),
                    Url = track.GetProperty("external_urls").GetProperty("spotify").GetString()
                });
            }

            return result;
        }

        public async Task<List<TrackDto>> GetTracksFromMoodPlaylists(string mood)
        {
            // Шаг 1: Поиск плейлистов по настроению
            var playlistUrl = $"https://api.spotify.com/v1/search?q={Uri.EscapeDataString(mood)}&type=playlist&limit=5";
            var playlistResponse = await _httpClient.GetAsync(playlistUrl);
            playlistResponse.EnsureSuccessStatusCode();

            var playlistJson = await playlistResponse.Content.ReadAsStringAsync();
            using var playlistDoc = JsonDocument.Parse(playlistJson);
            
            var playlists = playlistDoc.RootElement
                .GetProperty("playlists")
                .GetProperty("items")
                .EnumerateArray()
                .ToList();

            if (!playlists.Any()) 
                return new List<TrackDto>();

            // Выбираем случайный плейлист
            var random = new Random();
            var randomPlaylist = playlists[random.Next(playlists.Count)];
            var playlistId = randomPlaylist.GetProperty("id").GetString();

            // Шаг 2: Получаем треки из плейлиста
            var tracksUrl = $"https://api.spotify.com/v1/playlists/{playlistId}/tracks?limit=15";
            var tracksResponse = await _httpClient.GetAsync(tracksUrl);
            tracksResponse.EnsureSuccessStatusCode();

            var tracksJson = await tracksResponse.Content.ReadAsStringAsync();
            using var tracksDoc = JsonDocument.Parse(tracksJson);

            var result = new List<TrackDto>();
            
            foreach (var item in tracksDoc.RootElement.GetProperty("items").EnumerateArray())
            {
                var track = item.GetProperty("track");
                result.Add(new TrackDto
                {
                    Name = track.GetProperty("name").GetString(),
                    Artist = string.Join(", ", track.GetProperty("artists").EnumerateArray().Select(a => a.GetProperty("name").GetString())),
                    Url = track.GetProperty("external_urls").GetProperty("spotify").GetString()
                });
            }

            return result;
        }
    }
}