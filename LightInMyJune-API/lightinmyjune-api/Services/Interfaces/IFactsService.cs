namespace lightinmyjune_api.Services.Interfaces;

public interface IFactService {
    Task<string> GetRandomFactAsync();
}