using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuizMakerOnline.Models;

namespace QuizMakerOnline.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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

        //// POST: api/Answers
        //[HttpPost]
        //public async Task<ActionResult<Answers>> PostAnswers(Answers answers)
        //{
        //    _context.Answers.Add(answers);
        //    try
        //    {
        //        await _context.SaveChangesAsync();
        //    }
        //    catch (DbUpdateException)
        //    {
        //        if (AnswersExists(answers.IdQuestion))
        //        {
        //            return Conflict();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return CreatedAtAction("GetAnswers", new { id = answers.IdQuestion }, answers);
        //}

        // POST: api/Answers
        [HttpPost]
        public async Task<IActionResult/*ActionResult<Answers>*/> PostAnswers(ClientAnswer ca)
        {
            Answers answer = new Answers { IdQuestion = ca.id_question, Answer = ca.answer, Points = ca.points, Position = ca.position };

            _context.Answers.Add(answer);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                //if (AnswersExists(answer.IdQuestion))
                //{
                //    return Conflict();
                //}
                //else
                {
                    throw;
                }
            }

            //return CreatedAtAction("GetAnswers", new { id = answer.IdQuestion}, answer);
            return NoContent();
        }


        //// DELETE: api/Answers/5
        //[HttpDelete("{id}")]
        //public async Task<ActionResult<Answers>> DeleteAnswers(int id)
        //{
        //    var answers = await _context.Answers.FindAsync(id);
        //    if (answers == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Answers.Remove(answers);
        //    await _context.SaveChangesAsync();

        //    return answers;
        //}


        // DELETE: api/Answers/5/c
        [HttpDelete("{id_question}/{position}")]
        public async Task<ActionResult<IEnumerable<Object>>> DeleteAnswers(int id_question, string position)
        {
            var answer = _context.Answers.SingleOrDefault(a => a.IdQuestion == id_question && a.Position == position);
            if (answer == null)
            {
                return NotFound();
            }

            _context.Answers.Remove(answer);
            await _context.SaveChangesAsync();


            var poslist = _context.Answers
                .Where(a => a.IdQuestion == id_question)
                .OrderBy(a => a.Position)
                .Select(a => a.Position)                
                .ToArray();

            var pos = 'a';

            foreach (var oldpos in poslist)
            {
                await SetAnswerPosition(id_question, oldpos[0], pos);
                pos++;
            }

            return _context.Answers
                .Where(a => a.IdQuestion == id_question)
                .OrderBy(a => a.Position)
                .Select(a => new
                {
                    id_question = a.IdQuestion,
                    position = a.Position,
                    answer = a.Answer,
                    points = a.Points
                }).ToArray();
        }

        [HttpPut]
        [Route("move")]
        public async Task</*IEnumerable<*/Object> MoveAnswer(ClientAnswer ca, int direction)
        {
            int id_question = ca.id_question;
            var question = _context.Questions.SingleOrDefault(q => q.IdQuestion == id_question);

            var pos1 = ca.position[0];
            var pos2 = (char)(pos1 + direction);

            if (question.RightAnswer[0] == pos1)
            {
                question.RightAnswer = pos2.ToString();
                await _context.SaveChangesAsync();
            }
            else if (question.RightAnswer[0] == pos2)
            {
                question.RightAnswer = pos1.ToString();
                await _context.SaveChangesAsync();
            }

            await SetAnswerPosition(id_question, pos1, 'x');
            await SetAnswerPosition(id_question, pos2, pos1);
            await SetAnswerPosition(id_question, 'x', pos2);

            return new
            {
                answers = _context.Answers
                .Where(a => a.IdQuestion == id_question)
                .OrderBy(a => a.Position)
                .Select(a => new
                {
                    id_question = a.IdQuestion,
                    position = a.Position,
                    answer = a.Answer,
                    points = a.Points
                }).ToArray(),
                right_answer = question.RightAnswer
            };
        }

        private async Task<int> SetAnswerPosition(int id_question, char oldpos, char newpos)
        {
            return await _context.Database.ExecuteSqlCommandAsync(
                "UPDATE answers SET position=@newposition WHERE id_question=@id_question AND position=@position",
                new SqlParameter("@newposition", newpos),
                new SqlParameter("@id_question", id_question),
                new SqlParameter("@position", oldpos)
                );
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
