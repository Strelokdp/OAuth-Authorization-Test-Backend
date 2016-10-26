using Microsoft.Owin;
using Microsoft.Owin.Cors;
using Owin;
using shipmentsAPI.App_Start;
using System.Web.Http;
using System.Configuration;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataHandler.Encoder;
using Microsoft.Owin.Security.Jwt;

[assembly: OwinStartup(typeof(shipmentsAPI.Startup))]
namespace shipmentsAPI
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();

            WebApiConfig.Register(config);

            ConfigureAuthZero(app);

            app.UseCors(CorsOptions.AllowAll);
            app.UseWebApi(config);
        }

        private void ConfigureAuthZero(IAppBuilder app)
        {
            var issuer = "https://" + ConfigurationManager.AppSettings["auth0::Domain"] + "/";
            var audience = ConfigurationManager.AppSettings["auth0::ClientId"];
            var secret = TextEncodings.Base64.Encode(TextEncodings.Base64Url.Decode(ConfigurationManager.AppSettings["auth0::ClientSecret"]));

            app.UseJwtBearerAuthentication(new JwtBearerAuthenticationOptions
            {
                AuthenticationMode = AuthenticationMode.Active,
                AllowedAudiences = new[] { audience },
                IssuerSecurityTokenProviders = new[]
                {
                    new SymmetricKeyIssuerSecurityTokenProvider(issuer, secret)
                }
            });
        }
    }
}