using System;
using System.Collections.Generic;

namespace QuizMakerOnline.Models
{
    public partial class Questions
    {
        public Questions()
        {
            Answers = new HashSet<Answers>();
            TestQuestions = new HashSet<TestQuestions>();
        }

        public int IdQuestion { get; set; }
        public int IdCategory { get; set; }
        public int IdUser { get; set; }
        public int IdQuestionType { get; set; }
        public int IdQuestionDifficulty { get; set; }
        public int Points { get; set; }
        public string Question { get; set; }
        public string RightAnswer { get; set; }
        public string Solution { get; set; }
        public DateTime EnterDate { get; set; }
        public int State { get; set; }

        public virtual QuestionCategories IdCategoryNavigation { get; set; }
        public virtual QuestionDifficulties IdQuestionDifficultyNavigation { get; set; }
        public virtual QuestionTypes IdQuestionTypeNavigation { get; set; }
        public virtual Users IdUserNavigation { get; set; }
        public virtual ICollection<Answers> Answers { get; set; }
        public virtual ICollection<TestQuestions> TestQuestions { get; set; }
    }
}
