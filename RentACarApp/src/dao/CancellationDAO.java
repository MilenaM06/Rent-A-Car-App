package dao;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Cancellation;

public class CancellationDAO {
	private List<Cancellation> cancellations;
	private File file;
	private ObjectMapper objectMapper;

	public CancellationDAO(String contextPath) {
		objectMapper = new ObjectMapper();
		cancellations = new ArrayList<Cancellation>();
		String filePath = contextPath + "resources\\cancellations.json";
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
			objectMapper.writerWithDefaultPrettyPrinter().writeValue(new FileOutputStream(file), cancellations);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void loadFromFile() {
		try {
			JavaType type = objectMapper.getTypeFactory().constructCollectionType(List.class, Cancellation.class);
			cancellations = objectMapper.readValue(file, type);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public List<Cancellation> getCustomerCancellations(String customerId) {
		List<Cancellation> founded = new ArrayList<Cancellation>();
		for (Cancellation c : cancellations) {
			if (c.getCustomerId().equals(customerId))
				founded.add(c);
		}
		return founded;
	}

	public void add(String customerId, String orderId) {
		Date date = new Date();
		cancellations.add(new Cancellation(customerId, orderId, date));
		writeToFile();
	}

	public boolean isSuspicious(String customerId) {
		List<Cancellation> customerCancellations = getCustomerCancellations(customerId);

		if (customerCancellations.size() < 5)
			return false;
		customerCancellations.sort(Comparator.comparing(Cancellation::getCancellationDate));
		for (int i = 0; i < customerCancellations.size(); i++) {
			Cancellation last = customerCancellations.get(i);
			Cancellation first = customerCancellations.get(i + 4);

			long diff = last.getCancellationDate().getTime() - first.getCancellationDate().getTime();
			diff = TimeUnit.DAYS.convert(diff, TimeUnit.MILLISECONDS);

			if (diff <= 30) {
				return true;
			}
		}
		return false;
	}
}
