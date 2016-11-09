using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using UserAdmin.Models;

namespace UserAdmin.Data
{
    public class UserAdminDataContext : DbContext
    {
        // Allows entity framework to either create the database named "UserAdmin", if it doesn't exist already
        // or entity framework will create it if it doesn't already exist
        public UserAdminDataContext() : base("UserAdmin")
        {

        } 

        // Allows entity framework to create these tables within the database specified above. Important to 
        // give these attributes a pluralized version of the classes they represent.
        // For example, if setting up a Role table, call the associated attribute "Roles"
        public IDbSet<Role>Roles { get; set; }
        public IDbSet<User>Users { get; set; }
        public IDbSet<UserRole> UserRoles { get; set; }

        // Overrides Entity Framework's default Junction table and Junction table Foreign Key names
        // and allows us to create our own table and Foreign key names
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            // sets up the compound key for the UserRole table
            // says the combination of the UserId and RoleId equals the primary key of the
            // UserRole table
            modelBuilder.Entity<UserRole>()
               .HasKey(ur => new { ur.UserId, ur.RoleId });

            // a role has many userroles
            modelBuilder.Entity<Role>()
                .HasMany(r => r.UserRole)
                .WithRequired(ur => ur.Role)
                .HasForeignKey(ur => ur.RoleId);

            // a user has many userroles 
            modelBuilder.Entity<User>()
                        .HasMany(u => u.UserRole)
                        .WithRequired(ur => ur.User)
                        .HasForeignKey(ur => ur.UserId);
        }
    }
}