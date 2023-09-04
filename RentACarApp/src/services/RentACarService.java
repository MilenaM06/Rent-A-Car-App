package services;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONException;
import org.json.JSONObject;

import beans.RentACar;
import beans.User;
import beans.Vehicle;
import dao.ImageDAO;
import dao.OrderDAO;
import dao.RentACarDAO;
import dao.UserDAO;
import dao.VehicleDAO;
import enums.Role;
import utils.JWTUtil;

@Path("/rentACars")
public class RentACarService {

	@Context
	HttpServletRequest request;

	@Context
	ServletContext ctx;

	@PostConstruct
	public void init() {
		if (ctx.getAttribute("rentACarDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("rentACarDAO", new RentACarDAO(contextPath));
		}
		if (ctx.getAttribute("imageDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("imageDAO", new ImageDAO(contextPath));
		}
		if (ctx.getAttribute("vehicleDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("vehicleDAO", new VehicleDAO(contextPath));
		}
		if (ctx.getAttribute("userDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("userDAO", new UserDAO(contextPath));
		}
		if (ctx.getAttribute("orderDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("orderDAO", new OrderDAO(contextPath));
		}
	}

	@GET
	@Path("/getAll")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public List<RentACar> getAll() {
		RentACarDAO rentACarDAO = (RentACarDAO) ctx.getAttribute("rentACarDAO");
		return rentACarDAO.getAll();
	}

	@GET
	@Path("/search")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public List<RentACar> searchObject(@QueryParam("name") String name, @QueryParam("location") String location,
			@QueryParam("vehicleType") String vehicleType, @QueryParam("rating") double rating) {
		RentACarDAO rentACarDAO = (RentACarDAO) ctx.getAttribute("rentACarDAO");
		VehicleDAO vehicleDAO = (VehicleDAO) ctx.getAttribute("vehicleDAO");
		return rentACarDAO.search(name, location, vehicleType, rating, vehicleDAO);
	}

	@POST
	@Path("/add")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response add(RentACar object) throws FileNotFoundException, IOException, JSONException {
		RentACarDAO objectDAO = (RentACarDAO) ctx.getAttribute("rentACarDAO");
		ImageDAO imageDAO = (ImageDAO) ctx.getAttribute("imageDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");

		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null) {
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		} else if (loggedUser.getRole() != Role.ADMINISTRATOR) {
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();
		}
		String fileName = imageDAO.save(object.getLogo());
		if (fileName != "Error") {
			object.setLogo("images/" + fileName);
			objectDAO.add(object);
			return Response.ok("Object is registred").build();
		}
		return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Image can't be saved").build();
	}

	@GET
	@Path("/getById/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public RentACar getById(@PathParam("id") String id) {
		RentACarDAO rentACarDAO = (RentACarDAO) ctx.getAttribute("rentACarDAO");
		return rentACarDAO.getById(id);
	}

	@GET
	@Path("/getByCurrentManagerId")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getByCurrentManagerId() {
		RentACarDAO rentACarDAO = (RentACarDAO) ctx.getAttribute("rentACarDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");

		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.MANAGER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();

		/*
		 * if(rentACarDAO.getByManagerId(loggedUser.getId()) == null) return
		 * Response.ok(new RentACar()).build();
		 */
		return Response.ok(rentACarDAO.getByManagerId(loggedUser.getId())).build();
	}

	@DELETE
	@Path("/{objectId}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response deleteObject(@PathParam("objectId") String objectId) {
		RentACarDAO rentACarDAO = (RentACarDAO) ctx.getAttribute("rentACarDAO");
		VehicleDAO vehicleDAO = (VehicleDAO) ctx.getAttribute("vehicleDAO");
		OrderDAO orderDAO = (OrderDAO) ctx.getAttribute("orderDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");

		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.ADMINISTRATOR)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();

		for (Vehicle vehicle : vehicleDAO.getByRentACarId(objectId)) {
			vehicleDAO.deleteVehicle(vehicle.getId());
		}
		orderDAO.declineDeletedObjectOrders(objectId);
		rentACarDAO.deleteObject(objectId);
		return Response.ok("Objected is deleted").build();
	}

}
