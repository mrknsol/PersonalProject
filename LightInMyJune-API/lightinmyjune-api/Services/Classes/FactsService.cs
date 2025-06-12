using System.Text.Json;
using lightinmyjune_api.Services.Interfaces;

namespace lightinmyjune_api.Services.Classes;


    public class FactsService : IFactService
    {
        private readonly IWebHostEnvironment _env;

        public FactsService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> GetRandomFactAsync()
        {
            var filePath = Path.Combine(_env.ContentRootPath, "Data", "facts.json");

            if (!File.Exists(filePath))
                throw new FileNotFoundException("Файл с фактами не найден.");

            var json = await File.ReadAllTextAsync(filePath);
            var facts = JsonSerializer.Deserialize<List<string>>(json);

            if (facts == null || facts.Count == 0)
                throw new InvalidOperationException("Факты не найдены.");

            var random = new Random();
            return facts[random.Next(facts.Count)];
        }
    }
