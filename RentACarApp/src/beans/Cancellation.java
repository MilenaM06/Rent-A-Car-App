package beans;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

public class Cancellation {

	private String customerId;
	private String orderId;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date cancellationDate;
	
	public Cancellation() {
		super();
	}
	
	public Cancellation(String customerId, String orderId, Date cancellationDate) {
		super();
		this.customerId = customerId;
		this.orderId = orderId;
		this.cancellationDate = cancellationDate;
	}
	public String getCustomerId() {
		return customerId;
	}
	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}
	public String getOrderId() {
		return orderId;
	}
	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	public Date getCancellationDate() {
		return cancellationDate;
	}
	public void setCancellationDate(Date cancellationDate) {
		this.cancellationDate = cancellationDate;
	}
	
}