using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using OceanTown.Database;
using OceanTown.Database.Services.Interfaces;
using OceanTown.Database.Services.Repositories;
using OceanTown.Engine;
using OceanTown.Engine.Interfaces;
using OceanTown.Server;
using OceanTown.Server.Infrastructure;


var builder = WebApplication.CreateBuilder(args);

// Add CORS policy to allow requests from the client origin
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(origin => true); // Allow all origins for dev, restrict in prod
    });
});

// Use the environment application name (the assembly name) rather than the one in
// configuration since it's more likely to be safe for use in a cookie name
string cookieBaseName = $".{builder.Environment.ApplicationName.Replace(" ", "")}";

builder.Services.AddKeyedScoped("ApplicationDisplayName",
            (sp, _) => sp.GetRequiredService<IConfiguration>().GetApplicationDisplayName());
builder.Services.AddKeyedScoped("EnvironmentName",
    (sp, o) => sp.GetRequiredService<IWebHostEnvironment>().EnvironmentName);

// AutoDisplay needs this for generating URLs
// It's obsolete, but there currently isn't any alternative
// https://github.com/dotnet/aspnetcore/issues/64361
builder.Services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();

builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddMemoryCache();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(opt =>
    opt.Cookie.Name = $"{cookieBaseName}.Session");

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

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddHttpClient();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddMemoryCache();

// Register repository interfaces
builder.Services.AddScoped<IFunctionDefinitionRepository, FunctionDefinitionRepository>();
builder.Services.AddScoped<IFunctionParameterRepository, FunctionParameterRepository>();
builder.Services.AddScoped<IGameSaveRepository, GameSaveRepository>();
builder.Services.AddScoped<ISimulationProjectRepository, SimulationProjectRepository>();
builder.Services.AddScoped<IUserAccountRepository, UserAccountRepository>();
builder.Services.AddScoped<IVariableDefinitionRepository, VariableDefinitionRepository>();

builder.Services.AddScoped<ISimulationEngine, SimulationEngine>();
builder.Services.AddScoped<ISimulationLoader, SimulationLoader>();

builder.Services.AddEndpointsApiExplorer();
// Register the Swagger generator
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AquanautsOceanTownContext>((sp, opt) =>
{
    SecretsManagementClient secretsClient = sp.GetRequiredService<SecretsManagementClient>();
    string connectionString = secretsClient.GetDbConn().Result;
    opt.UseSqlServer(connectionString);

});

var app = builder.Build();

app.UseDefaultFiles();
app.MapStaticAssets();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwagger();
    // Serves the Swagger UI
    app.UseSwaggerUI();
}


app.UseCors();
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
