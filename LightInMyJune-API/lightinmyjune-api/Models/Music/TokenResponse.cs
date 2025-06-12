namespace lightinmyjune_api.Models;

public class TokenResponse
{
    public string accessToken { get; set; }
    public int expiresIn { get; set; }
    public string tokenType { get; set; }
}