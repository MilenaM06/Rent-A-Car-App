package dao;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.RentACar;
import enums.Role;
import beans.User;

public class UserDAO {

	private List<User> users;
	private File file;
	private ObjectMapper objectMapper;

	public UserDAO(String contextPath) {
		objectMapper = new ObjectMapper();
		users = new ArrayList<User>();
		String filePath = contextPath + "resources\\users.json";
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
			objectMapper.writerWithDefaultPrettyPrinter().writeValue(new FileOutputStream(file), users);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void loadFromFile() {
		try {
			JavaType type = objectMapper.getTypeFactory().constructCollectionType(List.class, User.class);
			users = objectMapper.readValue(file, type);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public List<User> getAll() {
		List<User> allUsers = new ArrayList<>();
		for (User user : users) {
			if (!user.isDeleted()) {
				allUsers.add(user);
			}
		}
		return allUsers;
	}

	public User getById(String id) {
		for (User user : users) {
			if (user.getId().equals(id)) {
				return user;
			}
		}
		return null;
	}

	public List<User> getCustomers() {
		List<User> customers = new ArrayList<>();
		for (User user : users) {
			if (user.getRole().equals(Role.CUSTOMER) && !user.isDeleted()) {
				customers.add(user);
			}
		}
		return customers;
	}

	public User getByUsername(String username) {
		for (User user : users) {
			if (user.getUsername().equals(username) && !user.isDeleted()) {
				return user;
			}
		}
		return null;
	}

	public void add(User newUser) {
		int maxIndex = 0;
		for (User user : users) {
			if (maxIndex < Integer.parseInt(user.getId())) {
				maxIndex = Integer.parseInt(user.getId());
			}
		}

		maxIndex += 1;
		newUser.setId(Integer.toString(maxIndex));
		users.add(newUser);
		writeToFile();
	}

	public User changeUser(User changedUser, String username) {
		for (User user : users) {
			if (user.getUsername().equals(username)) {
				user.setUsername(changedUser.getUsername());
				user.setName(changedUser.getName());
				user.setSurname(changedUser.getSurname());
				user.setGender(changedUser.getGender());
				user.setDateOfBirth(changedUser.getDateOfBirth());
				user.setPassword(changedUser.getPassword());
				writeToFile();
				return user;
			}
		}
		return null;
	}

	public boolean alreadyExists(String username) {
		for (User user : users) {
			if (user.getUsername().equals(username)) {
				return true;
			}
		}
		return false;
	}

	public boolean isUsernameTaken(String oldUsername, String newUsername) {
		for (User user : users) {
			if (user.getUsername().equals(newUsername) && !user.getUsername().equals(oldUsername)) {
				return true;
			}
		}
		return false;
	}

	public List<User> getFreeManagers(List<RentACar> objects) {
		List<User> freeManagers = new ArrayList<User>();
		for (User u : users) {
			boolean isAssigned = false;
			for (RentACar o : objects) {
				if (o.getManagerId().equals(u.getId())) {
					isAssigned = true;
					break;
				}
			}
			if (!isAssigned && u.getRole().equals(Role.MANAGER) && !u.isDeleted() && !u.isBlocked()) {
				freeManagers.add(u);
			}
		}
		return freeManagers;
	}

	public void block(String username) {
		find(username).setBlocked(true);
		writeToFile();
	}

	public void unblock(String username) {
		find(username).setBlocked(false);
		writeToFile();
	}

	public void delete(String username) {
		find(username).setDeleted(true);
		writeToFile();
	}

	private User find(String username) {
		for (User user : users) {
			if (user.getUsername().equals(username))
				return user;
		}
		return null;
	}
	
}
