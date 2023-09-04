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
import beans.Vehicle;
import enums.OrderStatus;

public class VehicleDAO {

	private List<Vehicle> vehicles;
	private File file;
	private ObjectMapper objectMapper;

	public VehicleDAO(String contextPath) {
		objectMapper = new ObjectMapper();
		vehicles = new ArrayList<Vehicle>();
		String filePath = contextPath + "resources\\vehicles.json";
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
			objectMapper.writerWithDefaultPrettyPrinter().writeValue(new FileOutputStream(file), vehicles);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void loadFromFile() {
		try {
			JavaType type = objectMapper.getTypeFactory().constructCollectionType(List.class, Vehicle.class);
			vehicles = objectMapper.readValue(file, type);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public List<Vehicle> getAll() {
		List<Vehicle> existingVehicles = new ArrayList<Vehicle>();
		for (Vehicle vehicle : vehicles) {
			if (!vehicle.getDeleted()) {
				existingVehicles.add(vehicle);
			}
		}
		return existingVehicles;
	}

	public List<Vehicle> getByRentACarId(String rentACarId) {

		List<Vehicle> vehiclesByRentACarId = new ArrayList<Vehicle>();

		for (Vehicle vehicle : vehicles) {
			if (vehicle.getRentACarId().equals(rentACarId) && !vehicle.getDeleted()) {
				vehiclesByRentACarId.add(vehicle);
			}
		}

		return vehiclesByRentACarId;
	}

	public Vehicle getById(String id) {

		for (Vehicle vehicle : vehicles) {
			if (vehicle.getId().equals(id) /* && !vehicle.getDeleted() */) { // I had to comment this part
				return vehicle; // ERROR - can't show orders that have deleted vehicle
			}
		}
		return null;

	}

	public List<Vehicle> getByVehicleIds(List<String> vehicleIds) {
		List<Vehicle> vehicles = new ArrayList<Vehicle>();
		for (String id : vehicleIds) {
			vehicles.add(getById(id));
		}
		return vehicles;
	}

	private String getNextId() {
		int maxIndex = 0;
		for (Vehicle v : vehicles) {
			if (maxIndex < Integer.parseInt(v.getId())) {
				maxIndex = Integer.parseInt(v.getId());
			}
		}

		maxIndex += 1;
		return Integer.toString(maxIndex);
	}

	public void add(Vehicle vehicle) {

		vehicle.setId(getNextId());

		vehicles.add(vehicle);
		writeToFile();
	}

	public void deleteVehicle(String id) {
		for (Vehicle vehicle : vehicles) {
			if (vehicle.getId().equals(id)) {
				vehicle.setDeleted(true);
			}
		}
		writeToFile();
	}

	public List<Vehicle> getAvailableVehicles(Date wantedStart, Date wantedEnd, OrderDAO orderDAO) {
		List<Vehicle> availableVehicles = new ArrayList<Vehicle>();
		List<Order> vehicleOrders = new ArrayList<Order>();
		Boolean available = true;
		for (Vehicle v : vehicles) {
			available = true;
			if (v.getDeleted()) {
				continue;
			}

			vehicleOrders = orderDAO.getByVehicleId(v.getId());
			if (vehicleOrders.isEmpty()) {
				availableVehicles.add(v);
				continue;
			}

			for (Order o : vehicleOrders) {
				boolean doesStartOverlap = o.getStartDate().compareTo(wantedStart) >= 0
						&& o.getStartDate().compareTo(wantedEnd) <= 0;
				boolean doesEndOverlap = o.getEndDate().compareTo(wantedStart) >= 0
						&& o.getEndDate().compareTo(wantedEnd) <= 0;
				boolean isWantedDateInsideOrderDate = wantedStart.compareTo(o.getStartDate()) >= 0
						&& wantedEnd.compareTo(o.getStartDate()) <= 0;

				if ((doesStartOverlap || doesEndOverlap || isWantedDateInsideOrderDate)) {
					if (!(o.getStatus().equals(OrderStatus.CANCELLED))) {
						available = false;
					}
				}
				if (!(o.getStatus().equals(OrderStatus.CANCELLED)) && available == false) {
					break;
				}
			}
			if (available == true)
				availableVehicles.add(v);
		}

		return availableVehicles;
	}

	public Vehicle changeVehicle(Vehicle changedVehicle) {
		for (Vehicle vehicle : vehicles) {
			if (vehicle.getId().equals(changedVehicle.getId())) {
				vehicle.setBrand(changedVehicle.getBrand());
				vehicle.setModel(changedVehicle.getModel());
				vehicle.setPrice(changedVehicle.getPrice());
				vehicle.setType(changedVehicle.getType());
				vehicle.setTransmissionType(changedVehicle.getTransmissionType());
				vehicle.setFuelType(changedVehicle.getFuelType());
				vehicle.setFuelConsumption(changedVehicle.getFuelConsumption());
				vehicle.setNumberOfDoors(changedVehicle.getNumberOfDoors());
				vehicle.setPassengerCapacity(changedVehicle.getPassengerCapacity());
				vehicle.setDescription(changedVehicle.getDescription());
				vehicle.setImage(changedVehicle.getImage());
				writeToFile();
				return vehicle;
			}
		}

		return null;
	}

	public List<Vehicle> getByVehicleType(String type) {
		List<Vehicle> filteredVehicles = new ArrayList<Vehicle>();
		for (Vehicle vehicle : vehicles) {
			if (vehicle.getType().toString().equals(type) && vehicle.getDeleted() != true) {
				filteredVehicles.add(vehicle);
			}
		}
		return filteredVehicles;
	}

	public List<Vehicle> getByTransmissionType(String type) {
		List<Vehicle> filteredVehicles = new ArrayList<Vehicle>();
		for (Vehicle vehicle : vehicles) {
			if (vehicle.getTransmissionType().toString().equals(type) && vehicle.getDeleted() != true) {
				filteredVehicles.add(vehicle);
			}
		}
		return filteredVehicles;
	}

	public List<Vehicle> getByFuelType(String type) {
		List<Vehicle> filteredVehicles = new ArrayList<Vehicle>();
		for (Vehicle vehicle : vehicles) {
			if (vehicle.getFuelType().toString().equals(type) && vehicle.getDeleted() != true) {
				filteredVehicles.add(vehicle);
			}
		}
		return filteredVehicles;
	}
}
