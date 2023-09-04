package services;

import java.util.ArrayList;
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

import beans.Comment;
import beans.Order;
import beans.User;
import dao.CommentDAO;
import dao.OrderDAO;
import dao.RentACarDAO;
import dao.UserDAO;
import dto.CommentDTO;
import enums.Role;
import utils.JWTUtil;

@Path("/comments")
public class CommentService {
	
	@Context
	HttpServletRequest request;
	
	@Context
	ServletContext ctx;
	
	@PostConstruct
	public void init() {
		if(ctx.getAttribute("commentDAO")==null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("commentDAO", new CommentDAO(contextPath));
		}
		
		if(ctx.getAttribute("orderDAO")==null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("orderDAO", new OrderDAO(contextPath));
		}
		
		if(ctx.getAttribute("rentACarDAO")==null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("rentACarDAO", new RentACarDAO(contextPath));
		}
		
		if(ctx.getAttribute("userDAO")==null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("userDAO", new UserDAO(contextPath));
		}
	}
	
	@GET
	@Path("/getAll")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public List<Comment> getAll(){
		CommentDAO commentDAO = (CommentDAO) ctx.getAttribute("commentDAO");
		return commentDAO.getAll();
	}
	
	@GET
	@Path("/getByRentACarId/{rentACarId}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public List<CommentDTO> getByRentACarId(@PathParam("rentACarId") String rentACarId){
		CommentDAO commentDAO = (CommentDAO) ctx.getAttribute("commentDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		
		List<CommentDTO> commentDTOs = new ArrayList<CommentDTO>();
		
		for(Comment c: commentDAO.getByRentACarId(rentACarId)) {
			CommentDTO commentDTO = new CommentDTO();
			
			commentDTO.id = c.getId();
			commentDTO.customerId = c.getCustomerId();
			commentDTO.customerUsername = userDAO.getById(c.getCustomerId()).getUsername();
			commentDTO.rentACarId = c.getRentACarId();
			commentDTO.content = c.getContent();
			commentDTO.rating = c.getRating();
			commentDTO.status = c.getStatus();
			
			commentDTOs.add(commentDTO);
		}
		
		return commentDTOs;
	}
	
	@GET
	@Path("/getAcceptedByRentACarId/{rentACarId}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public List<CommentDTO> getAcceptedByRentACarId(@PathParam("rentACarId") String rentACarId){	
		CommentDAO commentDAO = (CommentDAO) ctx.getAttribute("commentDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		
		List<CommentDTO> commentDTOs = new ArrayList<CommentDTO>();
		
		for(Comment c: commentDAO.getAcceptedByRentACarId(rentACarId)) {
			CommentDTO commentDTO = new CommentDTO();
			
			commentDTO.id = c.getId();
			commentDTO.customerId = c.getCustomerId();
			commentDTO.customerUsername = userDAO.getById(c.getCustomerId()).getUsername();
			commentDTO.rentACarId = c.getRentACarId();
			commentDTO.content = c.getContent();
			commentDTO.rating = c.getRating();
			commentDTO.status = c.getStatus();
			
			commentDTOs.add(commentDTO);
		}
		
		return commentDTOs;
		
	}
	
	@PUT
	@Path("/changeStatus/{newStatus}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response changeStatus(@PathParam("newStatus") String newStatus, CommentDTO commentDTO) {
		System.out.println("Uslo u comment servis");
		CommentDAO commentDAO = (CommentDAO) ctx.getAttribute("commentDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");	
		
		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.MANAGER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();
		
		commentDAO.changeStatus(commentDTO.id, newStatus);
		return Response.ok("Status is changed").build();
	}
	
	@POST
	@Path("/add/{orderId}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response add(@PathParam("orderId") String orderId, Comment comment) {
		CommentDAO commentDAO = (CommentDAO) ctx.getAttribute("commentDAO");
		OrderDAO orderDAO = (OrderDAO) ctx.getAttribute("orderDAO");
		RentACarDAO rentACarDAO = (RentACarDAO) ctx.getAttribute("rentACarDAO");
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");

		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.CUSTOMER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();	
		
		String commentId = commentDAO.add(comment);
		orderDAO.addComment(orderId, commentId);
		Order order = orderDAO.getById(orderId);
		double rating = commentDAO.calculateRatingByRentACarId(order.getRentACarId());
		rentACarDAO.changeRating(order.getRentACarId(), rating);
		
		return Response.ok(commentId).build();
	}
}


