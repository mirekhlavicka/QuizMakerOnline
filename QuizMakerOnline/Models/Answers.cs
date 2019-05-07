using System;
using System.Collections.Generic;

namespace QuizMakerOnline.Models
{
    public partial class Answers
    {
        public int IdQuestion { get; set; }
        public string Position { get; set; }
        public string Answer { get; set; }
        public int Points { get; set; }

        public virtual Questions IdQuestionNavigation { get; set; }
    }
}
