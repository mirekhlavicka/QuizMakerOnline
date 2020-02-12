using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using ceTe.DynamicPDF.Rasterizer;
using Microsoft.AspNetCore.Authorization;
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
                    fileName = getNextFileName(pathToSave, fileName);
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var relativeURL = Path.Combine(folderName, fileName).Replace("\\", "/");

                    Directory.CreateDirectory(Path.GetDirectoryName(fullPath));

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    return Ok(new
                    {
                        latex = getLatexImage(fileName),
                        relativeURL
                    });
                }
                else
                {
                    return BadRequest();
                }
            }
            catch
            {
                return StatusCode(500, "Internal server error");
            }
        }

        private string getNextFileName(string pathToSave, string fileName)
        {
            string extension = Path.GetExtension(fileName);

            int i = 0;
            while (System.IO.File.Exists(Path.Combine(pathToSave, fileName)))
            {
                if (i == 0)
                    fileName = fileName.Replace(extension, "(" + ++i + ")" + extension);
                else
                    fileName = fileName.Replace("(" + i + ")" + extension, "(" + ++i + ")" + extension);
            }

            return fileName;
        }

        [HttpGet]
        [Route("PdfRasterize/{id_question}/{fileName}")]
        //[AllowAnonymous]
        public IActionResult PdfRasterize(int id_question, string fileName)
        {
            var pathToPDF = Path.Combine(Directory.GetCurrentDirectory(), "StaticFiles\\Images\\" + id_question + "\\" + fileName).ToLower();
            var pathToPNG = Path.Combine(Directory.GetCurrentDirectory(), "StaticFiles\\Images\\" + id_question + "\\pdf2img_" + fileName.Replace(".pdf", ".png")).ToLower(); 


            if (!System.IO.File.Exists(pathToPNG))
            {
                PdfRasterizer rasterizer = new PdfRasterizer(pathToPDF);
                rasterizer.Draw(pathToPNG, ImageFormat.Png, ImageSize.Dpi300);
                rasterizer.Dispose();
            }

            return PhysicalFile(pathToPNG, "image/png");
        }


        public static string getLatexImage(string fileName)
        {
            return String.Format(@"\begin{{figure}}[h!]
\includegraphics[width=0.5\linewidth]{{{0}}}
\centering
\end{{figure}}
", fileName.Replace("\\", "/"));
        }
    }
}