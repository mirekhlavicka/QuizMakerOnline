using System;
using System.Collections.Generic;

namespace QuizMakerOnline.Models
{
    public partial class Version
    {
        public int IdCategory { get; set; }
        public int IdUser { get; set; }
        public int Version1 { get; set; }

        public virtual QuestionCategories IdCategoryNavigation { get; set; }
        public virtual Users IdUserNavigation { get; set; }
    }
}
