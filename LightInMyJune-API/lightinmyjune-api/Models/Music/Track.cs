namespace lightinmyjune_api.Models
{
    public class Track
    {
        public string name { get; set; }
        public List<Artist> artists { get; set; }
        public string url { get; set; }
        public ExternalUrls externalUrls_obj { get; set; } 
    }
}