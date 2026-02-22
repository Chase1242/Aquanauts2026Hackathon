namespace OceanTown.Database.Entities;

public partial class UserAccount
{
    public int UserAccountId { get; set; }

    public string Username { get; set; } = null!;

    public DateTime CreatedAt { get; set; }

    public virtual ICollection<GameSave> GameSaves { get; set; } = new List<GameSave>();
}
