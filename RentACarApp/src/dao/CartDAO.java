package dao;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import beans.Cart;
import beans.User;
import beans.Vehicle;
import dto.OrderDTO;
import utils.UniqueIdGenerator;

public class CartDAO {

	private List<Cart> carts;

	public CartDAO(List<User> users) {
		carts = new ArrayList<Cart>();
		for (User user : users) {
			carts.add(new Cart(user.getId(), new ArrayList<OrderDTO>()));
		}

	}

	public List<Cart> getAll() {
		return carts;
	}

	public Cart getByCustomerId(String customerId) {

		for (Cart cart : carts) {
			if (cart.getCustomerId().equals(customerId)) {
				return cart;
			}
		}
		return null;

	}

	public void add(String customerId) {
		Cart cart = new Cart(customerId, new ArrayList<OrderDTO>());
		carts.add(cart);
	}

	public String addItem(String customerId, OrderDTO order) {

		order.uniqueId = UniqueIdGenerator.generateUniqueId();
		for (Cart cart : carts) {
			if (cart.getCustomerId().equals(customerId)) {
				cart.getItems().add(order);
			}
		}
		return order.uniqueId;
	}

	public void addVehicle(String customerId, OrderDTO order) {
		List<OrderDTO> items = getByCustomerId(customerId).getItems();
		for (int i = 0; i < items.size(); i++) {
			OrderDTO o = items.get(i);
			if (o.startDate.equals(order.startDate) && o.endDate.equals(order.endDate)
					&& o.rentACarId.equals(order.rentACarId)) {
				items.set(i, order);
				break;
			}
		}
	}

	private OrderDTO findItem(String customerId, String uniqueId) {
		List<OrderDTO> items = getByCustomerId(customerId).getItems();
		Iterator<OrderDTO> iterator = items.iterator();
		while (iterator.hasNext()) {
			OrderDTO o = iterator.next();
			if ((o.uniqueId).equals(uniqueId)) {
				return o;
			}
		}
		return null;
	}

	public void removeItem(String customerId, String uniqueId) {
		List<OrderDTO> items = getByCustomerId(customerId).getItems();
		items.remove(findItem(customerId, uniqueId));
	}
	public void emptyCart(String customerId) {
		getByCustomerId(customerId).setItems(new ArrayList<OrderDTO>());;
		
	}

	public void removeVehicle(String customerId, String uniqueId, String vehicleId) {
		OrderDTO item = findItem(customerId, uniqueId);
		List<Vehicle> vehicles = item.vehicles;
		if(vehicles.size() == 1) {
			removeItem(customerId, uniqueId);
			return;
		}
		
		LocalDate localStartDate = item.startDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
		LocalDate localEndDate = item.endDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

		long days = ChronoUnit.DAYS.between(localStartDate, localEndDate) + 1;

		Iterator<Vehicle> iterator = vehicles.iterator();
		while (iterator.hasNext()) {
			Vehicle vehicle = iterator.next();
			if ((vehicle.getId()).equals(vehicleId)) {
				item.price -= days * vehicle.getPrice();
				iterator.remove();
				break;
			}
		}
	}
}
