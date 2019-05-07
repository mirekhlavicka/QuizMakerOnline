using System;
using System.Collections.Generic;

namespace QuizMakerOnline.Models
{
    public partial class QuestionDifficulties
    {
        public QuestionDifficulties()
        {
            Questions = new HashSet<Questions>();
        }

        public int IdQuestionDifficulty { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Questions> Questions { get; set; }
    }
}
