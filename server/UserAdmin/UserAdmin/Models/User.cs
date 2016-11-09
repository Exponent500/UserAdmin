using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UserAdmin.Models
{
    public class User
    {
        //primary key
        public int UserId { get; set; }

        //other columns
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailAddress { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public DateTime DateCreated { get; set; }

        // adds a virtual column to this table, named UserRole, which pulls data from the UserRole table
        public virtual ICollection<UserRole> UserRole { get; set; }
    }
}