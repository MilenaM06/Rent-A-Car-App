package beans;

import enums.CommentStatus;

public class Comment {
	private String id;
	private String customerId;
	private String rentACarId;
	private String content;
	private int rating;
	private CommentStatus status;
	
	
	public Comment() {
		super();
	}


	public Comment(String id, String customerId, String rentACarId,String content, int rating, 
			CommentStatus status) {
		super();
		this.id = id;
		this.customerId = customerId;
		this.rentACarId = rentACarId;
		this.content = content;
		this.rating = rating;
		this.status = status;
	}

	
	
	public String getId() {
		return id;
	}


	public void setId(String id) {
		this.id = id;
	}

	
	public String getCustomerId() {
		return customerId;
	}


	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public String getRentACarId() {
		return rentACarId;
	}


	public void setRentACarId(String rentACarId) {
		this.rentACarId = rentACarId;
	}
	


	public String getContent() {
		return content;
	}


	public void setContent(String content) {
		this.content = content;
	}


	public int getRating() {
		return rating;
	}


	public void setRating(int rating) {
		this.rating = rating;
	}
	
	
	public CommentStatus getStatus() {
		return status;
	}


	public void setStatus(CommentStatus status) {
		this.status = status;
	}
	
	

}
