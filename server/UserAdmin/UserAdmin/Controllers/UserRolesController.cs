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
    public class UserRolesController : ApiController
    {
        private UserAdminDataContext db = new UserAdminDataContext();

        // GET: api/UserRoles
        public IQueryable<UserRole> GetUserRoles()
        {
            return db.UserRoles;
        }

        // GET: api/UserRoles/5
        [ResponseType(typeof(UserRole))]
        public IHttpActionResult GetUserRole(int id)
        {
            UserRole userRole = db.UserRoles.Find(id);
            if (userRole == null)
            {
                return NotFound();
            }

            return Ok(userRole);
        }

        // GET: api/userroles
        // returns all users with their role ids and role description
        //[Route("api/userroles")]
        //public IHttpActionResult GetUserRoles()
        //{
        //    var userroles = db.UserRoles;

        //    if (userroles == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(userroles);
        //    //return Ok(userroles.Select(ur => new
        //    //{
        //    //    ur.RoleId,
        //    //    ur.Role.RoleType
        //    //}));
        //}

        [HttpGet, Route("api/UserRoles/join"), ResponseType(typeof(IQueryable<UserRole>))]
        public IHttpActionResult GetUsersAndRoles()
        {

            //SELECT u.FirstName, u.LastName, u.UserId, r.RoleType, r.RoleId
            //FROM Users u
            //LEFT JOIN UserRoles ur ON u.UserId = ur.UserId
            //LEFT JOIN Roles r ON r.RoleId = ur.RoleId

            //var innerJoined = from users in db.Users
            //                  join userroles in db.UserRoles on users.UserId equals userroles.UserId
            //                  // understand why this join works
            //                  join roles in db.Roles on userroles.RoleId equals roles.RoleId into joinRole
            //                  from roles in joinRole.DefaultIfEmpty()
            //                  select new
            //                  {
            //                      userName = users.FirstName + " " + users.LastName,
            //                      userId = users.UserId,
            //                      roleId = roles.RoleId,
            //                      roleType = roles.RoleType
            //                  };

            var resultSet = from users in db.Users
                              join userroles in db.UserRoles on users.UserId equals userroles.UserId into resultset1
                              from results1 in resultset1.DefaultIfEmpty() // DefaultIfEmpty() will produce a value even if the source is empty 
                              join roles in db.Roles on results1.RoleId equals roles.RoleId into resultset2
                              from results2 in resultset2.DefaultIfEmpty()
                              select new
                              {
                                  userName = users.FirstName + " " + users.LastName,
                                  userId = users.UserId,
                                  roleId = (int?)results2.RoleId, //(int?) allows an int to be nullable.
                                  roleType =  results2.RoleType,
                                  dateCreated = (DateTime?)results2.DateCreated
                              };

            //var innerJoined = from users in db.Users
            //                  select new
            //                  {
            //                      userName = users.FirstName + " " + users.LastName,
            //                      userId = users.UserId,
            //                      userRole = users.UserRole,
            //                      dateCreated = (DateTime?)users.DateCreated
            //                  };

            //var innerJoined = from users in db.Users
            //                  join userroles in db.UserRoles on users.UserId equals userroles.UserId into resultset1
            //                  from results1 in resultset1.DefaultIfEmpty() // DefaultIfEmpty() will produce a value even if the source is empty 
            //                  join roles in db.Roles on results1.RoleId equals roles.RoleId into resultset2
            //                  from results2 in resultset2.DefaultIfEmpty()
            //                  select new
            //                  {
            //                      userName = users.FirstName + " " + users.LastName,
            //                      userId = users.UserId,
            //                      userRole = users.UserRole,
            //                      roleType = results2.RoleType,
            //                      dateCreated = (DateTime?)users.DateCreated
            //                  };

            return Ok(resultSet);
        }

        // PUT: api/UserRoles/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUserRole(int id, UserRole userRole)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userRole.UserId)
            {
                return BadRequest();
            }

            db.Entry(userRole).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserRoleExists(id))
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

        // POST: api/UserRoles
        [ResponseType(typeof(UserRole))]
        public IHttpActionResult PostUserRole(UserRole userRole)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserRoles.Add(userRole);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (UserRoleExists(userRole.UserId))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = userRole.UserId }, userRole);
        }

        // DELETE: api/UserRoles/5
        [ResponseType(typeof(UserRole))]
        public IHttpActionResult DeleteUserRole(int id)
        {
            UserRole userRole = db.UserRoles.Find(id);
            if (userRole == null)
            {
                return NotFound();
            }

            db.UserRoles.Remove(userRole);
            db.SaveChanges();

            return Ok(userRole);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserRoleExists(int id)
        {
            return db.UserRoles.Count(e => e.UserId == id) > 0;
        }
    }
}