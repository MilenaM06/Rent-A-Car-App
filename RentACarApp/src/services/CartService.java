package services;

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

import beans.Cart;
import beans.User;
import beans.Vehicle;
import dao.CartDAO;
import dao.OrderDAO;
import dao.UserDAO;
import dto.OrderDTO;
import enums.Role;
import utils.JWTUtil;

@Path("/carts")
public class CartService {

	@Context
	HttpServletRequest request;
	@Context
	ServletContext ctx;

	@PostConstruct
	public void init() {
		if (ctx.getAttribute("userDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("userDAO", new UserDAO(contextPath));
		}
		if (ctx.getAttribute("cartDAO") == null) {
			UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
			ctx.setAttribute("cartDAO", new CartDAO(userDAO.getCustomers()));
		}
		if (ctx.getAttribute("orderDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("orderDAO", new OrderDAO(contextPath));
		}
	}

	/*
	 * @GET
	 * 
	 * @Path("/getAll")
	 * 
	 * @Produces(MediaType.APPLICATION_JSON)
	 * 
	 * @Consumes(MediaType.APPLICATION_JSON) public List<Cart> getAll() { CartDAO
	 * cartDAO = (CartDAO) ctx.getAttribute("cartDAO"); return cartDAO.getAll(); }
	 */

	@GET
	@Path("/getCustomerCart")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getCustomerCart() {
		CartDAO cartDAO = (CartDAO) ctx.getAttribute("cartDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));

		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.CUSTOMER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();

		return Response.ok(cartDAO.getByCustomerId(loggedUser.getId())).build();
	}

	@POST
	@Path("/addItem")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response addItem(OrderDTO order) {
		CartDAO cartDAO = (CartDAO) ctx.getAttribute("cartDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));

		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.CUSTOMER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();

		return Response.ok(cartDAO.addItem(loggedUser.getId(), order)).build();

	}

	@POST
	@Path("/addVehicle")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response addVehicle(OrderDTO order) {
		CartDAO cartDAO = (CartDAO) ctx.getAttribute("cartDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));

		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.CUSTOMER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();

		cartDAO.addVehicle(loggedUser.getId(), order);
		return Response.ok().build();

	}

	@DELETE
	@Path("/removeItem/{uniqueId}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response removeItem(@PathParam("uniqueId") String uniqueId) {
		CartDAO cartDAO = (CartDAO) ctx.getAttribute("cartDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));

		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.CUSTOMER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();

		cartDAO.removeItem(loggedUser.getId(), uniqueId);
		return Response.ok().build();
	}

	@DELETE
	@Path("/removeVehicle/{uniqueId}/{vehicleId}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response removeVehicle(@PathParam("uniqueId") String uniqueId, @PathParam("vehicleId") String vehicleId) {
		CartDAO cartDAO = (CartDAO) ctx.getAttribute("cartDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));

		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.CUSTOMER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();

		cartDAO.removeVehicle(loggedUser.getId(), uniqueId, vehicleId);
		return Response.ok().build();
	}

	@POST
	@Path("/emptyCart")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response emptyCart() {
		CartDAO cartDAO = (CartDAO) ctx.getAttribute("cartDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));

		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.CUSTOMER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();

		cartDAO.emptyCart(loggedUser.getId());
		return Response.ok(loggedUser.getId()).build();
	}
}