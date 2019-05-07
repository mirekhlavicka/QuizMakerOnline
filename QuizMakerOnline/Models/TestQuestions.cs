using System;
using System.Collections.Generic;

namespace QuizMakerOnline.Models
{
    public partial class TestQuestions
    {
        public int IdQuestion { get; set; }
        public int IdTest { get; set; }
        public int Order { get; set; }
        public string RightAnswer { get; set; }

        public virtual Questions IdQuestionNavigation { get; set; }
        public virtual Tests IdTestNavigation { get; set; }
    }
}
