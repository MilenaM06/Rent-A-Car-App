package services;

import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import beans.CustomerInfo;
import dao.CustomerInfoDAO;
import utils.JWTUtil;

@Path("/customersInfo")
public class CustomerInfoService {

	@Context
	HttpServletRequest request;
	@Context
	ServletContext ctx;
	
	@PostConstruct
	public void init() {
		if(ctx.getAttribute("customerInfoDAO")==null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("customerInfoDAO", new CustomerInfoDAO(contextPath));
		}
	}
	
	/*@GET
	@Path("/getAll")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public List<CustomerInfo> getAll() {
		CustomerInfoDAO infoDAO = (CustomerInfoDAO) ctx.getAttribute("customerInfoDAO");
		return infoDAO.getAll();
	}*/

	@GET
	@Path("/getDiscount")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public int getDiscount() {
		CustomerInfoDAO infoDAO = (CustomerInfoDAO) ctx.getAttribute("customerInfoDAO");
		String token = request.getHeader("Authorization").split(" ")[1];
		if (JWTUtil.verifyToken(token) == null) {
			return 0;
		} else {
			return infoDAO.getDiscount(JWTUtil.getUserIdFromToken(token));
		}
	}
		
}
