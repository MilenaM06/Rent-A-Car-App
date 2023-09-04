package services;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Order;
import beans.RentACar;
import beans.User;
import dao.CancellationDAO;
import dao.CustomerInfoDAO;
import dao.OrderDAO;
import dao.RentACarDAO;
import dao.UserDAO;
import dao.VehicleDAO;
import dto.OrderDTO;
import enums.Role;
import utils.JWTUtil;

@Path("/orders")
public class OrderService {

	@Context
	HttpServletRequest request;

	@Context
	ServletContext ctx;

	@PostConstruct
	public void init() {
		if (ctx.getAttribute("orderDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("orderDAO", new OrderDAO(contextPath));
		}
		if (ctx.getAttribute("rentACarDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("rentACarDAO", new RentACarDAO(contextPath));
		}
		if (ctx.getAttribute("vehicleDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("vehicleDAO", new VehicleDAO(contextPath));
		}
		if (ctx.getAttribute("customerInfoDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("customerInfoDAO", new CustomerInfoDAO(contextPath));
		}
		if (ctx.getAttribute("cancellationDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("cancellationDAO", new CancellationDAO(contextPath));
		}
		if (ctx.getAttribute("userDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("userDAO", new UserDAO(contextPath));
		}
	}

	/*
	 * @GET
	 * 
	 * @Path("/getAll")
	 * 
	 * @Produces(MediaType.APPLICATION_JSON)
	 * 
	 * @Consumes(MediaType.APPLICATION_JSON) public List<Order> getAll(){ OrderDAO
	 * orderDAO = (OrderDAO) ctx.getAttribute("orderDAO"); return orderDAO.getAll();
	 * }
	 */

	@GET
	@Path("/getByCurrentCustomerId")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getByCurrentCustomerId() {
		OrderDAO orderDAO = (OrderDAO) ctx.getAttribute("orderDAO");
		RentACarDAO rentACarDAO = (RentACarDAO) ctx.getAttribute("rentACarDAO");
		VehicleDAO vehicleDAO = (VehicleDAO) ctx.getAttribute("vehicleDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");

		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.CUSTOMER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();

		List<Order> orders = orderDAO.getByCustomerId(loggedUser.getId());
		List<OrderDTO> orderDTOs = new ArrayList<OrderDTO>();
		for (Order o : orders) {
			OrderDTO orderDTO = new OrderDTO();
			orderDTO.id = o.getId();
			orderDTO.uniqueId = o.getUniqueId();
			orderDTO.vehicles = vehicleDAO.getByVehicleIds(o.getVehicleIds());
			orderDTO.rentACarId = o.getRentACarId();
			// if is deleted
			if (rentACarDAO.getById(o.getRentACarId()) == null) {
				orderDTO.rentACarName = "DELETED OBJECT";
			} else {
				orderDTO.rentACarName = (rentACarDAO.getById(o.getRentACarId())).getName();
			}
			orderDTO.startDate = o.getStartDate();
			orderDTO.endDate = o.getEndDate();
			orderDTO.customerId = o.getCustomerId();
			orderDTO.customerFullName = userDAO.getById(o.getCustomerId()).getName() + " "
					+ userDAO.getById(o.getCustomerId()).getSurname();
			orderDTO.price = o.getPrice();
			orderDTO.status = o.getStatus();
			orderDTO.declineReason = o.getDeclineReason();
			orderDTO.commentId = o.getCommentId();
			orderDTOs.add(orderDTO);
		}

		return Response.ok(orderDTOs).build();
	}

	@POST
	@Path("/add")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response save(List<OrderDTO> orders) throws FileNotFoundException, IOException {
		OrderDAO orderDAO = (OrderDAO) ctx.getAttribute("orderDAO");
		CustomerInfoDAO infoDAO = (CustomerInfoDAO) ctx.getAttribute("customerInfoDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");

		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.CUSTOMER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();
		double ordersPrice = orderDAO.createMultipleOrders(orders, loggedUser.getId(),
				infoDAO.getDiscount(loggedUser.getId()));
		infoDAO.checkCustomerType(loggedUser.getId(), ordersPrice);
		return Response.ok().build();
	}

	@PUT
	@Path("/changeStatus/{newStatus}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response changeStatus(@PathParam("newStatus") String newStatus, OrderDTO orderDTO) {
		OrderDAO orderDAO = (OrderDAO) ctx.getAttribute("orderDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");

		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.MANAGER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();
		return Response.ok(orderDAO.changeStatus(orderDTO, newStatus)).build();
	}

	@GET
	@Path("/getByRentACarId/{rentACarId}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getByRentACarId(@PathParam("rentACarId") String rentACarId) {
		OrderDAO orderDAO = (OrderDAO) ctx.getAttribute("orderDAO");
		RentACarDAO rentACarDAO = (RentACarDAO) ctx.getAttribute("rentACarDAO");
		VehicleDAO vehicleDAO = (VehicleDAO) ctx.getAttribute("vehicleDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");

		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.MANAGER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();

		List<Order> orders = orderDAO.getByRentACarId(rentACarId);
		List<OrderDTO> orderDTOs = new ArrayList<OrderDTO>();
		// if is deleted
		if (rentACarDAO.getById(rentACarId) == null)
			return Response.ok(new ArrayList<OrderDTO>()).build();
		for (Order o : orders) {
			OrderDTO orderDTO = new OrderDTO();
			orderDTO.id = o.getId();
			orderDTO.uniqueId = o.getUniqueId();
			orderDTO.vehicles = vehicleDAO.getByVehicleIds(o.getVehicleIds());
			orderDTO.rentACarId = o.getRentACarId();
			orderDTO.rentACarName = rentACarDAO.getById(o.getRentACarId()).getName();
			orderDTO.startDate = o.getStartDate();
			orderDTO.endDate = o.getEndDate();
			orderDTO.customerId = o.getCustomerId();
			orderDTO.customerFullName = userDAO.getById(o.getCustomerId()).getName() + " "
					+ userDAO.getById(o.getCustomerId()).getSurname();
			orderDTO.price = o.getPrice();
			orderDTO.status = o.getStatus();
			orderDTO.declineReason = o.getDeclineReason();
			orderDTO.commentId = o.getCommentId();
			orderDTOs.add(orderDTO);
		}

		return Response.ok(orderDTOs).build();
	}

	@PUT
	@Path("/cancelOrder")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response cancelOrder(OrderDTO orderDTO) {
		System.out.println("Uslo");
		OrderDAO orderDAO = (OrderDAO) ctx.getAttribute("orderDAO");
		CustomerInfoDAO infoDAO = (CustomerInfoDAO) ctx.getAttribute("customerInfoDAO");
		CancellationDAO cancellationDAO = (CancellationDAO) ctx.getAttribute("cancellationDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");

		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.CUSTOMER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();
		Order cancelledOrder = orderDAO.cancelOrder(orderDTO.id);
		infoDAO.checkCustomerType(cancelledOrder.getCustomerId(), -cancelledOrder.getPrice());
		cancellationDAO.add(cancelledOrder.getCustomerId(), orderDTO.id);
		return Response.ok().build();
	}

}
