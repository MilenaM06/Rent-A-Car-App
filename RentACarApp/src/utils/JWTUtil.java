package utils;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

public class JWTUtil {
    private static final String SECRET_KEY = "yourSecretKey"; // Replace with your own secret key
    private static final long EXPIRATION_TIME = 86400000; // Token expiration time (in milliseconds) - 24 hours

    public static String generateToken(String userId) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + EXPIRATION_TIME);

        String token = Jwts.builder()
                .setSubject(userId)
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();

        return token;
    }

    public static String verifyToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getSubject();
        } catch (Exception e) {
            return null; // Token verification failed
        }
    }
    public static String getUserIdFromToken(String token) {
        String userId = null;
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();

            userId = claims.getSubject();
        } catch (Exception e) {
        	 return null; // Token verification failed or user ID not present in the token
        }
        return userId;
    }
}