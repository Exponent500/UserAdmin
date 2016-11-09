using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace UserAdmin.Models
{
    public class Role
    {
        //primary key
        public int RoleId { get; set; }

        // other columns
        public string RoleType { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }

        // adds a virtual column to this table, named UserRole, which pulls data from the UserRole table
        public virtual ICollection<UserRole> UserRole { get; set; }
    }
}