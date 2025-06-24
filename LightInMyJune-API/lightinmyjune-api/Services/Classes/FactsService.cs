using System.Reflection;
using System.Text.Json;
using lightinmyjune_api.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;

namespace lightinmyjune_api.Services.Classes
{
    public class FactsService : IFactService
    {
        private readonly IWebHostEnvironment _env;

        public FactsService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> GetRandomFactAsync()
        {
           var assembly = Assembly.GetExecutingAssembly();
            var resourceName = "lightinmyjune_api.Data.facts.json";

            await using var stream = assembly.GetManifestResourceStream(resourceName);
            if (stream == null) throw new FileNotFoundException("Embedded resource not found");

            using var reader = new StreamReader(stream);
            var json = await reader.ReadToEndAsync();
            var facts = JsonSerializer.Deserialize<List<string>>(json);

            if (facts == null || facts.Count == 0)
                throw new InvalidOperationException("Факты не найдены.");

            var random = new Random();
            return facts[random.Next(facts.Count)];
        }
    }
}