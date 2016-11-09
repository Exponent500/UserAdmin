using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using UserAdmin.Data;

namespace UserAdmin
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            // cam provided this. Somehow it makes it so you can make updates to the database directly and entity framework will make the mods without having to re-scaffold
            Database.SetInitializer<UserAdminDataContext>(null);
        }
    }
}
