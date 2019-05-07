using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace QuizMakerOnline.Models
{
    public partial class QuizMakerContext : DbContext
    {
        public QuizMakerContext()
        {
        }

        public QuizMakerContext(DbContextOptions<QuizMakerContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Answers> Answers { get; set; }
        public virtual DbSet<Courses> Courses { get; set; }
        public virtual DbSet<QuestionCategories> QuestionCategories { get; set; }
        public virtual DbSet<QuestionDifficulties> QuestionDifficulties { get; set; }
        public virtual DbSet<QuestionState> QuestionState { get; set; }
        public virtual DbSet<QuestionTypes> QuestionTypes { get; set; }
        public virtual DbSet<Questions> Questions { get; set; }
        public virtual DbSet<Semesters> Semesters { get; set; }
        public virtual DbSet<TestQuestions> TestQuestions { get; set; }
        public virtual DbSet<Tests> Tests { get; set; }
        public virtual DbSet<UserCourseRightTypes> UserCourseRightTypes { get; set; }
        public virtual DbSet<UserCourseRights> UserCourseRights { get; set; }
        public virtual DbSet<Users> Users { get; set; }
        public virtual DbSet<Version> Version { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
//                optionsBuilder.UseSqlServer("data source=147.229.139.195;initial catalog=QuizMaker;persist security info=True;user id=sa;password=Vindaloo951753");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.3-servicing-35854");

            modelBuilder.Entity<Answers>(entity =>
            {
                entity.HasKey(e => new { e.IdQuestion, e.Position });

                entity.Property(e => e.IdQuestion).HasColumnName("id_question");

                entity.Property(e => e.Position)
                    .HasColumnName("position")
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Answer)
                    .IsRequired()
                    .HasColumnName("answer")
                    .HasColumnType("ntext")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Points).HasColumnName("points");

                entity.HasOne(d => d.IdQuestionNavigation)
                    .WithMany(p => p.Answers)
                    .HasForeignKey(d => d.IdQuestion)
                    .HasConstraintName("FK_Answers_Questions");
            });

            modelBuilder.Entity<Courses>(entity =>
            {
                entity.HasKey(e => e.IdCourse);

                entity.Property(e => e.IdCourse)
                    .HasColumnName("id_course")
                    .ValueGeneratedNever();

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasColumnName("code")
                    .HasMaxLength(10)
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.MaxIdCategory).HasColumnName("max_id_category");

                entity.Property(e => e.MinIdCategory).HasColumnName("min_id_category");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<QuestionCategories>(entity =>
            {
                entity.HasKey(e => e.IdCategory);

                entity.Property(e => e.IdCategory)
                    .HasColumnName("id_category")
                    .ValueGeneratedNever();

                entity.Property(e => e.CountPerTest).HasColumnName("count_per_test");

                entity.Property(e => e.IdCourse).HasColumnName("id_course");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(255)
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Points).HasColumnName("points");

                entity.HasOne(d => d.IdCourseNavigation)
                    .WithMany(p => p.QuestionCategories)
                    .HasForeignKey(d => d.IdCourse)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_QuestionCategories_Courses");
            });

            modelBuilder.Entity<QuestionDifficulties>(entity =>
            {
                entity.HasKey(e => e.IdQuestionDifficulty);

                entity.Property(e => e.IdQuestionDifficulty)
                    .HasColumnName("id_question_difficulty")
                    .ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<QuestionState>(entity =>
            {
                entity.HasKey(e => e.State);

                entity.Property(e => e.State)
                    .HasColumnName("state")
                    .ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<QuestionTypes>(entity =>
            {
                entity.HasKey(e => e.IdQuestionType);

                entity.Property(e => e.IdQuestionType)
                    .HasColumnName("id_question_type")
                    .ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Questions>(entity =>
            {
                entity.HasKey(e => e.IdQuestion);

                entity.Property(e => e.IdQuestion).HasColumnName("id_question");

                entity.Property(e => e.EnterDate)
                    .HasColumnName("enter_date")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.IdCategory).HasColumnName("id_category");

                entity.Property(e => e.IdQuestionDifficulty).HasColumnName("id_question_difficulty");

                entity.Property(e => e.IdQuestionType).HasColumnName("id_question_type");

                entity.Property(e => e.IdUser).HasColumnName("id_user");

                entity.Property(e => e.Points).HasColumnName("points");

                entity.Property(e => e.Question)
                    .IsRequired()
                    .HasColumnName("question")
                    .HasColumnType("ntext")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.RightAnswer)
                    .IsRequired()
                    .HasColumnName("right_answer")
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Solution)
                    .IsRequired()
                    .HasColumnName("solution")
                    .HasColumnType("ntext")
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.State).HasColumnName("state");

                entity.HasOne(d => d.IdCategoryNavigation)
                    .WithMany(p => p.Questions)
                    .HasForeignKey(d => d.IdCategory)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Questions_QuestionCategories");

                entity.HasOne(d => d.IdQuestionDifficultyNavigation)
                    .WithMany(p => p.Questions)
                    .HasForeignKey(d => d.IdQuestionDifficulty)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Questions_QuestionDifficulties");

                entity.HasOne(d => d.IdQuestionTypeNavigation)
                    .WithMany(p => p.Questions)
                    .HasForeignKey(d => d.IdQuestionType)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Questions_QuestionTypes");

                entity.HasOne(d => d.IdUserNavigation)
                    .WithMany(p => p.Questions)
                    .HasForeignKey(d => d.IdUser)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Questions_Users");
            });

            modelBuilder.Entity<Semesters>(entity =>
            {
                entity.HasKey(e => e.IdSemester);

                entity.Property(e => e.IdSemester)
                    .HasColumnName("id_semester")
                    .ValueGeneratedNever();

                entity.Property(e => e.Datefrom)
                    .HasColumnName("datefrom")
                    .HasColumnType("datetime");

                entity.Property(e => e.Dateto)
                    .HasColumnName("dateto")
                    .HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<TestQuestions>(entity =>
            {
                entity.HasKey(e => new { e.IdQuestion, e.IdTest });

                entity.Property(e => e.IdQuestion).HasColumnName("id_question");

                entity.Property(e => e.IdTest).HasColumnName("id_test");

                entity.Property(e => e.Order).HasColumnName("order");

                entity.Property(e => e.RightAnswer)
                    .IsRequired()
                    .HasColumnName("right_answer")
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('')");

                entity.HasOne(d => d.IdQuestionNavigation)
                    .WithMany(p => p.TestQuestions)
                    .HasForeignKey(d => d.IdQuestion)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TestQuestions_Questions");

                entity.HasOne(d => d.IdTestNavigation)
                    .WithMany(p => p.TestQuestions)
                    .HasForeignKey(d => d.IdTest)
                    .HasConstraintName("FK_TestQuestions_Tests");
            });

            modelBuilder.Entity<Tests>(entity =>
            {
                entity.HasKey(e => e.IdTest);

                entity.Property(e => e.IdTest).HasColumnName("id_test");

                entity.Property(e => e.EnterDate)
                    .HasColumnName("enter_date")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Group)
                    .IsRequired()
                    .HasColumnName("group")
                    .HasMaxLength(50)
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.IdCourse).HasColumnName("id_course");

                entity.Property(e => e.IdSemester).HasColumnName("id_semester");

                entity.Property(e => e.IdUser).HasColumnName("id_user");

                entity.Property(e => e.Year)
                    .IsRequired()
                    .HasColumnName("year")
                    .HasMaxLength(200)
                    .HasDefaultValueSql("(datepart(year,getdate()))");

                entity.HasOne(d => d.IdCourseNavigation)
                    .WithMany(p => p.Tests)
                    .HasForeignKey(d => d.IdCourse)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Tests_Courses");

                entity.HasOne(d => d.IdUserNavigation)
                    .WithMany(p => p.Tests)
                    .HasForeignKey(d => d.IdUser)
                    .HasConstraintName("FK_Tests_Users");
            });

            modelBuilder.Entity<UserCourseRightTypes>(entity =>
            {
                entity.HasKey(e => e.Right);

                entity.Property(e => e.Right)
                    .HasColumnName("right")
                    .ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<UserCourseRights>(entity =>
            {
                entity.HasKey(e => new { e.IdUser, e.IdCourse });

                entity.Property(e => e.IdUser).HasColumnName("id_user");

                entity.Property(e => e.IdCourse).HasColumnName("id_course");

                entity.Property(e => e.Rights).HasColumnName("rights");

                entity.HasOne(d => d.IdCourseNavigation)
                    .WithMany(p => p.UserCourseRights)
                    .HasForeignKey(d => d.IdCourse)
                    .HasConstraintName("FK_UserCourseRights_Courses");

                entity.HasOne(d => d.IdUserNavigation)
                    .WithMany(p => p.UserCourseRights)
                    .HasForeignKey(d => d.IdUser)
                    .HasConstraintName("FK_UserCourseRights_Users");
            });

            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.IdUser);

                entity.HasIndex(e => e.LoginName)
                    .HasName("IX_Users")
                    .IsUnique();

                entity.Property(e => e.IdUser).HasColumnName("ID_USER");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasColumnName("DESCRIPTION")
                    .HasMaxLength(500)
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.FullName)
                    .IsRequired()
                    .HasColumnName("FULL_NAME")
                    .HasMaxLength(200)
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.LoginName)
                    .IsRequired()
                    .HasColumnName("LOGIN_NAME")
                    .HasMaxLength(50);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasColumnName("PASSWORD")
                    .HasMaxLength(50)
                    .HasDefaultValueSql("('')");
            });

            modelBuilder.Entity<Version>(entity =>
            {
                entity.HasKey(e => new { e.IdCategory, e.IdUser })
                    .HasName("PK_Version_1");

                entity.Property(e => e.IdCategory).HasColumnName("id_category");

                entity.Property(e => e.IdUser).HasColumnName("id_user");

                entity.Property(e => e.Version1).HasColumnName("version");

                entity.HasOne(d => d.IdCategoryNavigation)
                    .WithMany(p => p.Version)
                    .HasForeignKey(d => d.IdCategory)
                    .HasConstraintName("FK_Version_QuestionCategories");

                entity.HasOne(d => d.IdUserNavigation)
                    .WithMany(p => p.Version)
                    .HasForeignKey(d => d.IdUser)
                    .HasConstraintName("FK_Version_Users");
            });
        }
    }
}
