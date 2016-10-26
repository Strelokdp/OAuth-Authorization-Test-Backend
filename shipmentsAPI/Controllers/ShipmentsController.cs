using shipmentsAPI.Models;
using System.Web.Http;

namespace shipmentsAPI.Controllers
{
    [Authorize]
    public class ShipmentsController : ApiController
    {
        public IHttpActionResult Get()
        {
            return Ok(Shipment.Create());
        }
    }
}
