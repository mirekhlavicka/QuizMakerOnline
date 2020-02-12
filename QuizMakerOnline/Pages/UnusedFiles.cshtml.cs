using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using QuizMakerOnline.Controllers;
using QuizMakerOnline.Models;

namespace QuizMakerOnline
{
    public class UnusedFilesModel : PageModel
    {
        private readonly QuizMakerOnline.Models.QuizMakerContext _context;

        public UnusedFilesModel(QuizMakerOnline.Models.QuizMakerContext context)
        {
            _context = context;
        }

        public IList<FileInfo> Files { get; set; }

        [BindProperty]
        public List<string> SelectedFiles { get; set; } = new List<string>();

        public string FileUrl(string f)
        {
            return f.Replace(Path.Combine(Directory.GetCurrentDirectory(), "StaticFiles\\Images\\"), "").Replace("\\", "/"); ;
        }

        public void OnGet()
        {
            var res = Directory
                .GetFiles(Path.Combine(Directory.GetCurrentDirectory(), "StaticFiles\\Images"), "*.*", SearchOption.AllDirectories)
                .Where(f => !f.Contains("pdf2img_") && !IsUsed(f))
                .Select(f => new FileInfo(f))
                .ToList();


            /*var pdf2img = res
                .Where(f => f.EndsWith(".pdf"))
                .Select(f =>
                {
                    var fif = new FileInfo(f);
                    return f.Replace(fif.Name, "pdf2img_" + fif.Name).Replace(".pdf", ".png");
                })
                .Where(f => System.IO.File.Exists(f))
                .ToList();
            

            res.AddRange(pdf2img);*/

            Files = res.OrderByDescending(f => f.LastWriteTime).ToList();
        }

        public void OnPost()
        {
            foreach (var f in SelectedFiles)
            {
                if (f.EndsWith(".pdf"))
                {
                    var fif = new FileInfo(f);
                    var pdf2img = f.Replace(fif.Name, "pdf2img_" + fif.Name).Replace(".pdf", ".png");
                    if (System.IO.File.Exists(pdf2img))
                    {
                        System.IO.File.Delete(pdf2img);
                    }
                }

                System.IO.File.Delete(f);
            }

            DelEmptyDirectory(Path.Combine(Directory.GetCurrentDirectory(), "StaticFiles\\Images"));

            OnGet();
        }

        private static void DelEmptyDirectory(string startLocation)
        {
            foreach (var directory in Directory.GetDirectories(startLocation))
            {
                DelEmptyDirectory(directory);
                if (Directory.GetFiles(directory).Length == 0 &&
                    Directory.GetDirectories(directory).Length == 0)
                {
                    Directory.Delete(directory, false);
                }
            }
        }

        public bool IsUsed(string f)
        {
            f = FileUrl(f);

            return 
                _context.Questions.Any(q => q.Solution.Contains(f) || q.Question.Contains(f)) ||
                _context.Answers.Any(a => a.Answer.Contains(f));
        }
    }
}
