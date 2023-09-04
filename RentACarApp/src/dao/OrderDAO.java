package dao;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Order;
import dto.OrderDTO;
import enums.OrderStatus;
import utils.UniqueIdGenerator;

public class OrderDAO {

	private List<Order> orders;
	private File file;
	private ObjectMapper objectMapper;

	public OrderDAO(String contextPath) {
		objectMapper = new ObjectMapper();
		orders = new ArrayList<Order>();
		String filePath = contextPath + "resources\\orders.json";
		file = new File(filePath);

		loadFromFile();
	}

	private void createFile() throws IOException {
		if (!file.exists())
			file.createNewFile();
	}

	private void writeToFile() {
		try {
			createFile();
			objectMapper.writerWithDefaultPrettyPrinter().writeValue(new FileOutputStream(file), orders);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void loadFromFile() {
		try {

			JavaType type = objectMapper.getTypeFactory().constructCollectionType(List.class, Order.class);
			orders = objectMapper.readValue(file, type);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public List<Order> getAll() {
		return orders;
	}

	public Order getById(String id) {
		for (Order o : orders) {
			if (o.getId().equals(id)) {
				return o;
			}
		}

		return null;
	}
	public void declineDeletedObjectOrders(String rentACarId) {
		for(Order order: getByRentACarId(rentACarId)) {
			if(!(order.getStatus().equals(OrderStatus.RETURNED) || order.getStatus().equals(OrderStatus.CANCELLED)))
			{
				order.setStatus(OrderStatus.DECLINED);
				order.setDeclineReason("OBJECT IS DELETED");
				writeToFile();
			}
		}
	}
	public List<Order> getByCustomerId(String customerId) {
		List<Order> customerOrders = new ArrayList<Order>();
		for (Order o : orders) {
			if (o.getCustomerId().equals(customerId)) {
				customerOrders.add(o);
			}
		}
		return customerOrders;
	}

	public List<Order> getByRentACarId(String rentACarId) {
		List<Order> rentACarOrders = new ArrayList<Order>();
		for (Order o : orders) {
			if (o.getRentACarId().equals(rentACarId)) {
				rentACarOrders.add(o);
			}
		}
		return rentACarOrders;
	}

	public List<Order> getByVehicleId(String vehicleId) {

		List<Order> vehicleOrders = new ArrayList<Order>();

		for (Order o : orders) {
			for (String id : o.getVehicleIds()) {
				if (id.equals(vehicleId)) {
					vehicleOrders.add(o);
				}
			}
		}

		return vehicleOrders;
	}

	/*
	 * public void add(Order order) { int maxIndex = getNextId();
	 * order.setId(Integer.toString(maxIndex));
	 * order.setUniqueId(UniqueIdGenerator.generateUniqueId()); orders.add(order);
	 * writeToFile(); }
	 */
	private int getNextId() {
		int maxIndex = 0;
		for (Order o : orders) {
			if (maxIndex < Integer.parseInt(o.getId())) {
				maxIndex = Integer.parseInt(o.getId());
			}
		}

		maxIndex += 1;
		return maxIndex;
	}

	public double createMultipleOrders(List<OrderDTO> newOrders, String customerId, int discount) {
		double ordersPrice = 0;
		for (OrderDTO order : newOrders) {
			Order newOrder = new Order(order);
			newOrder.setId(Integer.toString(getNextId()));
			newOrder.setUniqueId(UniqueIdGenerator.generateUniqueId());
			newOrder.setCustomerId(customerId);
			newOrder.setPrice(order.price * (100 - discount) / 100);
			ordersPrice += order.price;
			orders.add(newOrder);
		}
		writeToFile();
		return ordersPrice;
	}

	public Order cancelOrder(String orderId) {
		for (Order o : orders) {
			if (o.getId().equals(orderId)) {
				o.setStatus(OrderStatus.CANCELLED);
				writeToFile();
				return o;
			}
		}
		return null;
	}

	public String changeStatus(OrderDTO orderDTO, String newStatus) {
		if (newStatus.equals("TAKEN")) {
			if (orderDTO.startDate.compareTo(new Date()) > 0) {
				return "The order status can be updated to 'TAKEN' once the start date of the order is reached.";
			}
		}

		if (newStatus.equals("RETURNED")) {
			if (orderDTO.endDate.compareTo(new Date()) > 0) {
				return "The order status can be updated to 'RETURNED' once the end date of the order is reached.";
			}
		}

		for (Order o : orders) {
			if (o.getId().equals(orderDTO.id)) {
				o.setStatus(OrderStatus.valueOf(newStatus));
				o.setDeclineReason(orderDTO.declineReason);
			}
		}
		writeToFile();
		return "OK";
	}

	public void addComment(String orderId, String commentId) {
		for (Order o : orders) {
			if (o.getId().equals(orderId)) {
				o.setCommentId(commentId);
			}
		}

		writeToFile();
	}

}
