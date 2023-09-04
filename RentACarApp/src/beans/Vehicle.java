package beans;

import enums.FuelType;
import enums.TransmissionType;
import enums.VehicleType;

public class Vehicle {

	private String id;
	private String brand;
	private String model;
	private double price;
	private VehicleType type;
	private String rentACarId;
	private TransmissionType transmissionType;
	private FuelType fuelType;
	private double fuelConsumption;
	private int numberOfDoors;
	private int passengerCapacity;
	private String description;
	private String image;

	private boolean deleted;

	public Vehicle() {
		super();
	}

	public Vehicle(String id, String brand, String model, double price, VehicleType type, String rentACarId,
			TransmissionType transmissionType, FuelType fuelType, double fuelConsumption, int numberOfDoors,
			int passengerCapacity, String description, String image, boolean deleted) {
		super();
		this.id = id;
		this.brand = brand;
		this.model = model;
		this.price = price;
		this.type = type;
		this.rentACarId = rentACarId;
		this.transmissionType = transmissionType;
		this.fuelType = fuelType;
		this.fuelConsumption = fuelConsumption;
		this.numberOfDoors = numberOfDoors;
		this.passengerCapacity = passengerCapacity;
		this.description = description;
		this.image = image;
		this.deleted = deleted;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public VehicleType getType() {
		return type;
	}

	public void setType(VehicleType type) {
		this.type = type;
	}

	public String getRentACarId() {
		return rentACarId;
	}

	public void setRentACarId(String rentACarId) {
		this.rentACarId = rentACarId;
	}

	public TransmissionType getTransmissionType() {
		return transmissionType;
	}

	public void setTransmissionType(TransmissionType transmissionType) {
		this.transmissionType = transmissionType;
	}

	public FuelType getFuelType() {
		return fuelType;
	}

	public void setFuelType(FuelType fuelType) {
		this.fuelType = fuelType;
	}

	public double getFuelConsumption() {
		return fuelConsumption;
	}

	public void setFuelConsumption(double fuelConsumption) {
		this.fuelConsumption = fuelConsumption;
	}

	public int getNumberOfDoors() {
		return numberOfDoors;
	}

	public void setNumberOfDoors(int numberOfDoors) {
		this.numberOfDoors = numberOfDoors;
	}

	public int getPassengerCapacity() {
		return passengerCapacity;
	}

	public void setPassengerCapacity(int passengerCapacity) {
		this.passengerCapacity = passengerCapacity;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public boolean getDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

}
