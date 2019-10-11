using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace QuizMakerOnline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        [HttpPost("{id_question}"), DisableRequestSizeLimit]
        public IActionResult Upload(int id_question)
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("StaticFiles", "Images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if (file.Length > 0)
                {
                    var fileName = Path.Combine(id_question.ToString(), ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"'));
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var relativeURL = Path.Combine(folderName, fileName).Replace("\\", "/");

                    Directory.CreateDirectory(Path.GetDirectoryName(fullPath));

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    return Ok(new
                    {
                        latex = String.Format(@"\begin{{figure}}[h!]
\includegraphics[width=0.75\linewidth]{{{0}}}
\centering
\end{{figure}}
",fileName.Replace("\\", "/")),
                        relativeURL
                    });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
    }
}