package dao;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Comment;
import enums.CommentStatus;

public class CommentDAO {
	private List<Comment> comments;
	private File file;
	private ObjectMapper objectMapper;

	public CommentDAO(String contextPath) {
		objectMapper = new ObjectMapper();
		comments = new ArrayList<Comment>();
		String filePath = contextPath + "resources\\comments.json";
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
			objectMapper.writerWithDefaultPrettyPrinter().writeValue(new FileOutputStream(file), comments);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void loadFromFile() {
		try {

			JavaType type = objectMapper.getTypeFactory().constructCollectionType(List.class, Comment.class);
			comments = objectMapper.readValue(file, type);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public List<Comment> getAll() {
		return comments;
	}

	public List<Comment> getByRentACarId(String rentACarId) {
		List<Comment> rentACarComments = new ArrayList<Comment>();
		for (Comment c : comments) {
			if (c.getRentACarId().equals(rentACarId)) {
				rentACarComments.add(c);
			}
		}
		return rentACarComments;
	}

	public List<Comment> getAcceptedByRentACarId(String rentACarId) {
		List<Comment> rentACarComments = new ArrayList<Comment>();
		for (Comment c : comments) {
			if (c.getRentACarId().equals(rentACarId) && c.getStatus().equals(CommentStatus.ACCEPTED)) {
				rentACarComments.add(c);
			}
		}
		return rentACarComments;
	}

	public void changeStatus(String commentId, String newStatus) {
		for (Comment c : comments) {
			if (commentId.equals(c.getId())) {
				c.setStatus(CommentStatus.valueOf(newStatus));
			}
		}

		writeToFile();
	}

	private String getNextId() {
		int maxIndex = 0;
		for (Comment c : comments) {
			if (maxIndex < Integer.parseInt(c.getId())) {
				maxIndex = Integer.parseInt(c.getId());
			}
		}

		maxIndex += 1;
		return Integer.toString(maxIndex);
	}

	public String add(Comment comment) {
		comment.setId(getNextId());
		comment.setStatus(CommentStatus.PENDING);

		comments.add(comment);
		writeToFile();

		return comment.getId();
	}

	public double calculateRatingByRentACarId(String rentACarId) {
		int sum = 0;
		int count = 0;
		for (Comment c : comments) {
			if (c.getRentACarId().equals(rentACarId)) {
				sum += c.getRating();
				count++;
			}
		}

		return count != 0 ? (double) sum / count : 0;
	}

}
