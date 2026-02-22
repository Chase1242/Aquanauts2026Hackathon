using OceanTown.Database.Entities;
using OceanTown.Shared;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace OceanTown.Server;

public static class Extensions
{
    #region Configuration

    public static T GetRequiredValue<T>(this IConfiguration configuration, string key)
        => configuration.GetValue<T>(key)
            ?? throw new KeyNotFoundException($"Failed to get \"{key}\" from configuration");

    // ApplicationName is the assembly name, so that can't be used as the configuration key
    public static string GetApplicationDisplayName(this IConfiguration configuration)
        => configuration.GetRequiredValue<string>("ApplicationDisplayName");

    public static string GetApplicationDepartmentName(this IConfiguration configuration)
        => configuration.GetRequiredValue<string>("DepartmentName");

    public static string GetSecretsManagementBaseApiUrl(this IConfiguration configuration)
        => configuration.GetRequiredValue<string>("SecretsManagement:ApiBaseUrl");

    public static string GetSecretsManagementApiKey(this IConfiguration configuration)
        => configuration.GetRequiredValue<string>("SecretsManagement:ApiKey");

    public static string? GetGoogleAnalyticsId(this IConfiguration configuration)
        => configuration.GetValue<string>("Analytics:GoogleAnalyticsId");

    public static bool IsQuickLinksEnabled(this IConfiguration configuration)
        => configuration.GetValue<int?>("QuickLinksApplicationId") != null;

    public static int GetQuickLinksApplicationId(this IConfiguration configuration)
        => configuration.GetRequiredValue<int>("QuickLinksApplicationId");

    public static bool IsScheduledTasksSystemEnabled(this IConfiguration configuration)
        => configuration.GetValue<bool?>("ScheduledTasksEnabled") ?? false;

    public static string? GetLogDbSchemaName(this IConfiguration configuration)
        => configuration.GetValue<string>("LogDbSchemaName");

    public static string? GetLogDbTableName(this IConfiguration configuration)
        => configuration.GetValue<string>("LogDbTableName");

    #endregion    

    /// <summary>
    /// Converts a stored GameSave row into an in-memory GameState.
    /// </summary>
    public static GameState ToGameState(this GameSave save)
    {
        JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            NumberHandling = JsonNumberHandling.AllowReadingFromString
        };

        ArgumentNullException.ThrowIfNull(save);
        if (save.IsDeleted) throw new InvalidOperationException("Cannot load a deleted save.");
        if (string.IsNullOrWhiteSpace(save.GameStateJson))
            throw new InvalidOperationException("Save has no GameStateJson.");

        var state = JsonSerializer.Deserialize<GameState>(save.GameStateJson, JsonOptions);

        if (state == null)
            throw new InvalidOperationException("GameStateJson could not be deserialized.");

        // Safety defaults in case older saves are missing fields
        state.Cells ??= new List<Dictionary<string, double>>();
        state.GlobalVariables ??= new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase);

        return state;
    }


    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false,
        NumberHandling = JsonNumberHandling.Strict
    };


    // Maps a runtime GameState into a GameSave entity for persistence.
    /// This does NOT save to the database.
    /// </summary>
    public static void UpdateGameSaveFromState(
        GameSave save,
        GameState state,
        string? engineVersion = null)
    {
        ArgumentNullException.ThrowIfNull(save);
        ArgumentNullException.ThrowIfNull(state);

        var json = JsonSerializer.Serialize(state, JsonOptions);

        save.GameStateJson = json;

        if (engineVersion != null)
            save.EngineVersion = engineVersion;
    }

    /// <summary>
    /// Creates a brand-new GameSave entity from a GameState.
    /// Use this for first-time save creation.
    /// </summary>
    public static GameSave CreateGameSaveFromState(
        this GameState state,
        int simulationProjectId,
        int userAccountId,
        string? engineVersion = null)
    {
        if (state == null) throw new ArgumentNullException(nameof(state));

        var json = JsonSerializer.Serialize(state, JsonOptions);

        return new GameSave
        {
            SimulationProjectId = simulationProjectId,
            UserAccountId = userAccountId,
            SaveName = $"{userAccountId}-{DateTime.Now.Ticks}",
            GameStateJson = json,
            CreatedAt = DateTime.UtcNow,
            EngineVersion = engineVersion
        };
    }

}
