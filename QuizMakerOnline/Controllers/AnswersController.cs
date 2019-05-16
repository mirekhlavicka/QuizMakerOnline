using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizMakerOnline.Models;

namespace QuizMakerOnline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswersController : ControllerBase
    {
        private readonly QuizMakerContext _context;

        public AnswersController(QuizMakerContext context)
        {
            _context = context;
        }

        // GET: api/Answers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Answers>>> GetAnswers()
        {
            return await _context.Answers.ToListAsync();
        }

        // GET: api/Answers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Answers>> GetAnswers(int id)
        {
            var answers = await _context.Answers.FindAsync(id);

            if (answers == null)
            {
                return NotFound();
            }

            return answers;
        }

        //// PUT: api/Answers/5
        //[HttpPut("{id}")]
        //public async Task<IActionResult> PutAnswers(int id, Answers answers)
        //{
        //    if (id != answers.IdQuestion)
        //    {
        //        return BadRequest();
        //    }

        //    _context.Entry(answers).State = EntityState.Modified;

        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!AnswersExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return NoContent();
        //}

        // PUT: api/Answers    no /5
        [HttpPut/*("{id}")*/]
        public async Task<IActionResult> PutAnswers(ClientAnswer ca)
        {
            Answers answer = _context.Answers.SingleOrDefault(a => a.IdQuestion == ca.id_question && a.Position == ca.position);

            if (answer == null)
            {
                return BadRequest();
            }

            answer.Answer = ca.answer;
            answer.Points = ca.points;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                //if (!AnswersExists(id))
                //{
                //    return NotFound();
                //}
                //else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Answers
        [HttpPost]
        public async Task<ActionResult<Answers>> PostAnswers(Answers answers)
        {
            _context.Answers.Add(answers);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (AnswersExists(answers.IdQuestion))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetAnswers", new { id = answers.IdQuestion }, answers);
        }

        // DELETE: api/Answers/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<Answers>> DeleteAnswers(int id)
        {
            var answers = await _context.Answers.FindAsync(id);
            if (answers == null)
            {
                return NotFound();
            }

            _context.Answers.Remove(answers);
            await _context.SaveChangesAsync();

            return answers;
        }

        private bool AnswersExists(int id)
        {
            return _context.Answers.Any(e => e.IdQuestion == id);
        }

        public class ClientAnswer
        {
            public int id_question { get; set; }
            public string position { get; set; }
            public string answer { get; set; }
            public int points { get; set; }
        }

    }
}
