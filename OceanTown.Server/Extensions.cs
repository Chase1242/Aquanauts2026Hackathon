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
}
