using System;
using System.Collections.Generic;

namespace QuizMakerOnline.Models
{
    public partial class Semesters
    {
        public int IdSemester { get; set; }
        public string Name { get; set; }
        public DateTime Datefrom { get; set; }
        public DateTime Dateto { get; set; }
    }
}
