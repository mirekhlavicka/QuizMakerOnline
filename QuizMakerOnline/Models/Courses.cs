using System;
using System.Collections.Generic;

namespace QuizMakerOnline.Models
{
    public partial class Courses
    {
        public Courses()
        {
            QuestionCategories = new HashSet<QuestionCategories>();
            Tests = new HashSet<Tests>();
            UserCourseRights = new HashSet<UserCourseRights>();
        }

        public int IdCourse { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public int MinIdCategory { get; set; }
        public int MaxIdCategory { get; set; }

        public virtual ICollection<QuestionCategories> QuestionCategories { get; set; }
        public virtual ICollection<Tests> Tests { get; set; }
        public virtual ICollection<UserCourseRights> UserCourseRights { get; set; }
    }
}
