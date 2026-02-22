using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using System.Net.Http.Json;

[ApiController]
[Route("api/[controller]")]
public class GeminiController : ControllerBase
{
    private readonly HttpClient _http;
    private readonly IConfiguration _config;

    public GeminiController(IHttpClientFactory factory, IConfiguration config)
    {
        _http = factory.CreateClient();
        _config = config;
    }

    [HttpPost]
    public async Task<IActionResult> Generate([FromBody] GeminiRequest request)
    {
        var apiKey = _config["GeminiApiKey"];

        if (string.IsNullOrEmpty(apiKey))
        {
            return BadRequest("Gemini API key not configured.");
        }

        var prompt = $@"
You are a blunt island citizen reacting to a decision in a climate simulation.

Current Stats (0–100):
Ecosystem: {request.Ecosystem}
Population: {request.Population}
Happiness: {request.Happiness}

Scenario: {request.ScenarioTitle}
Player chose: {request.Choice}

Rules:
- Speak as ONE citizen.
- 1–2 short dramatic sentences.
- Slightly blunt, emotional, reactive.
- No poetry.
- No theatrics.
- Keep it under 25 words.

Respond ONLY as JSON:
{{
  ""citizen"": ""short dramatic reaction"",
  ""tone"": ""positive"" | ""negative"" | ""neutral""
}}
";

        var httpRequest = new HttpRequestMessage(
            HttpMethod.Post,
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent"
        );

        httpRequest.Headers.Add("x-goog-api-key", apiKey);

        httpRequest.Content = JsonContent.Create(new
        {
            contents = new[]
            {
                new
                {
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            },
            generationConfig = new
            {
                temperature = 0.9,
                topP = 0.9
            }
        });

        HttpResponseMessage response = null;
        string result = null;

        for (int attempt = 0; attempt < 3; attempt++)
        {
            response = await _http.SendAsync(httpRequest);
            result = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
                break;

            if ((int)response.StatusCode == 503)
            {
                Console.WriteLine("Gemini overloaded. Retrying...");
                await Task.Delay(1500);
            }
            else
            {
                break;
                
            }
        }

        if (!response.IsSuccessStatusCode)
        {
            Console.WriteLine("Gemini API error:");
            Console.WriteLine(result);

            return Ok(new
            {
                text = JsonSerializer.Serialize(new
                {
                    mayor = "The mayor seems unusually quiet today.",
                    citizens = "The crowd murmurs in confusion.",
                    tone = "neutral"
                })
            });
        }

        try
        {
            var jsonDoc = JsonDocument.Parse(result);

            var text = jsonDoc
                .RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString();

            return Ok(new { text });
        }
        catch (Exception ex)
        {
            Console.WriteLine("Gemini parsing error:");
            Console.WriteLine(result);
            Console.WriteLine(ex.Message);

            return Ok(new
            {
                text = JsonSerializer.Serialize(new
                {
                    citizen = "I don't know if this was the right call.",
                    tone = "neutral"
                })
            });
        }
    }
}

