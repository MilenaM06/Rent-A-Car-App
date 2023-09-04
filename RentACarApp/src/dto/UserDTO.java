package dto;

import java.util.Date;

import enums.CustomerType;
import enums.Gender;
import enums.Role;

public class UserDTO {
	
	public String id;
	public String username;
	public String name;
	public String surname;
	public Gender gender;
	public Date  dateOfBirth;
	public Role role;
	public boolean deleted;
	public boolean blocked;
	public CustomerType customerType;
	public int points;
	public boolean isSuspicious;

}