using lightinmyjune_api.Services.Classes;
using lightinmyjune_api.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost3000", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddSingleton<IFactService, FactsService>();
builder.Services.AddHttpClient<MusicService>();
builder.Services.AddSingleton<IMusicService>(sp =>
{
    var httpClient = sp.GetRequiredService<HttpClient>();
    var config = builder.Configuration;
    return new MusicService(httpClient,
        config["client_Id"]!,
        config["client_secret"]!);
});

var app = builder.Build();

    app.UseSwagger();
    app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthorization();
app.UseCors("AllowLocalhost3000");

app.MapControllers();

app.Run();