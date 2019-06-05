using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizMakerOnline.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace QuizMakerOnline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class QuestionsController : ControllerBase
    {
        private readonly QuizMakerContext _context;

        public QuestionsController(QuizMakerContext context)
        {
            _context = context;
        }

        // GET: api/questions
        [HttpGet]
        public IEnumerable<Object> GetQuestions(int id_course, int? id_category, string id_difficulty, string id_user, string id_type, string state)
        {
            var current_id_user = Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (!_context.UserCourseRights.Any(ur => ur.IdUser == current_id_user && ur.IdCourse == id_course && (ur.Rights & 2) != 0))
            {
                return new object[] { };
            }

            var res = _context.Questions.AsQueryable();

            if (id_category != null && id_category != 0)
            {
                res = res.Where(q => q.IdCategory == id_category.Value);
            }

            if (!String.IsNullOrEmpty(id_difficulty) && id_difficulty != "0")
            {
                var tmp = id_difficulty.Split(',').Select(s => Int32.Parse(s)).ToArray();
                res = res.Where(q =>  tmp.Contains(q.IdQuestionDifficulty));
            }

            if (!String.IsNullOrEmpty(id_user) && id_user != "0")
            {
                var tmp = id_user.Split(',').Select(s => Int32.Parse(s)).ToArray();
                res = res.Where(q => tmp.Contains(q.IdUser));
            }

            if (!String.IsNullOrEmpty(id_type) && id_type != "0")
            {
                var tmp = id_type.Split(',').Select(s => Int32.Parse(s)).ToArray();
                res = res.Where(q => tmp.Contains(q.IdQuestionType));
            }

            if (!String.IsNullOrEmpty(state) && state != "-1")
            {
                var tmp = state.Split(',').Select(s => Int32.Parse(s)).ToArray();
                res = res.Where(q => tmp.Contains(q.State));
            }

            res = res.OrderByDescending(q => q.IdQuestion);

            return res.Select(q => new
            {
                id_question = q.IdQuestion,
                id_category = q.IdCategory,
                id_user = q.IdUser,
                id_question_type = q.IdQuestionType,
                id_question_difficulty = q.IdQuestionDifficulty,
                points = q.Points,
                question = q.Question,
                right_answer = q.RightAnswer,
                solution = q.Solution,
                enter_date = q.EnterDate,
                state = q.State,
                answers = q.Answers
                    //.Where(a => a.Answer != "")
                    .Select(a => new
                    {
                        id_question = a.IdQuestion,
                        position = a.Position,
                        answer = a.Answer,
                        points = a.Points
                    })
            })
            //.AsEnumerable()
            //.Where(q => q.question.Trim() != "")
            .ToList();
        }

        // GET: api/questions/courses
        [HttpGet]
        [Route("courses")]
        [AllowAnonymous]
        public IEnumerable<Object> GetCourses()
        {
            var res = _context.Courses
                .Where(c => c.IdCourse != 0)
                .OrderBy(c => c.Name);

            return res.Select(c => new
            {
                id_course = c.IdCourse,
                name = c.Name,
                code = c.Code
            })
            .ToList();
        }

        // GET: api/questions/categories
        [HttpGet]
        [Route("categories")]
        public IEnumerable<Object> GetCategories()
        {
            var res = _context.QuestionCategories;


            return res.Select(c => new
            {
                id_course = c.IdCourse,
                id_category = c.IdCategory,
                name = c.Name
            })
            .ToList();
        }

        // GET: api/questions/users/id
        [HttpGet()]
        [Route("users/{id_course}")]
        public IEnumerable<Object> GetUsers(int id_course)
        {
            return _context
                .Users
                .Where(u => u.Questions.Any(q => q.IdCategoryNavigation.IdCourseNavigation.IdCourse == id_course))
                .Select(u => new
                {
                    id_user = u.IdUser,
                    name = u.FullName
                })
                .ToList();
        }

        // GET: api/questions/allusers
        [HttpGet()]
        [Route("allusers")]
        public Object GetAllUsers()
        {
            return _context
                .Users
                .Select(u => new
                {
                    id_user = u.IdUser,
                    name = u.FullName
                })
                .ToDictionary(u => u.id_user, u => u.name);
        }

        // GET: api/questions/questiontypes
        [HttpGet()]
        [Route("questiontypes")]
        public Object GetQuestionTypes()
        {
            return _context
                .QuestionTypes
                .Select(qt => new
                {
                    id = qt.IdQuestionType,
                    name = qt.Name.ToLower()
                })
                .ToDictionary(qt => qt.id, qt => qt.name);
        }

        // GET: api/questions/questiondifficulties
        [HttpGet()]
        [Route("questiondifficulties")]
        public Object GetQuestionDifficulties()
        {
            return _context
                .QuestionDifficulties
                .Select(qd => new
                {
                    id = qd.IdQuestionDifficulty,
                    name = qd.Name.ToLower()
                })
                .ToDictionary(qd => qd.id, qd => qd.name);
        }

        // GET: api/questions/questionstate
        [HttpGet()]
        [Route("questionstate")]
        public Object GetQuestionState()
        {
            return _context
                .QuestionState
                .Select(qs => new
                {
                    id = qs.State,
                    name = qs.Name.ToLower()
                })
                .ToDictionary(qs => qs.id, qs => qs.name);
        }

        // PUT: api/questions  bez /5
        [HttpPut/*("{id}")*/]
        public IActionResult PutQuestion(ClientQuestion cq)
        {
            Questions question = _context.Questions.SingleOrDefault(q => q.IdQuestion == cq.id_question);

            if (question == null)
            {
                return BadRequest();
            }
            
            question.Question = cq.question;
            question.Solution = cq.solution;
            question.Points = cq.points;
            
            question.IdCategory = cq.id_category;
            question.IdQuestionDifficulty = cq.id_question_difficulty;
            question.IdQuestionType = cq.id_question_type;
            question.State = cq.state;

            _context.SaveChanges();

            /*if (id != users.IdUser)
            {
                return BadRequest();
            }

            _context.Entry(users).State = EntityState.Modified;

            try
            {
                _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsersExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }*/

            return NoContent();
        }

        public class ClientQuestion
        {
            public int id_question {get; set;}
            public string question { get; set; }
            public string solution { get; set; }
            public int points { get; set; }
            public int id_question_difficulty { get; set; }
            public int id_category { get; set; }
            public int id_question_type { get; set; }
            public int state { get; set; }
        }

    }
}