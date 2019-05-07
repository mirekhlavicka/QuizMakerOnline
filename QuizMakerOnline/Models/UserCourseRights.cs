using System;
using System.Collections.Generic;

namespace QuizMakerOnline.Models
{
    public partial class UserCourseRights
    {
        public int IdUser { get; set; }
        public int IdCourse { get; set; }
        public int Rights { get; set; }

        public virtual Courses IdCourseNavigation { get; set; }
        public virtual Users IdUserNavigation { get; set; }
    }
}
