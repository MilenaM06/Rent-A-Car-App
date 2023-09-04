package utils;
import java.security.SecureRandom;

public class UniqueIdGenerator {
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int ID_LENGTH = 10;
    
    public static String generateUniqueId() {
        StringBuilder sb = new StringBuilder(ID_LENGTH);
        SecureRandom random = new SecureRandom();
        
        for (int i = 0; i < ID_LENGTH; i++) {
            int randomIndex = random.nextInt(CHARACTERS.length());
            sb.append(CHARACTERS.charAt(randomIndex));
        }
        
        return sb.toString();
    }
}