using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizMakerOnline.Models;
using Microsoft.AspNetCore.Authorization;

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
        public IEnumerable<Object> GetQuestions(int? id_category, int? id_difficulty, int? id_user, int? id_type, int? state)
        {
            var res = _context.Questions.AsQueryable();

            if (id_category != null && id_category != 0)
            {
                res = res.Where(q => q.IdCategory == id_category.Value);
            }

            if (id_difficulty != null && id_difficulty != 0)
            {
                res = res.Where(q => q.IdQuestionDifficulty == id_difficulty.Value);
            }

            if (id_user != null && id_user != 0)
            {
                res = res.Where(q => q.IdUser == id_user.Value);
            }

            if (id_type != null && id_type != 0)
            {
                res = res.Where(q => q.IdQuestionType == id_type.Value);
            }

            if (state != null && state != -1)
            {
                res = res.Where(q => q.State == state.Value);
            }

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
            var res = _context.Courses;


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
    }
}