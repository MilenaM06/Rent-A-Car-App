package dao;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Base64;
import java.util.UUID;

public class ImageDAO {
	private String filePath;

	public ImageDAO(String contextPath) {
		filePath = contextPath + "images"; 
	}
	
	public String save(String payload) {
		try {
			// Decode the base64 image data
			String part[] = payload.split(",");
			byte[] imageData = Base64.getDecoder().decode(part[1]);
			
			//data:image/jpeg;base64,
			String fileFormat = part[0].split("/")[1].split(";")[0];
			String uniqueFileName = System.currentTimeMillis() + "_" + UUID.randomUUID().toString() + "." + fileFormat;
			String path =  filePath + "/" + uniqueFileName;

			// Write the image data to the file
			try (OutputStream outputStream = new FileOutputStream(path)) {
				outputStream.write(imageData);
			}

			return uniqueFileName;
		} catch (IOException e) {
			e.printStackTrace();
			return "Error";
		}
	}
}