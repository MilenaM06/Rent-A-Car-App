package beans;

import java.util.List;
import dto.OrderDTO;

public class Cart {
	private String customerId;
	private List<OrderDTO> items;

	public Cart() {
		super();
	}

	public Cart(String customerId, List<OrderDTO> items) {
		super();
		this.customerId = customerId;
		this.items = items;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public List<OrderDTO> getItems() {
		return items;
	}

	public void setItems(List<OrderDTO> items) {
		this.items = items;
	}

}