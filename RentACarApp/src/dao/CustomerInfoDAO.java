package dao;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.CustomerInfo;
import dto.DiscountPairDTO;
import enums.CustomerType;

public class CustomerInfoDAO {
	private List<CustomerInfo> customersInfo;
	private File file;
	private ObjectMapper objectMapper;
	private LinkedHashMap<CustomerType, DiscountPairDTO> discountRules;

	public CustomerInfoDAO(String contextPath) {
		objectMapper = new ObjectMapper();
		customersInfo = new ArrayList<CustomerInfo>();
		discountRules = new LinkedHashMap<CustomerType, DiscountPairDTO>();
		String filePath = contextPath + "resources\\customersInfo.json";
		file = new File(filePath);

		initializeDiscountRules();
		loadFromFile();
	}

	private void initializeDiscountRules() {
		discountRules.put(CustomerType.GOLD, new DiscountPairDTO(10, 5000));
		discountRules.put(CustomerType.SILVER, new DiscountPairDTO(5, 4000));
		discountRules.put(CustomerType.BRONZE, new DiscountPairDTO(3, 3000));
	}

	private int getDiscountFromRules(CustomerType type) {
		for (CustomerType key : discountRules.keySet()) {
			if (key.equals(type))
				return discountRules.get(key).discount;
		}
		return 0;
	}

	private CustomerType getTypeFromRules(int points) {
		for (Map.Entry<CustomerType, DiscountPairDTO> entry : discountRules.entrySet()) {
			if (points >= entry.getValue().neededPoints)
				return entry.getKey();
		}
		return CustomerType.NONE;
	}

	private void createFile() throws IOException {
		if (!file.exists())
			file.createNewFile();
	}

	private void writeToFile() {
		try {
			createFile();
			objectMapper.writerWithDefaultPrettyPrinter().writeValue(new FileOutputStream(file), customersInfo);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void loadFromFile() {
		try {
			JavaType type = objectMapper.getTypeFactory().constructCollectionType(List.class, CustomerInfo.class);
			customersInfo = objectMapper.readValue(file, type);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public List<CustomerInfo> getAll() {
		return customersInfo;
	}

	public CustomerType getCustomerType(String customerId) {
		for (CustomerInfo info : customersInfo) {
			if (info.getCustomerId().equals(customerId))
				return info.getType();
		}
		return CustomerType.NONE;
	}

	public int getPoints(String customerId) {
		for (CustomerInfo info : customersInfo) {
			if (info.getCustomerId().equals(customerId))
				return info.getPoints();
		}
		return 0;
	}

	public int getDiscount(String customerId) {
		for (CustomerInfo info : customersInfo) {
			if (info.getCustomerId().equals(customerId) && info.getType() != CustomerType.NONE)
				return getDiscountFromRules(info.getType());
		}
		return 0;
	}

	public void checkCustomerType(String customerId, double orderPrice) {
		int points = calculatePoints(orderPrice);
		for (CustomerInfo info : customersInfo) {
			if (info.getCustomerId().equals(customerId)) {
				info.setType(getTypeFromRules(info.getPoints() + points));
				info.setPoints(info.getPoints() + points);
				writeToFile();
				return;
			}
		}
		CustomerInfo newCustomerInfo = new CustomerInfo();
		newCustomerInfo.setCustomerId(customerId);
		newCustomerInfo.setType(getTypeFromRules(points));
		newCustomerInfo.setPoints(points);
		customersInfo.add(newCustomerInfo);
		writeToFile();
	}

	private int calculatePoints(double orderPrice) {
		if (orderPrice < 0) {
			return (int) (orderPrice / 100 * 133 * 4);
		}
		return (int) (orderPrice / 100 * 133);
	}
}
