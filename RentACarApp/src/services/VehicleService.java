package services;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.User;
import beans.Vehicle;
import dao.ImageDAO;
import dao.OrderDAO;
import dao.RentACarDAO;
import dao.UserDAO;
import dao.VehicleDAO;
import enums.Role;
import utils.JWTUtil;

@Path("/vehicles")
public class VehicleService {
	
	@Context
	HttpServletRequest request;
	
	@Context
	ServletContext ctx;

	@PostConstruct
	public void init() {
		if (ctx.getAttribute("vehicleDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("vehicleDAO", new VehicleDAO(contextPath));
		}
		if (ctx.getAttribute("imageDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("imageDAO", new ImageDAO(contextPath));
		}
		if (ctx.getAttribute("orderDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("orderDAO", new OrderDAO(contextPath));
		}
		if (ctx.getAttribute("userDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("userDAO", new UserDAO(contextPath));
		}
		if (ctx.getAttribute("rentACarDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("rentACarDAO", new RentACarDAO(contextPath));
		}
	}

	@GET
	@Path("/getAll")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public List<Vehicle> getAll() {
		VehicleDAO vehicleDAO = (VehicleDAO) ctx.getAttribute("vehicleDAO");
		return vehicleDAO.getAll();
	}

	@GET
	@Path("/getByRentACarId/{rentACarId}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public List<Vehicle> getByRentACarId(@PathParam("rentACarId") String rentACarId) {
		VehicleDAO vehicleDAO = (VehicleDAO) ctx.getAttribute("vehicleDAO");
		return vehicleDAO.getByRentACarId(rentACarId);
	}

	@GET
	@Path("/getById/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Vehicle getById(@PathParam("id") String id) {
		VehicleDAO vehicleDAO = (VehicleDAO) ctx.getAttribute("vehicleDAO");
		return vehicleDAO.getById(id);
	}

	@GET
	@Path("/getAvailable/{wantedStart}/{wantedEnd}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public List<Vehicle> getAvailable(@PathParam("wantedStart") String wantedStart,
			@PathParam("wantedEnd") String wantedEnd) {
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

		Date wantedStartDate = new Date();
		Date wantedEndDate = new Date();

		try {
			wantedStartDate = formatter.parse(wantedStart);
			wantedEndDate = formatter.parse(wantedEnd);
		} catch (Exception e) {
			e.printStackTrace();
		}

		VehicleDAO vehicleDAO = (VehicleDAO) ctx.getAttribute("vehicleDAO");
		OrderDAO orderDAO = (OrderDAO) ctx.getAttribute("orderDAO");
		return vehicleDAO.getAvailableVehicles(wantedStartDate, wantedEndDate, orderDAO);

	}

	@POST
	@Path("/addVehicle")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response addVehicle(@Context HttpServletRequest request, Vehicle newVehicle)
			throws FileNotFoundException, IOException {
		VehicleDAO vehicleDAO = (VehicleDAO) ctx.getAttribute("vehicleDAO");
		ImageDAO imageDAO = (ImageDAO) ctx.getAttribute("imageDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		RentACarDAO rentACarDAO = (RentACarDAO) ctx.getAttribute("rentACarDAO");

		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.MANAGER || rentACarDAO.getByManagerId(loggedUser.getId()) == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Currently, there is no object assigned to you.").build();
		
		String fileName = imageDAO.save(newVehicle.getImage());
		if (fileName != "Error") {
			newVehicle.setImage("images/" + fileName);
			vehicleDAO.add(newVehicle);
			return Response.ok("Vehicle is added").build();
		}
		
		return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Image can't be saved").build();
	}

	@DELETE
	@Path("/deleteVehicle/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response deleteVehicle(@PathParam("id") String id) {
		VehicleDAO vehicleDAO = (VehicleDAO) ctx.getAttribute("vehicleDAO");	
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");

		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.MANAGER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();
		
		vehicleDAO.deleteVehicle(id);
		return Response.ok("Vehicle is deleted").build();
	}

	@PUT
	@Path("/changeVehicle/{isImageChanged}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response changeVehicle(@PathParam("isImageChanged") String isImageChanged, Vehicle changedVehicle) {
		VehicleDAO vehicleDAO = (VehicleDAO) ctx.getAttribute("vehicleDAO");
		ImageDAO imageDAO = (ImageDAO) ctx.getAttribute("imageDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");	
		
		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.MANAGER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();
		
		
		if (Boolean.parseBoolean(isImageChanged)) {
			String fileName = imageDAO.save(changedVehicle.getImage());
			if (fileName != "Error") {
				changedVehicle.setImage("images/" + fileName);
				Response.ok(vehicleDAO.changeVehicle(changedVehicle)).build();
			}
		}
		
		return Response.ok(vehicleDAO.changeVehicle(changedVehicle)).build();
	}

	@GET
	@Path("/getByTransmissionType/{type}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public List<Vehicle> getByVehicleType(@PathParam("type") String type) {
		VehicleDAO vehicleDAO = (VehicleDAO) ctx.getAttribute("vehicleDAO");
		return vehicleDAO.getByTransmissionType(type);
	}

	@GET
	@Path("/getByFuelType/{type}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public List<Vehicle> getByFuelType(@PathParam("type") String type) {
		VehicleDAO vehicleDAO = (VehicleDAO) ctx.getAttribute("vehicleDAO");
		return vehicleDAO.getByFuelType(type);
	}
}
