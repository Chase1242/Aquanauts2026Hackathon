using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using OceanTown.Database;
using OceanTown.Server;
using OceanTown.Server.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Use the environment application name (the assembly name) rather than the one in
// configuration since it's more likely to be safe for use in a cookie name
string cookieBaseName = $".{builder.Environment.ApplicationName.Replace(" ", "")}";

// AutoDisplay needs this for generating URLs
// It's obsolete, but there currently isn't any alternative
// https://github.com/dotnet/aspnetcore/issues/64361
builder.Services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddMemoryCache();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(opt =>
    opt.Cookie.Name = $"{cookieBaseName}.Session");

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddMemoryCache();
builder.Services.AddDbContext<AquanautsOceanTownContext>((sp, opt) =>
{
    SecretsManagementClient secretsClient = sp.GetRequiredService<SecretsManagementClient>();
    string connectionString = secretsClient.GetDbConn().Result;
    opt.UseSqlServer(connectionString);

});

builder.Services.AddScoped<SecretsManagementClient>(sp =>
{
    IConfiguration configuration = sp.GetRequiredService<IConfiguration>();
    IMemoryCache memoryCache = sp.GetRequiredService<IMemoryCache>();
    ILogger<SecretsManagementClient> logger = sp
        .GetRequiredService<ILogger<SecretsManagementClient>>();

    string apiBaseUrl = configuration.GetSecretsManagementBaseApiUrl();
    string apiKey = configuration.GetSecretsManagementApiKey();
    string applicationName = "OceanTown";
    string environmentName = sp.GetRequiredService<IHostEnvironment>().EnvironmentName;

    return new SecretsManagementClient(apiBaseUrl, apiKey, applicationName, environmentName,
        memoryCache, configuration, logger);
});

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
