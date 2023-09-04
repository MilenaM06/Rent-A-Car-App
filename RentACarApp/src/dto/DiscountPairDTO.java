package dto;

public class DiscountPairDTO {
	public int discount;
	public int neededPoints;
    public DiscountPairDTO(int discount, int points) {
        this.discount = discount;
        this.neededPoints = points;
    }
}