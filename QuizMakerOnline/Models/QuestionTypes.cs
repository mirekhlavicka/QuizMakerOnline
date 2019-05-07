using System;
using System.Collections.Generic;

namespace QuizMakerOnline.Models
{
    public partial class QuestionTypes
    {
        public QuestionTypes()
        {
            Questions = new HashSet<Questions>();
        }

        public int IdQuestionType { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Questions> Questions { get; set; }
    }
}
