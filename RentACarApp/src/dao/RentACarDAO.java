package dao;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.RentACar;
import enums.RentACarStatus;
import beans.Vehicle;
import beans.WorkingHours;

public class RentACarDAO {

	private List<RentACar> rentACars;
	private File file;
	private ObjectMapper objectMapper;

	public RentACarDAO(String contextPath) {
		objectMapper = new ObjectMapper();
		rentACars = new ArrayList<RentACar>();
		String filePath = contextPath + "resources\\rentACars.json";
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
			objectMapper.writerWithDefaultPrettyPrinter().writeValue(new FileOutputStream(file), rentACars);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void loadFromFile() {
		try {
			JavaType type = objectMapper.getTypeFactory().constructCollectionType(List.class, RentACar.class);
			rentACars = objectMapper.readValue(file, type);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public boolean isOpened(RentACar r) {

		LocalTime now = LocalTime.now();
		WorkingHours w = r.getWorkingHours();
		if (now.compareTo(LocalTime.parse(w.getStartTime())) >= 0 && now.compareTo(LocalTime.parse(w.getEndTime())) < 0)
			return true;
		return false;
	}

	public List<RentACar> getAll() {

		List<RentACar> allRentACars = new ArrayList<RentACar>();

		for (RentACar rentACar : rentACars) {
			if(rentACar.isDeleted())
				continue;
			boolean opened = isOpened(rentACar);
			if (opened) {
				rentACar.setStatus(RentACarStatus.OPEN);
				allRentACars.add(0, rentACar);
			} else {
				rentACar.setStatus(RentACarStatus.CLOSED);
				allRentACars.add(rentACar);
			}

		}
		return allRentACars;
	}

	public void add(RentACar object) {
		int maxIndex = 0;
		for (RentACar o : rentACars) {
			if (maxIndex < Integer.parseInt(o.getId())) {
				maxIndex = Integer.parseInt(o.getId());
			}
		}

		maxIndex += 1;
		object.setId(Integer.toString(maxIndex));
		rentACars.add(object);
		writeToFile();
	}

	public List<RentACar> search(String name, String location, String vehicleType, double rating, VehicleDAO vehicleDAO) {

		List<RentACar> filteredObjects = new ArrayList<RentACar>();
		for (RentACar rentACar : rentACars) {
			if (rentACar.getName().toLowerCase().contains(name.toLowerCase())
					&& (isLocationMatching(location, rentACar) || location.equals(""))
					&& (rentACar.getRating() == rating || rating == -1)
					&& hasVehicleType(rentACar, vehicleDAO, vehicleType)
					&& !rentACar.isDeleted()) {
				boolean opened = isOpened(rentACar);
				if (opened) {
					rentACar.setStatus(RentACarStatus.OPEN);
					filteredObjects.add(0, rentACar);
				} else {
					rentACar.setStatus(RentACarStatus.CLOSED);
					filteredObjects.add(rentACar);
				}
			}
		}
		return filteredObjects;
	}

	private boolean hasVehicleType(RentACar rentACar, VehicleDAO vehicleDAO, String vehicleType) {
		if(vehicleType.equals(""))
			return true;
		for (Vehicle vehicle : vehicleDAO.getByRentACarId(rentACar.getId())) {
			if (vehicle.getType().toString().equals(vehicleType.toUpperCase()))
				return true;
		}
		return false;
	}

	private boolean isLocationMatching(String location, RentACar rentACar) {
		return rentACar.getLocation().getAddress().getCity().toLowerCase().contains(location.toLowerCase())
				|| rentACar.getLocation().getAddress().getCountry().toLowerCase().contains(location.toLowerCase());
	}

	public RentACar getById(String id) {

		for (RentACar rentACar : rentACars) {
			if (rentACar.getId().equals(id) && !rentACar.isDeleted()) {
				return rentACar;
			}
		}
		return null;
	}

	public RentACar getByManagerId(String managerId) {

		for (RentACar rentACar : rentACars) {
			if (rentACar.getManagerId().equals(managerId) && !rentACar.isDeleted()) {
				return rentACar;
			}
		}
		return null;
	}

	public void changeRating(String rentACarId, double rating) {
		for (RentACar r : rentACars) {
			if (r.getId().equals(rentACarId)) {
				r.setRating(rating);
			}
		}
		writeToFile();
	}
	public void deleteObject(String rentACarId) {
		for (RentACar r : rentACars) {
			if (r.getId().equals(rentACarId)) {
				r.setDeleted(true);
			}
		}
		writeToFile();
	}

}
