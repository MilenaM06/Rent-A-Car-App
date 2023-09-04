package beans;

import enums.CustomerType;

public class CustomerInfo {

	private String customerId;
	private int points;
	private CustomerType type;

	public CustomerInfo() {
		super();
	}

	public CustomerInfo(String customerId, int points, CustomerType type) {
		super();
		this.customerId = customerId;
		this.points = points;
		this.type = type;
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public int getPoints() {
		return points;
	}

	public void setPoints(int points) {
		this.points = points;
	}

	public CustomerType getType() {
		return type;
	}

	public void setType(CustomerType type) {
		this.type = type;
	}

}
