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

namespace QuizMakerOnline.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TestsController : ControllerBase
    {
        private IHostingEnvironment _env;
        public TestsController(IHostingEnvironment env)
        {
            _env = env;
        }

        [HttpGet]
        public IActionResult Download(bool? showPoints)
        {
            XElement x = new XElement("test", "Testing 1 - 2 - 3 ěščřžýáíé " + (showPoints ?? false));

            // convert string to stream
            //var enc1250 = CodePagesEncodingProvider.Instance.GetEncoding(1250);
            //byte[] byteArray = /*Encoding.Default*/enc1250.GetBytes(TransformXMLToTex(x));
            //MemoryStream stream = new MemoryStream(byteArray);

            MemoryStream stream = TransformXMLToTex(x);

            if (stream == null)
                return NotFound(); // returns a NotFoundResult with Status404NotFound response.

            return File(stream, "application/octet-stream", "test.tex"); // returns a FileStreamResult
        }

        private MemoryStream TransformXMLToTex(XElement inputXml)
        {
            Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
            XslCompiledTransform transform = new XslCompiledTransform();
            var sPath = System.IO.Path.Combine(_env.WebRootPath, @"xslt\test.xslt"); 
            transform.Load(sPath);

            //StringWriter results = new StringWriter();

            MemoryStream stream = new MemoryStream();

            using (XmlReader reader = inputXml.CreateReader())
            {
                transform.Transform(reader, null, /*results*/stream);
                stream.Seek(0, SeekOrigin.Begin);
            }
            return stream/*results.ToString()*/;
        }
    }
}