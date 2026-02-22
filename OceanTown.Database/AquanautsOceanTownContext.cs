using Microsoft.EntityFrameworkCore;
using OceanTown.Database.Entities;

namespace OceanTown.Database;

public partial class AquanautsOceanTownContext : DbContext
{
    public AquanautsOceanTownContext()
    {
    }

    public AquanautsOceanTownContext(DbContextOptions<AquanautsOceanTownContext> options)
        : base(options)
    {
    }

    public virtual DbSet<FunctionDefinition> FunctionDefinitions { get; set; }

    public virtual DbSet<FunctionParameter> FunctionParameters { get; set; }

    public virtual DbSet<GameSave> GameSaves { get; set; }

    public virtual DbSet<SimulationProject> SimulationProjects { get; set; }

    public virtual DbSet<UserAccount> UserAccounts { get; set; }

    public virtual DbSet<VariableDefinition> VariableDefinitions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<FunctionDefinition>(entity =>
        {
            entity.HasKey(e => e.FunctionDefinitionId).HasName("PK__Function__DA0452CDF61C637E");

            entity.ToTable("FunctionDefinition");

            entity.HasIndex(e => e.ReturnVariableId, "IX_FunctionDefinition_ReturnVariable");

            entity.Property(e => e.Category).HasMaxLength(64);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())", "DF_FunctionDefinition_CreatedAt");
            entity.Property(e => e.Description).HasMaxLength(512);
            entity.Property(e => e.Name).HasMaxLength(128);

            entity.HasOne(d => d.ReturnVariable).WithMany(p => p.FunctionDefinitions)
                .HasForeignKey(d => d.ReturnVariableId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FunctionDefinition_ReturnVariable");

            entity.HasOne(d => d.SimulationProject).WithMany(p => p.FunctionDefinitions)
                .HasForeignKey(d => d.SimulationProjectId)
                .HasConstraintName("FK_FunctionDefinition_SimulationProject");
        });

        modelBuilder.Entity<FunctionParameter>(entity =>
        {
            entity.HasKey(e => e.FunctionParameterId).HasName("PK__Function__B77B05A6033BE934");

            entity.ToTable("FunctionParameter");

            entity.HasIndex(e => e.FunctionDefinitionId, "IX_FunctionParameter_FunctionDefinition");

            entity.HasIndex(e => e.VariableDefinitionId, "IX_FunctionParameter_VariableDefinition");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())", "DF_FunctionParameter_CreatedAt");
            entity.Property(e => e.Name).HasMaxLength(64);

            entity.HasOne(d => d.FunctionDefinition).WithMany(p => p.FunctionParameters)
                .HasForeignKey(d => d.FunctionDefinitionId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_FunctionParameter_FunctionDefinition");

            entity.HasOne(d => d.VariableDefinition).WithMany(p => p.FunctionParameters)
                .HasForeignKey(d => d.VariableDefinitionId)
                .HasConstraintName("FK_FunctionParameter_VariableDefinition");
        });

        modelBuilder.Entity<GameSave>(entity =>
        {
            entity.HasKey(e => e.GameSaveId).HasName("PK__GameSave__32B7915330A8D960");

            entity.ToTable("GameSave");

            entity.HasIndex(e => e.IsDeleted, "IX_GameSave_IsDeleted");

            entity.HasIndex(e => e.UserAccountId, "IX_GameSave_UserAccountId");

            entity.HasIndex(e => new { e.UserAccountId, e.SaveName }, "IX_GameSave_User_SaveName");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())", "DF_GameSave_CreatedAt");
            entity.Property(e => e.EngineVersion).HasMaxLength(32);
            entity.Property(e => e.SaveName).HasMaxLength(128);

            entity.HasOne(d => d.SimulationProject).WithMany(p => p.GameSaves)
                .HasForeignKey(d => d.SimulationProjectId)
                .HasConstraintName("FK_GameSave_SimulationProject");

            entity.HasOne(d => d.UserAccount).WithMany(p => p.GameSaves)
                .HasForeignKey(d => d.UserAccountId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GameSave_UserAccount");
        });

        modelBuilder.Entity<SimulationProject>(entity =>
        {
            entity.HasKey(e => e.SimulationProjectId).HasName("PK__Simulati__658C2ACCA76297AD");

            entity.ToTable("SimulationProject");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())", "DF_SimulationProject_CreatedAt");
            entity.Property(e => e.Description).HasMaxLength(512);
            entity.Property(e => e.Name).HasMaxLength(128);
        });

        modelBuilder.Entity<UserAccount>(entity =>
        {
            entity.HasKey(e => e.UserAccountId).HasName("PK__UserAcco__DA6C709A2302691F");

            entity.ToTable("UserAccount");

            entity.HasIndex(e => e.Username, "UQ__UserAcco__536C85E4A76C4FD2").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())", "DF_UserAccount_CreatedAt");
            entity.Property(e => e.Username).HasMaxLength(64);
        });

        modelBuilder.Entity<VariableDefinition>(entity =>
        {
            entity.HasKey(e => e.VariableDefinitionId).HasName("PK__Variable__64B2D060BECA76C5");

            entity.ToTable("VariableDefinition");

            entity.HasIndex(e => e.Code, "UQ__Variable__A25C5AA7FB577A9C").IsUnique();

            entity.Property(e => e.Category).HasMaxLength(64);
            entity.Property(e => e.Code).HasMaxLength(64);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())", "DF_VariableDefinition_CreatedAt");
            entity.Property(e => e.Description).HasMaxLength(512);
            entity.Property(e => e.DisplayName).HasMaxLength(128);
            entity.Property(e => e.Unit).HasMaxLength(64);

            entity.HasOne(d => d.SimulationProject).WithMany(p => p.VariableDefinitions)
                .HasForeignKey(d => d.SimulationProjectId)
                .HasConstraintName("FK_VariableDefinition_SimulationProject");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
