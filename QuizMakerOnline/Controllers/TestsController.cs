using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Xsl;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using QuizMakerOnline.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IO.Compression;

namespace QuizMakerOnline.Controllers
{
    [Route("api/[controller]")] ///[action]
    [ApiController]
    [Authorize]
    public class TestsController : ControllerBase
    {
        private readonly QuizMakerContext _context;

        private IHostingEnvironment _env;
        public TestsController(IHostingEnvironment env, QuizMakerContext context)
        {
            _env = env;
            _context = context;

        }

        [HttpGet]
        public ActionResult<IEnumerable<Object>> GetTests(int? id_course)
        {
            var current_id_user = Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var res = _context.Tests.AsQueryable();

            res = res.Where(t => t.IdUser == current_id_user);

            if (id_course != null && id_course != 0)
            {
                res = res.Where(t => t.IdCourse == id_course);
            }


            res = res.OrderByDescending(t => t.IdTest);

            return Ok(res.Select(t => new
            {
                id_user = t.IdUser,
                id_test = t.IdTest,
                id_course = t.IdCourse,
                id_semester = t.IdSemester,
                group = t.Group,
                year = t.Year,
                enter_date = t.EnterDate
            })
            .ToList());
        }

        [HttpGet("{id_test}")]
        public ActionResult<Object> GetTestDetail(int id_test)
        {
            var current_id_user = Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var res = _context.Tests.AsQueryable();

            res = res.Where(t => t.IdUser == current_id_user && t.IdTest == id_test);

            return Ok(res.Select(t => new
            {
                id_user = t.IdUser,
                id_test = t.IdTest,
                id_course = t.IdCourse,
                id_semester = t.IdSemester,
                group = t.Group,
                year = t.Year,
                enter_date = t.EnterDate,
                questions = t.TestQuestions
                .OrderBy(tq => tq.Order)
                .Select(tq => new
                {
                    id_question = tq.IdQuestionNavigation.IdQuestion,
                    id_category = tq.IdQuestionNavigation.IdCategory,
                    id_user = tq.IdQuestionNavigation.IdUser,
                    id_question_type = tq.IdQuestionNavigation.IdQuestionType,
                    id_question_difficulty = tq.IdQuestionNavigation.IdQuestionDifficulty,
                    points = tq.IdQuestionNavigation.Points,
                    question = tq.IdQuestionNavigation.Question,
                    right_answer = tq.IdQuestionNavigation.RightAnswer,
                    solution = tq.IdQuestionNavigation.Solution,
                    enter_date = tq.IdQuestionNavigation.EnterDate,
                    state = tq.IdQuestionNavigation.State,
                    canEdit = (current_id_user == 1 || current_id_user == tq.IdQuestionNavigation.IdUser),
                    answers = tq.IdQuestionNavigation.Answers
                    .OrderBy(a => a.Position)
                    .Select(a => new
                    {
                        id_question = a.IdQuestion,
                        position = a.Position,
                        answer = a.Answer,
                        points = a.Points
                    })
                })
            }).SingleOrDefault());
        }

        [HttpPut("questions/{id_test}/{id_question}")]
        //[Route("questions")]
        public IActionResult AddQuestion(int id_test, int id_question)
        {
            Tests test = _context.Tests.Include(t => t.TestQuestions).SingleOrDefault(t => t.IdTest == id_test);

            if (test == null)
            {
                return BadRequest();
            }

            int order = 1;

            if (test.TestQuestions.Any())
            {
                order = test.TestQuestions.Max(tq => tq.Order) + 1;
            }

            test.TestQuestions.Add(new TestQuestions
            {
                IdQuestion = id_question,
                IdTest = id_test,
                Order = order,
                RightAnswer = "?"
            }); ;

            _context.SaveChanges();

            return NoContent();
        }

        [HttpDelete("questions/{id_test}/{id_question}")]
        public IActionResult DelQuestion(int id_test, int id_question)
        {
            Tests test = _context.Tests.Include(t => t.TestQuestions).SingleOrDefault(t => t.IdTest == id_test);

            if (test == null)
            {
                return BadRequest();
            }

            var testQuestion = test.TestQuestions.SingleOrDefault(tq => tq.IdQuestion == id_question);

            if (testQuestion == null)
            {
                return BadRequest();
            }


            test.TestQuestions.Remove(testQuestion);

            _context.SaveChanges();

            return NoContent();
        }

        [HttpPut("swapquestions/{id_test}/{id_question1}/{id_question2}")]
        public IActionResult SwapQuestions(int id_test, int id_question1, int id_question2)
        {
            Tests test = _context.Tests.Include(t => t.TestQuestions).SingleOrDefault(t => t.IdTest == id_test);

            if (test == null)
            {
                return BadRequest();
            }

            var testQuestion1 = test.TestQuestions.SingleOrDefault(tq => tq.IdQuestion == id_question1);

            if (testQuestion1 == null)
            {
                return BadRequest();
            }

            var testQuestion2 = test.TestQuestions.SingleOrDefault(tq => tq.IdQuestion == id_question2);

            if (testQuestion2 == null)
            {
                return BadRequest();
            }

            var tmp = testQuestion1.Order;
            testQuestion1.Order = testQuestion2.Order;
            testQuestion2.Order = tmp;

            _context.SaveChanges();

            return NoContent();
        }

        // PUT: api/tests  bez /5
        [HttpPut/*("{id}")*/]
        public IActionResult PutTest(ClientTest ct)
        {
            Tests test = _context.Tests.SingleOrDefault(t => t.IdTest == ct.id_test);

            if (test == null)
            {
                return BadRequest();
            }

            test.IdSemester = ct.id_semester;
            test.IdCourse = ct.id_course;
            test.Group = ct.group;
            test.Year = ct.year;

            _context.SaveChanges();

            return NoContent();
        }

        [HttpPost]
        public object PostTest(ClientTest ct)
        {
            var current_id_user = Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            Tests t = new Tests
            {
                IdSemester = ct.id_semester,
                IdCourse = ct.id_course,
                EnterDate = DateTime.Now,
                Group = ct.group,
                Year  = ct.year,
                IdUser = current_id_user                
            };

            _context.Tests.Add(t);

            _context.SaveChanges();

            if (String.IsNullOrEmpty(t.Year))
            {
                t.Year = String.Format("Test {0}", t.IdTest);
                _context.SaveChanges();
            }

            return new
            {
                id_test = t.IdTest,
                id_course = t.IdCourse,
                id_semester = t.IdSemester,
                group = t.Group,
                year = t.Year,
                enter_date = t.EnterDate,
                questions = t.TestQuestions
                    .Select(q => new
                    {
                        id_question = q.IdQuestion
                    })
            };
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTest(int id)
        {
            var test = _context.Tests.Find(id);
            if (test == null)
            {
                return NotFound();
            }

            _context.Tests.Remove(test);

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

        // GET: api/tests/semesters
        [HttpGet()]
        [Route("semesters")]
        public Object GetSemesters()
        {
            return _context
                .Semesters
                .OrderByDescending(s => s.IdSemester)
                .Select(s => new
                {
                    id = s.IdSemester,
                    name = s.Name//.ToLower()
                })
                .ToDictionary(s => s.id, s => s.name);
        }

        // GET: api/tests/courses
        [HttpGet()]
        [Route("courses")]
        public Object GetMyCourses()
        {
            var current_id_user = Int32.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            return _context
                .Courses
                .Where(c => _context.UserCourseRights.Any(ur => ur.IdUser == current_id_user && ur.IdCourse == c.IdCourse && (ur.Rights & 4) != 0))
                .Select(c => new
                {
                    id = c.IdCourse,
                    name = c.Name
                })
                .ToDictionary(c => c.id, c => c.name);
        }

        //not used
        [HttpGet]
        [Route("Download")]
        public IActionResult Download(int style, bool showPoints, bool showSolution, string idList)
        {
            var questions = idList
                .Split(',')
                .Select(s => Int32.Parse(s))
                .Select(id => _context.Questions
                    .Include(q => q.Answers)
                    .Include(q => q.IdCategoryNavigation).ThenInclude(c => c.IdCourseNavigation)
                .SingleOrDefault(q => q.IdQuestion == id))
                .ToArray();

            XElement xml = new XElement("Tests", 
                new XAttribute("course_code", questions[0].IdCategoryNavigation.IdCourseNavigation.Name),
                new XAttribute("group", "A"),
                new XAttribute("showPoints", showPoints),
                new XAttribute("showSolution", showSolution),
                    questions.Select(q => new XElement("Questions", 
                        new XAttribute("question", q.Question),
                        new XAttribute("id_question_type", q.IdQuestionType),
                        new XAttribute("solution", q.Solution),
                        new XAttribute("points", q.Points),
                        q.Answers.Select(a => new XElement("Answers",
                            new XAttribute("position", a.Position),
                            new XAttribute("answer", a.Answer),
                            new XAttribute("points", a.Points)
                        ))
                    ))
                );


            MemoryStream stream = TransformXMLToTex(xml, "ToLaTeX" + style);

            if (stream == null)
                return NotFound();

            return File(stream, "application/octet-stream", "test.tex");
        }

        [HttpGet]
        [Route("DownloadTestLaTeX")]
        public IActionResult DownloadTestLaTeX(int id_test, int style, bool showPoints, bool showSolution, byte infoBarItems)
        {
            MemoryStream stream = CreateTestSteam(id_test, style, showPoints, showSolution, infoBarItems);

            if (stream == null)
                return NotFound();

            return File(stream, "application/octet-stream", String.Format("test_{0}.tex", id_test));
        }


        private MemoryStream CreateTestSteam(int id_test, int style, bool showPoints, bool showSolution, byte infoBarItems)
        {
            var test = _context
                .Tests
                .Include(t => t.TestQuestions)
                .ThenInclude(tq => tq.IdQuestionNavigation)
                .ThenInclude(q => q.Answers)
                .Include(t => t.IdCourseNavigation)
                .SingleOrDefault(t => t.IdTest == id_test);

            string[] barItems =
                {
                    id_test.ToString(),
                    test.IdCourseNavigation.Name,
                    _context.Semesters.Single(s => s.IdSemester == test.IdSemester).Name,
                    test.Year.Replace("_", " "),
                    test.Group.Replace("_", " "),
                    test.EnterDate.ToString("d")
                };

            string header = String.Join("~\\textbar~",
            barItems
                .Select((item, i) => new { item = item, pos = i })
                .Where(bi => IsBitSet(infoBarItems, bi.pos))
                .Select(bi => bi.item));

            XElement xml = new XElement("Tests",
                new XAttribute("header", header),
                new XAttribute("course_code", test.IdCourseNavigation.Name),
                new XAttribute("group", test.Group),
                new XAttribute("showPoints", showPoints),
                new XAttribute("showSolution", showSolution),
                    test.TestQuestions
                    .OrderBy(tq => tq.Order)
                    .Select(tq => tq.IdQuestionNavigation)
                    .Select(q => new XElement("Questions",
                        new XAttribute("question", q.Question),
                        new XAttribute("id_question_type", q.IdQuestionType),
                        new XAttribute("solution", q.Solution),
                        new XAttribute("points", q.Points),
                        q.Answers.OrderBy(a => a.Position).Select(a => new XElement("Answers",
                            new XAttribute("position", a.Position),
                            new XAttribute("answer", a.Answer),
                            new XAttribute("points", a.Points)
                        ))
                    ))
                );


            MemoryStream stream = TransformXMLToTex(xml, "ToLaTeX" + style);

            return stream;
        }

        private bool IsBitSet(byte b, int pos)
        {
            return (b & (1 << pos)) != 0;
        }


        private MemoryStream TransformXMLToTex(XElement inputXml, string xsltName)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            XslCompiledTransform transform = new XslCompiledTransform();
            var sPath = System.IO.Path.Combine(_env.WebRootPath, @"xslt\" + xsltName + "_UTF8.xslt"); //"_UTF8.xslt"
            transform.Load(sPath);

            MemoryStream stream = new MemoryStream();

            using (XmlReader reader = inputXml.CreateReader())
            {
                transform.Transform(reader, null, stream);
                stream.Seek(0, SeekOrigin.Begin);
            }
            return stream;
        }

        [HttpGet]
        [Route("DownloadImages")]
        public IActionResult DownloadImages()
        {

            var outStream = new MemoryStream();

            using (var archive = new ZipArchive(outStream, ZipArchiveMode.Create, true))
            {
                AddQuestionFolderToZip(3225, archive);
                AddQuestionFolderToZip(1619, archive);

                using (Stream fileStreamInZip = archive.CreateEntry("test_660.tex").Open())
                    CreateTestSteam(660, 1, true, false, 254 ).CopyTo(fileStreamInZip);
            }

            outStream.Seek(0, SeekOrigin.Begin);
            return File(outStream, "application/octet-stream", "test_660.zip");
        }

        private void AddQuestionFolderToZip(int id_question, ZipArchive archive)
        {
            var folderName = Path.Combine("StaticFiles", String.Format("Images\\{0}\\", id_question));
            var inputDirectory = Path.Combine(Directory.GetCurrentDirectory(), folderName);

            foreach (var filePath in System.IO.Directory.GetFiles(inputDirectory, "*.*", System.IO.SearchOption.AllDirectories))
            {
                var relativePath = id_question.ToString() + "\\" + filePath.Replace(inputDirectory, string.Empty);
                using (Stream fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read))
                using (Stream fileStreamInZip = archive.CreateEntry(relativePath).Open())
                    fileStream.CopyTo(fileStreamInZip);
            }
        }


        public class ClientTest
        {
            public int id_test { get; set; }
            public int id_course { get; set; }
            public int id_semester { get; set; }
            public string group { get; set; }
            public string year { get; set; }
        }
    }
}