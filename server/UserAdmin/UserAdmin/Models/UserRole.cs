using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace UserAdmin.Models
{

    public class UserRole
    {
        // definition of the UserRole Junction Table
        public int UserId { get; set; }
        public int RoleId { get; set; }

        // adds virtual columns to the UserRole table
        // the User column pulls data from the User table and the Role column pulls data from the Role table
        public virtual User User { get; set; }
        public virtual Role Role { get; set; }
    }
}