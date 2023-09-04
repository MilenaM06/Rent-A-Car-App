package beans;

public class WorkingHours {
	private String startTime;
	private String endTime;

	public WorkingHours() {
		super();
	}

	public WorkingHours(String startTime, String endTime) {
		super();
		this.startTime = startTime;
		this.endTime = endTime;
	}

	public String getStartTime() {
		return startTime;
	}

	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
}
