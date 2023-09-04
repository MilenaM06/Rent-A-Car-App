package beans;

import enums.RentACarStatus;

public class RentACar {
	private String id;
	private String name;
	private RentACarStatus status;
	private Location location;
	private String logo;
	private double rating;
	private WorkingHours workingHours;
	private String managerId;
	private boolean deleted;

	public RentACar() {
		super();
	}

	public RentACar(String id, String name, RentACarStatus status, Location location, String logo, double rating,
			WorkingHours workingHours, String managerId, boolean deleted) {
		super();
		this.id = id;
		this.name = name;
		this.status = status;
		this.location = location;
		this.logo = logo;
		this.rating = rating;
		this.workingHours = workingHours;
		this.managerId = managerId;
		this.deleted = deleted;
	}
	

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public RentACarStatus getStatus() {
		return status;
	}

	public void setStatus(RentACarStatus status) {
		this.status = status;
	}

	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public String getLogo() {
		return logo;
	}

	public void setLogo(String logo) {
		this.logo = logo;
	}

	public double getRating() {
		return rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}

	public WorkingHours getWorkingHours() {
		return workingHours;
	}

	public void setWorkingHours(WorkingHours workingHours) {
		this.workingHours = workingHours;
	}

	public String getManagerId() {
		return managerId;
	}

	public void setManagerId(String managerId) {
		this.managerId = managerId;
	}
}
