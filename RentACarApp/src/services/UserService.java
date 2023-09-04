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
import javax.ws.rs.QueryParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.json.JSONException;
import org.json.JSONObject;

import enums.Role;
import beans.Order;
import beans.User;
import dao.CancellationDAO;
import dao.CartDAO;
import dao.CustomerInfoDAO;
import dao.OrderDAO;
import dao.RentACarDAO;
import dao.UserDAO;
import dto.LoginDTO;
import dto.UserDTO;
import utils.JWTUtil;

@Path("/users")
public class UserService {

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
		if (ctx.getAttribute("rentACarDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("rentACarDAO", new RentACarDAO(contextPath));
		}
		if (ctx.getAttribute("customerInfoDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("customerInfoDAO", new CustomerInfoDAO(contextPath));
		}
		if (ctx.getAttribute("cancellationDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("cancellationDAO", new CancellationDAO(contextPath));
		}
		if (ctx.getAttribute("orderDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("orderDAO", new OrderDAO(contextPath));
		}
		if (ctx.getAttribute("cartDAO") == null) {
			// String contextPath = ctx.getRealPath("");
			UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
			ctx.setAttribute("cartDAO", new CartDAO(userDAO.getCustomers()));
		}
	}

	@GET
	@Path("/getAll")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getAllUsers() {
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		CustomerInfoDAO customerInfoDAO = (CustomerInfoDAO) ctx.getAttribute("customerInfoDAO");
		CancellationDAO cancellationDAO = (CancellationDAO) ctx.getAttribute("cancellationDAO");
		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.ADMINISTRATOR)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();

		List<User> users = userDAO.getAll();
		List<UserDTO> userDTOs = new ArrayList<UserDTO>();
		for (User user : users) {
			UserDTO userDTO = new UserDTO();
			userDTO.id = user.getId();
			userDTO.username = user.getUsername();
			userDTO.name = user.getName();
			userDTO.surname = user.getSurname();
			userDTO.dateOfBirth = user.getDateOfBirth();
			userDTO.gender = user.getGender();
			userDTO.role = user.getRole();
			userDTO.deleted = false;
			userDTO.blocked = user.isBlocked();
			userDTO.customerType = customerInfoDAO.getCustomerType(userDTO.id);
			userDTO.points = customerInfoDAO.getPoints(userDTO.id);
			userDTO.isSuspicious = false;
			if (user.getRole() == Role.CUSTOMER) {
				userDTO.isSuspicious = cancellationDAO.isSuspicious(userDTO.id);
			}
			userDTOs.add(userDTO);
		}

		return Response.ok(userDTOs).build();
	}

	@GET
	@Path("/getCustomersByRentACarId/{rentACarId}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getCustomersByRentACarId(@PathParam("rentACarId") String rentACarId) {
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		OrderDAO orderDAO = (OrderDAO) ctx.getAttribute("orderDAO");

		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.MANAGER)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();

		List<User> rentACarCustomers = new ArrayList<User>();
		for (Order o : orderDAO.getAll()) {
			if (o.getRentACarId().equals(rentACarId)
					&& !rentACarCustomers.contains(userDAO.getById(o.getCustomerId()))) {
				rentACarCustomers.add(userDAO.getById(o.getCustomerId()));
			}
		}
		return Response.ok(rentACarCustomers).build();
	}

	@GET
	@Path("/freeManagers")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getFreeManagers() {
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		RentACarDAO rentACarDAO = (RentACarDAO) ctx.getAttribute("rentACarDAO");

		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.ADMINISTRATOR)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();

		return Response.ok(userDAO.getFreeManagers(rentACarDAO.getAll())).build();

	}

	@GET
	@Path("/getProfile")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response getProfile() {
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		String token = request.getHeader("Authorization").split(" ")[1];
		if (JWTUtil.verifyToken(token) == null)
			return Response.status(Response.Status.FORBIDDEN).build();
		else
			return Response.ok(userDAO.getById(JWTUtil.getUserIdFromToken(token))).build();

	}

	@POST
	@Path("/login")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response login(LoginDTO user) throws JSONException {
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		User userForLogin = userDAO.getByUsername(user.username);
		JSONObject responseJson = new JSONObject();
		if (userForLogin == null) {
			responseJson.put("message", "User not found");
			return Response.status(Response.Status.NOT_FOUND).entity(responseJson.toString()).build();
		} else if (!userForLogin.getPassword().equals(user.password)) {
			responseJson.put("message", "Bad password or username");
			return Response.status(Response.Status.NOT_FOUND).entity(responseJson.toString()).build();
		} else if (userForLogin.isDeleted()) {
			responseJson.put("message", "User not found");
			return Response.status(Response.Status.NOT_FOUND).entity(responseJson.toString()).build();
		} else if (userForLogin.isBlocked()) {
			responseJson.put("message", "Administrator blocked you");
			return Response.status(Response.Status.FORBIDDEN).entity(responseJson.toString()).build();
		}

		String token = JWTUtil.generateToken(userForLogin.getId());
		if (userForLogin.getRole() == Role.ADMINISTRATOR) {
			responseJson.put("message", "/RentACarApp/administratorPage.html");
			responseJson.put("token", token);
			return Response.ok(responseJson.toString()).build();
		} else if (userForLogin.getRole() == Role.MANAGER) {
			responseJson.put("message", "/RentACarApp/managerPage.html");
			responseJson.put("token", token);
			return Response.ok(responseJson.toString()).build();
		} else if (userForLogin.getRole() == Role.CUSTOMER) {
			responseJson.put("message", "/RentACarApp/customerPage.html");
			responseJson.put("token", token);
			return Response.ok(responseJson.toString()).build();
		}
		return Response.status(Response.Status.UNAUTHORIZED).entity(responseJson.toString()).build();
	}

	@POST
	@Path("/checkUsername")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public String checkUsername(@QueryParam("oldUsername") String oldUsername,
			@QueryParam("newUsername") String newUsername) {
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		if (userDAO.isUsernameTaken(newUsername, oldUsername))
			return "Username taken";
		else
			return "Username not taken";
	}

	@POST
	@Path("/signup")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response signup(User newUser) throws JSONException {
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		CartDAO cartDAO = (CartDAO) ctx.getAttribute("cartDAO");
		JSONObject responseJson = new JSONObject();

		if (userDAO.alreadyExists(newUser.getUsername())) {
			responseJson.put("message", "Username taken");
			return Response.status(Response.Status.BAD_REQUEST).entity(responseJson.toString()).build();
		}
		newUser.setRole(Role.CUSTOMER);
		userDAO.add(newUser);
		cartDAO.add(newUser.getId());
		String token = JWTUtil.generateToken(newUser.getId());
		responseJson.put("message", "User added");
		responseJson.put("token", token);
		return Response.ok(responseJson.toString()).build();
	}

	@POST
	@Path("/registerManager")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response register(User newUser) {		
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");

		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.ADMINISTRATOR)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();
		else if (userDAO.alreadyExists(newUser.getUsername()))
			return Response.status(Response.Status.CONFLICT).entity("Username taken").build();
		newUser.setRole(Role.MANAGER);
		userDAO.add(newUser);
		return Response.ok(userDAO.getByUsername(newUser.getUsername()).getId()).build();

	}

	@POST
	@Path("/checkManager/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response checkManager(@PathParam("username") String username) {
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.ADMINISTRATOR)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();
		return Response.ok(userDAO.getByUsername(username) == null ? username : null).build();
	}

	@PUT
	@Path("/changeProfile")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response changeProfileInfo(User user, @QueryParam("username") String username) {
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		String token = request.getHeader("Authorization").split(" ")[1];
		if (JWTUtil.verifyToken(token) == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		;
		return Response.ok(userDAO.changeUser(user, username)).build();
	}

	@POST
	@Path("/block")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response block(String username) {
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.ADMINISTRATOR)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();
		userDAO.block(username);
		return Response.ok().build();
	}

	@POST
	@Path("/unblock")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response unblock(String username) {
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.ADMINISTRATOR)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();
		userDAO.unblock(username);
		return Response.ok().build();
	}

	@DELETE
	@Path("/{username}")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response delete(@PathParam("username") String username) {
		UserDAO userDAO = (UserDAO) ctx.getAttribute("userDAO");
		RentACarDAO rentACarDAO = (RentACarDAO) ctx.getAttribute("rentACarDAO");
		
		String token = request.getHeader("Authorization").split(" ")[1];
		User loggedUser = userDAO.getById(JWTUtil.getUserIdFromToken(token));
		User userForDelete = userDAO.getByUsername(username);
		List<User> freeManagers = userDAO.getFreeManagers(rentACarDAO.getAll());
		
		if (loggedUser == null)
			return Response.status(Response.Status.UNAUTHORIZED).entity("User not found").build();
		else if (loggedUser.getRole() != Role.ADMINISTRATOR)
			return Response.status(Response.Status.UNAUTHORIZED).entity("Not allowed").build();
		else if (userForDelete == null)
			return Response.status(Response.Status.NOT_FOUND).entity("User is not found").build();
		else if (freeManagers.isEmpty() && userDAO.getByUsername(username).getRole().equals(Role.MANAGER))
			return Response.status(Response.Status.METHOD_NOT_ALLOWED).entity("Register new manager first, no free managers for object").build();
		
		if(userForDelete.getRole().equals(Role.MANAGER)) {
			User availableManager = freeManagers.get(0);
			rentACarDAO.getByManagerId(userForDelete.getId()).setManagerId(availableManager.getId());
		}
		userDAO.delete(username);
		return Response.ok().build();
	}
}
