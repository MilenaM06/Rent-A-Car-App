package dto;

import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import beans.Vehicle;
import enums.OrderStatus;

public class OrderDTO {
	public String id;
	public String uniqueId; //10 characters
	public List<Vehicle> vehicles;
	public String rentACarId;
	public String rentACarName;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	public Date startDate;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	public Date endDate;
	public String customerId;
	public String customerFullName;
	public double price; 
	public OrderStatus status;
	public String declineReason;
	public String commentId;
}
