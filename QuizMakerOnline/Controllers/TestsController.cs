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

namespace QuizMakerOnline.Controllers
{
    [Route("api/[controller]/[action]")]
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

        private MemoryStream TransformXMLToTex(XElement inputXml, string xsltName)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            XslCompiledTransform transform = new XslCompiledTransform();
            var sPath = System.IO.Path.Combine(_env.WebRootPath, @"xslt\" + xsltName + ".xslt"); 
            transform.Load(sPath);

            MemoryStream stream = new MemoryStream();

            using (XmlReader reader = inputXml.CreateReader())
            {
                transform.Transform(reader, null, stream);
                stream.Seek(0, SeekOrigin.Begin);
            }
            return stream;
        }
    }
}