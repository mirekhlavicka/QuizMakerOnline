using System;
using System.Collections.Generic;

namespace QuizMakerOnline.Models
{
    public partial class Tests
    {
        public Tests()
        {
            TestQuestions = new HashSet<TestQuestions>();
        }

        public int IdTest { get; set; }
        public int IdUser { get; set; }
        public int IdCourse { get; set; }
        public int IdSemester { get; set; }
        public string Group { get; set; }
        public string Year { get; set; }
        public DateTime EnterDate { get; set; }

        public virtual Courses IdCourseNavigation { get; set; }
        public virtual Users IdUserNavigation { get; set; }
        public virtual ICollection<TestQuestions> TestQuestions { get; set; }
    }
}
