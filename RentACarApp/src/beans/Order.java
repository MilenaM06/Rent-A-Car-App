package beans;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import dto.OrderDTO;
import enums.OrderStatus;

public class Order {

	private String id;
	private String uniqueId; // 10 characters
	private List<String> vehicleIds;
	private String rentACarId;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date startDate;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date endDate;
	private String customerId;
	private double price;
	private OrderStatus status;
	private String declineReason;
	private String commentId;

	public Order() {
		super();
	}

	public Order(String id, String uniqueId, List<String> vehicleIds, String rentACarId, Date startDate, Date endDate,
			String customerId, double price, OrderStatus status, String declineReason, String commentId) {
		super();
		this.id = id;
		this.uniqueId = uniqueId;
		this.vehicleIds = vehicleIds;
		this.rentACarId = rentACarId;
		this.startDate = startDate;
		this.endDate = endDate;
		this.customerId = customerId;
		this.price = price;
		this.status = status;
		this.declineReason = declineReason;
		this.commentId = commentId;
	}

	public Order(OrderDTO order) {
		super();
		this.id = order.id;
		this.uniqueId = order.uniqueId;
		this.vehicleIds = new ArrayList<String>();
		for (Vehicle vehicle : order.vehicles) {
			this.vehicleIds.add(vehicle.getId());
		}
		this.rentACarId = order.rentACarId;
		this.startDate = order.startDate;
		this.endDate = order.endDate;
		this.customerId = order.customerId;
		this.price = order.price;
		this.status = order.status;
		this.declineReason = order.declineReason;
		this.commentId = order.commentId;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUniqueId() {
		return uniqueId;
	}

	public void setUniqueId(String uniqueId) {
		this.uniqueId = uniqueId;
	}

	public List<String> getVehicleIds() {
		return vehicleIds;
	}

	public void setVehicleIds(List<String> vehicleIds) {
		this.vehicleIds = vehicleIds;
	}

	public String getRentACarId() {
		return rentACarId;
	}

	public void setRentACarId(String rentACarId) {
		this.rentACarId = rentACarId;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public void setStatus(OrderStatus status) {
		this.status = status;
	}

	public String getDeclineReason() {
		return declineReason;
	}

	public void setDeclineReason(String declineReason) {
		this.declineReason = declineReason;
	}

	public String getCommentId() {
		return commentId;
	}

	public void setCommentId(String commentId) {
		this.commentId = commentId;
	}
}
