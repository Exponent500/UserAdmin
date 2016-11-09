using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using UserAdmin.Data;
using UserAdmin.Models;

namespace UserAdmin.Controllers
{
    public class UsersController : ApiController
    {
        private UserAdminDataContext db = new UserAdminDataContext();

        // GET: api/Users
        public IQueryable<User> GetUsers()
        {
            return db.Users;
        }

        // GET: api/Users/5
        //[ResponseType(typeof(User))]
        //public IHttpActionResult GetUser(int id)
        //{
        //    User user = db.Users.Find(id);
        //    if (user == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(user);
        //}

        // GET: api/Users/5/roles
        // returns just the roleid and the role of the user
        [Route("api/users/{id}/roles")]
        public IHttpActionResult GetUserRoles(int id)
        {
            var user = db.Users.Find(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user.UserRole.Select(ur => new
            {
                ur.RoleId,
                ur.Role.RoleType
            }));
        }

        // GET: api/Users/roles
        // returns all users and their roles
        [Route("api/users/roles")]
        public IHttpActionResult GetUserRolesOfAllUsers()
        {

            var resultSet = db.Users.Select(user => new
            {
                user.DateCreated,
                user.EmailAddress,
                user.FirstName,
                user.LastName,
                user.UserId,
                user.UserName,
                Roles = user.UserRole.Select(ur => new
                {
                    ur.RoleId,
                    ur.Role.RoleType
                })
            });

            return Ok(resultSet);

        }

        // GET: api/Users/5
        // returns user plus array of roles
        [ResponseType(typeof(User))]
        public IHttpActionResult GetUser(int id)
        {
            User user = db.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                user.DateCreated,
                user.EmailAddress,
                user.FirstName,
                user.LastName,
                user.UserId,
                user.UserName,
                Roles = user.UserRole.Select(ur => new
                {
                    ur.RoleId,
                    ur.Role.RoleType
                })
            });
        }

        //GET: /api/users/search?emailaddress={emailaddress}
        [HttpGet, Route("api/users/search"), ResponseType(typeof(IQueryable<User>))]
        public IHttpActionResult SearchEmailAddress(string emailaddress)
        {

            // Query that returns all users with an email address that matches the search term
            var resultSet = from user in db.Users
                            where user.EmailAddress.Equals(emailaddress)
                            select user;

            // check if query returned any results, if not, throw up a NotFound
            if (!resultSet.Any())
            {
                return NotFound();
            }

            // return query result
            return Ok(resultSet);
        }

        //GET: /api/users/search?username={username}
        [HttpGet, Route("api/users/search"), ResponseType(typeof(IQueryable<User>))]
        public IHttpActionResult SearchUserName(string username)
        {

            // Query that returns all users with a username that matches the search term
            var resultSet = from user in db.Users
                            where user.UserName.Equals(username)
                            select user;

            // check if query returned any results, if not, throw up a NotFound
            if (!resultSet.Any())
            {
                return NotFound();
            }

            // return query result
            return Ok(resultSet);
        }

        //GET: /api/users/search?username={username}&password={password}
        [HttpGet, Route("api/users/search"), ResponseType(typeof(IQueryable<User>))]
        public IHttpActionResult SearchUserNameAndPassword(string username, string password)
        {

            // Query that returns all users with a username and password that matches the search terms
            var resultSet = from user in db.Users
                            where user.UserName.Equals(username) && user.Password.Equals(password)
                            select user;

            // check if query returned any results, if not, throw up a NotFound
            if (!resultSet.Any())
            {
                return NotFound();
            }

            // return query result
            return Ok(resultSet);
        }

        // PUT: api/Users/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUser(int id, User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != user.UserId)
            {
                return BadRequest();
            }

            db.Entry(user).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Users
        [ResponseType(typeof(User))]
        public IHttpActionResult PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Users.Add(user);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = user.UserId }, user);
        }

        // DELETE: api/Users/5
        [ResponseType(typeof(User))]
        public IHttpActionResult DeleteUser(int id)
        {
            User user = db.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            db.Users.Remove(user);
            db.SaveChanges();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(int id)
        {
            return db.Users.Count(e => e.UserId == id) > 0;
        }
    }
}