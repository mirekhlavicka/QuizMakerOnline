using System;
using System.Collections.Generic;

namespace QuizMakerOnline.Models
{
    public partial class QuestionCategories
    {
        public QuestionCategories()
        {
            Questions = new HashSet<Questions>();
            Version = new HashSet<Version>();
        }

        public int IdCategory { get; set; }
        public int IdCourse { get; set; }
        public string Name { get; set; }
        public int Points { get; set; }
        public int CountPerTest { get; set; }

        public virtual Courses IdCourseNavigation { get; set; }
        public virtual ICollection<Questions> Questions { get; set; }
        public virtual ICollection<Version> Version { get; set; }
    }
}
