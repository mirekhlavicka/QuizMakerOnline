using System;
using System.Collections.Generic;

namespace QuizMakerOnline.Models
{
    public partial class Users
    {
        public Users()
        {
            Questions = new HashSet<Questions>();
            Tests = new HashSet<Tests>();
            UserCourseRights = new HashSet<UserCourseRights>();
            Version = new HashSet<Version>();
        }

        public int IdUser { get; set; }
        public string LoginName { get; set; }
        public string FullName { get; set; }
        public string Password { get; set; }
        public string Description { get; set; }

        public virtual ICollection<Questions> Questions { get; set; }
        public virtual ICollection<Tests> Tests { get; set; }
        public virtual ICollection<UserCourseRights> UserCourseRights { get; set; }
        public virtual ICollection<Version> Version { get; set; }
    }
}
