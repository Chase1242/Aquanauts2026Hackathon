using Microsoft.Extensions.Caching.Memory;

namespace OceanTown.Server.Infrastructure;

/// <summary>A class for getting secret values out of Secrets Management</summary>
/// <param name="apiBaseUrl"><inheritdoc cref="ApiBaseUrl" path="/summary" /></param>
/// <param name="apiKey"><inheritdoc cref="ApiKey" path="/summary" /></param>
/// <param name="applicationName"><inheritdoc cref="ApplicationName" path="/summary" /></param>
/// <param name="environmentName"><inheritdoc cref="EnvironmentName" path="/summary" /></param>
/// <param name="memoryCache"><inheritdoc cref="MemoryCache" path="/summary" /></param>
/// <param name="configuration"><inheritdoc cref="Configuration" path="/summary" /></param>
/// <param name="logger"><inheritdoc cref="Logger" path="/summary" /></param>
public class SecretsManagementClient(string apiBaseUrl, string apiKey, string applicationName,
    string environmentName, IMemoryCache? memoryCache, IConfiguration configuration,
    ILogger<SecretsManagementClient>? logger)
{
    #region Properties

    /// <summary>The base URL of the Secrets Management API</summary>
    protected string ApiBaseUrl { get; set; } = apiBaseUrl.TrimEnd('/');
    /// <summary>The API key to use to authenticate with Secrets Management</summary>
    protected string ApiKey { get; set; } = apiKey;
    /// <summary>
    /// The name of your application. This gets appended to the end of SQL Server connection strings
    /// (See <see cref="GetCachedMsSqlConnectionStringSecret(string)"/> and
    /// <see cref="GetCachedMsSqlConnectionStringSecret(Guid)"/>).
    /// </summary>
    protected string ApplicationName { get; set; } = applicationName.Replace(" ", "");
    /// <summary>
    /// The name of the environment your application is running in. This gets appended to the end of
    /// SQL Server connection strings (See
    /// <see cref="GetCachedMsSqlConnectionStringSecret(string)"/> and
    /// <see cref="GetCachedMsSqlConnectionStringSecret(Guid)"/>).
    /// </summary>
    protected string EnvironmentName { get; set; } = environmentName.Replace(" ", "");
    /// <summary>
    /// A fallback cache if the call to Secrets Management fails. Secrets that this client fetches
    /// will be automatically added to this.
    /// </summary>
    protected IMemoryCache? MemoryCache { get; set; } = memoryCache;
    /// <summary>
    /// A configuration for <see cref="GetCachedSecret(string)"/> and
    /// <see cref="GetCachedMsSqlConnectionStringSecret(string)"/> to get values from.
    /// </summary>
    protected IConfiguration Configuration { get; set; } = configuration;
    /// <summary>
    /// Used to log errors when a call to Secrets Management fails. This class will fall back to
    /// getting the value from <see cref="MemoryCache"/>, so the error will be handled and won't be
    /// automatically logged.
    /// </summary>
    public ILogger<SecretsManagementClient>? Logger { get; set; } = logger;

    #endregion

    #region Builders

    /// <summary>
    /// Creates a <see cref="SecretsManagementClient"/> by loading the <see cref="ApiBaseUrl"/> and
    /// <see cref="ApiKey"/> from configuration using <paramref name="apiBaseUrlConfigKey"/> and
    /// <paramref name="apiKeyConfigKey"/>
    /// </summary>
    /// <param name="sp">Used to get services necessary to build the client</param>
    /// <param name="apiBaseUrlConfigKey">
    /// The key to use to get the <see cref="ApiBaseUrl"/> from <see cref="IConfiguration"/>
    /// </param>
    /// <param name="apiKeyConfigKey">
    /// The key to use to get the <see cref="ApiKey"/> from <see cref="IConfiguration"/>
    /// </param>
    /// <param name="loadMemoryCache">
    /// Set to <c>false</c> if this is being called when setting up logging to prevent a loop
    /// </param>
    /// <param name="loadLogger">
    /// Set to <c>false</c> if this is being called when setting up logging to prevent a loop
    /// </param>
    /// <exception cref="KeyNotFoundException"></exception>
    public static SecretsManagementClient LoadFromConfiguration(IServiceProvider sp,
        string apiBaseUrlConfigKey, string apiKeyConfigKey,
        bool loadMemoryCache = true, bool loadLogger = true)
    {
        IConfiguration configuration = sp.GetRequiredService<IConfiguration>();

        IMemoryCache? memoryCache = null;
        if (loadMemoryCache)
            memoryCache = sp.GetRequiredService<IMemoryCache>();

        ILogger<SecretsManagementClient>? logger = null;
        if (loadLogger)
            logger = sp.GetRequiredService<ILogger<SecretsManagementClient>>();

        string apiBaseUrl = configuration.GetValue<string>(apiBaseUrlConfigKey)
            ?? throw new KeyNotFoundException($"Failed to get \"{apiBaseUrlConfigKey}\" "
                + "from configuration");
        string apiKey = configuration.GetValue<string>(apiKeyConfigKey)
            ?? throw new KeyNotFoundException($"Failed to get \"{apiKeyConfigKey}\" "
                + "from configuration");
        string applicationName = "Ocean Town";
        string environmentName = sp.GetRequiredService<IHostEnvironment>().EnvironmentName;

        return new SecretsManagementClient(apiBaseUrl, apiKey, applicationName, environmentName,
            memoryCache, configuration, logger);
    }

    /// <summary>
    /// Creates a <see cref="SecretsManagementClient"/> by loading the <see cref="ApiBaseUrl"/> and
    /// <see cref="ApiKey"/> from configuration using <paramref name="apiBaseUrlConfigKey"/> and
    /// <paramref name="apiKeyConfigKey"/>
    /// </summary>
    /// <param name="configuration">An <see cref="IConfiguration"/> to get settings from</param>
    /// <param name="environmentName"></param>
    /// <param name="apiBaseUrlConfigKey">
    /// The key to use to get the <see cref="ApiBaseUrl"/> from <see cref="IConfiguration"/>
    /// </param>
    /// <param name="apiKeyConfigKey">
    /// The key to use to get the <see cref="ApiKey"/> from <see cref="IConfiguration"/>
    /// </param>
    /// <exception cref="KeyNotFoundException"></exception>
    public static SecretsManagementClient LoadFromConfiguration(IConfiguration configuration,
        string environmentName, string apiBaseUrlConfigKey, string apiKeyConfigKey)
    {
        string apiBaseUrl = configuration.GetValue<string>(apiBaseUrlConfigKey)
            ?? throw new KeyNotFoundException($"Failed to get \"{apiBaseUrlConfigKey}\" "
                + "from configuration");
        string apiKey = configuration.GetValue<string>(apiKeyConfigKey)
            ?? throw new KeyNotFoundException($"Failed to get \"{apiKeyConfigKey}\" "
                + "from configuration");
        string applicationName = "Ocean Town";

        return new SecretsManagementClient(apiBaseUrl, apiKey, applicationName, environmentName,
            null, configuration, null);
    }

    #endregion

    #region Infrastructure

    /// <summary>
    /// Gets the secret value from Secrets Management or gets a cached value if that fails
    /// </summary>
    /// <exception cref="KeyNotFoundException">
    /// Thrown when the call to Secrets Management fails and there is no cached value
    /// </exception>
    protected async Task<string> GetCachedSecret(Guid secretId)
    {
        string cacheKey = "Secret " + secretId;

        try
        {
            HttpClient client = new();
            client.DefaultRequestHeaders.Add("api-key", this.ApiKey);

            string secretValue = await client
                .GetFromJsonAsync<string>($"{this.ApiBaseUrl}/v1/Secrets/{secretId}/Value")
                ?? throw new Exception("The secret value from the API is null");

            this.MemoryCache?.CreateEntry(cacheKey).SetValue(secretValue);
            return secretValue;
        }
        catch (Exception ex)
        {
            this.Logger?.LogError(ex,
                "There was an error getting the secret {SecretId} from Secrets Management. "
                    + "Falling back to cache",
                secretId);

            if (this.MemoryCache is null)
                throw new KeyNotFoundException("Looking up a secret filed and cache is not set up");

            return this.MemoryCache.Get<string>(cacheKey)
                ?? throw new KeyNotFoundException(
                    "Looking up a secret failed and it is not in the cache", ex);
        }
    }

    /// <summary>
    /// Gets the secret value from Secrets Management or gets a cached value if that fails
    /// </summary>
    /// <remarks>This will get the secret ID out of an <see cref="IConfiguration"/></remarks>
    /// <exception cref="KeyNotFoundException">
    /// Thrown when the call to Secrets Management fails and there is no cached value
    /// </exception>
    protected async Task<string> GetCachedSecret(string configurationKey)
    {
        return await GetCachedSecret(this.Configuration.GetValue<Guid>(configurationKey));
    }

    /// <summary>
    /// Gets a connection string from Secrets Management and appends
    /// ";App={applicationName}{environment}" to the end
    /// </summary>
    protected async Task<string> GetCachedMsSqlConnectionStringSecret(Guid secretId)
    {
        string connectionString = await GetCachedSecret(secretId);
        return $"{connectionString};App={this.ApplicationName}{this.EnvironmentName}";
    }

    /// <summary>
    /// Gets a connection string from Secrets Management and appends
    /// ";App={applicationName}{environment}" to the end
    /// </summary>
    /// <remarks>This will get the secret ID out of an <see cref="IConfiguration"/></remarks>
    protected async Task<string> GetCachedMsSqlConnectionStringSecret(string configurationKey)
    {
        return await GetCachedMsSqlConnectionStringSecret(
            this.Configuration.GetValue<Guid>(configurationKey));
    }

    #endregion

    #region Secret Getters

    public Task<string> GetDbConn()
        => GetCachedSecret("SecretsManagement:ExampleSecretId");

    public Task<string> GetLogDbConnectionString()
#warning Get an actual connection string secret
        => Task.FromResult("");

    public Task<string> GetKrakenBaseUrl()
        => GetCachedSecret("SecretsManagement:KrakenBaseUrl");

    public Task<string> GetKrakenApiKey()
        => GetCachedSecret("SecretsManagement:KrakenApiKey");

    //#if (enableScheduledTasks)
    public Task<string> GetMainApplicationDbConnectionString()
        => GetCachedMsSqlConnectionStringSecret("SecretsManagement:ApplicationDb");
    //#endif
    #endregion
}
