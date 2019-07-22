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
        public ActionResult<IEnumerable<Object>> GetQuestions(int id_course, int? id_category, string id_difficulty, string id_user, string id_type, string state)
        {
            var current_id_user = Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            if (!_context.UserCourseRights.Any(ur => ur.IdUser == current_id_user && ur.IdCourse == id_course && (ur.Rights & 2) != 0))
            {
                return BadRequest("Access denied");// new object[] { };
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

            return Ok(res.Select(q => new
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
                canEdit = (current_id_user == 1 || current_id_user == q.IdUser),
                answers = q.Answers
                    .OrderBy(a => a.Position)
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
            .ToList());
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
        public IEnumerable<Object> GetCategories(int? id_category, int? id_course)
        {
            var res = _context.QuestionCategories.AsQueryable();

            if (id_category != null && id_category != 0)
            {
                res = res.Where(c => c.IdCategory == id_category);
            }

            if (id_course != null && id_course != 0)
            {
                res = res.Where(c => c.IdCourse == id_course);
            }


            return res.Select(c => new
            {
                id_course = c.IdCourse,
                id_category = c.IdCategory,
                name = c.Name,
                count = c.Questions.Count()
            })
            .ToList();
        }

        [HttpPut/*("{id}")*/]
        [Route("categories")]
        public IActionResult PutCategory(ClientCategory cc)
        {
            QuestionCategories category = _context.QuestionCategories.SingleOrDefault(c => c.IdCategory == cc.id_category);

            if (category == null)
            {
                return BadRequest();
            }

            category.Name = cc.name;
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPost/*("{id}")*/]
        [Route("categories")]
        public object PostCategory(ClientCategory cc)
        {
            int newId = _context.QuestionCategories.Max(c => c.IdCategory) + 1;

            QuestionCategories category = new QuestionCategories
            {
                IdCourse = cc.id_course,
                IdCategory = newId,
                Name = cc.name,
                CountPerTest = 0,
                Points = 0                
            };

            _context.QuestionCategories.Add(category);

            _context.SaveChanges();

            return new
            {
                id_course = category.IdCourse,
                id_category = category.IdCategory,
                name = category.Name
            };
        }

        [HttpDelete("categories/{id}")]
        public IActionResult DeleteCategory(int id)
        {
            var category = _context.QuestionCategories.Find(id);
            if (category == null)
            {
                return NotFound();
            }

            _context.QuestionCategories.Remove(category);

            try
            {
                _context.SaveChanges();
            }
            catch (Exception exc)
            {
                return BadRequest(exc.InnerException.Message);
            }

            return NoContent();
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
            question.RightAnswer = cq.right_answer;

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


        [HttpPost]
        public object PostQuestion(ClientQuestion cq)
        {
            var current_id_user = Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            Questions q = new Questions
            {
                IdCategory = cq.id_category,
                IdQuestionDifficulty = cq.id_question_difficulty,
                IdQuestionType = cq.id_question_type,
                Points = cq.points,
                EnterDate = DateTime.Now,
                RightAnswer = cq.right_answer,
                Question = cq.question,
                Solution = cq.solution,
                State = cq.state,
                IdUser = current_id_user
            };

            _context.Questions.Add(q);

            _context.SaveChanges();

            return new
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
                    .OrderBy(a => a.Position)
                    //.Where(a => a.Answer != "")
                    .Select(a => new
                    {
                        id_question = a.IdQuestion,
                        position = a.Position,
                        answer = a.Answer,
                        points = a.Points
                    })
            };
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteQuestion(int id)
        {
            var question = _context.Questions.Find(id);
            if (question == null)
            {
                return NotFound();
            }

            _context.Questions.Remove(question);

            try
            {
                _context.SaveChanges();
            }
            catch(Exception exc)            
            {
                return BadRequest(exc.InnerException.Message);
            }

            return NoContent();
        }

        [HttpGet("rights/{id_course}")]
        //[Route("rights")]
        public int GetRights(int id_course)
        {
            var current_id_user = Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var ucr = _context.UserCourseRights.SingleOrDefault(ur => ur.IdUser == current_id_user && ur.IdCourse == id_course);

            if (ucr != null)
            {
                return ucr.Rights;
            }
            else
            {
                return 0;
            }
        }

        [HttpGet("history/{id_question}")]
        public ActionResult<IEnumerable<Object>> GetHistoryTests(int id_question)
        {
            var current_id_user = Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var res = _context.Tests.AsQueryable();

            //res = res.Where(t => t.IdUser == current_id_user);

            res = res.Where(t => t.TestQuestions.Any(tq => tq.IdQuestion == id_question));


            res = res.OrderByDescending(t => t.IdTest);

            return Ok(res.Select(t => new
            {
                id_user = t.IdUser,
                id_test = t.IdTest,
                id_course = t.IdCourse,
                id_semester = t.IdSemester,
                group = t.Group,
                year = t.Year,
                enter_date = t.EnterDate,
                user_name = t.IdUserNavigation.FullName,
                course_name  = t.IdCourseNavigation.Name,
                semester_name = _context.Semesters.SingleOrDefault(s => s.IdSemester == t.IdSemester).Name,
                canEdit = t.IdUser == current_id_user
            })
            .ToList());
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
            public string right_answer { get; set; }
        }

        public class ClientCategory
        {
            public int id_course { get; set; }
            public int id_category { get; set; }
            public string name { get; set; }
        }
    }
}