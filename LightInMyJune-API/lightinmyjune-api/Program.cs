using lightinmyjune_api.Services.Classes;
using lightinmyjune_api.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Регистрируем LastFmMoodService с HttpClient
builder.Services.AddHttpClient<IMusicService, MusicService>();
builder.Services.AddSingleton<IFactService, FactsService>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:3000") // Адрес твоего React dev-сервера
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// Добавляем контроллеры
builder.Services.AddControllers();

// Swagger (если нужен)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware для разработки
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseCors("AllowReactApp");
app.MapControllers();

app.Run();