Vue.component("managerRegistration", {
	data: function() {
		return {
			newUser: {},
			showError: false,
			errorMessage: '',
		}
	},
	template:
		`
	<div>
		<br><br><br><br><br>
		<div class="d-flex justify-content-center align-items-center">
			 <div class="frame">
				<img src="images/milmar_just_logo.png" alt="" class="mx-auto d-block" width="80px;">
            	<h1 class="text-center mt-1 text-secondary">Register Manager</h1>

		  	 	<form @submit.prevent="registerNewUser">
		      		<table>
				         <tr>
				            <td><label for="username">Username:</label></td>
				            <td>
				               <input class="form-control input-sm"  type="text" id="username" name="username" v-model="newUser.username" required>
				            </td>
				         </tr>
				         <tr>
				            <td><label for="name">Name:</label></td>
				            <td>
				               <input class="form-control input-sm"  type="text" id="name" name="name" v-model="newUser.name" required>
				            </td>
				         </tr>
				         <tr>
				            <td><label for="surname">Surname:</label></td>
				            <td>
				               <input class="form-control input-sm" type="text" id="surname" name="surname" v-model="newUser.surname" required>
				            </td>
				         </tr>
				         <tr>
				            <td><label for="gender">Gender:</label></td>
				            <td>
				               <select class="form-control input-sm" v-model="newUser.gender" name="gender" id="gender" required>
				                  <option value="MALE">MALE</option>
				                  <option value="FEMALE">FEMALE</option>
				               </select>
				            </td>
				         </tr>
				         <tr>
				            <td><label for="dateOfBirth">Date of birth:</label></td>
				            <td>
				            <input class="form-control input-sm"  type="date" v-model="newUser.dateOfBirth" name="dateOfBirth" id="dateOfBirth" required onkeydown="return false;">
				            </td>
				         </tr>
		      		</table>

					<button type="submit" class="btn btn-primary btn-block mt-3">Submit</button>
			   	</form>
				<p class="error-message text-center mt-3 text-danger">{{errorMessage}}</p>
			</div>
		</div>
		<br><br><br><br><br>
	</div>

    `,
    methods:
	{
		registerNewUser: function() {
			event.preventDefault(); // Prevent the default form submission behavior
			this.validateInput();
			if (this.errorMessage === "") {
				this.newUser.role = "MANAGER";
				this.newUser.password = "123";
				axios
					.post("rest/users/registerManager", this.newUser, {
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'application/json'
						}
					})
					.then((response) => {
						this.$emit("manager-registered");
						alert("Manager is registred");
						this.newUser = {};
					})
					.catch(error => {
						this.errorMessage = error.response.data;
					});
	}
		},
		validateInput: function() {

			if (!this.newUser.dateOfBirth) {
				this.errorMessage = 'Please select a date of birth.';
			} else if (this.calculateAge() < 18) {
				this.errorMessage = 'Manager should be older than 18.';
			} else {
				this.errorMessage = '';
			}
		},
		calculateAge: function() {
			var today = new Date();
			var dateParts = this.newUser.dateOfBirth.split("-");

			var year = parseInt(dateParts[0]);
			var month = parseInt(dateParts[1]) - 1; // Months in JavaScript are 0-indexed
			var day = parseInt(dateParts[2]);

			var dateOfBirth = new Date(year, month, day);

			var today = new Date();
			var age = today.getFullYear() - dateOfBirth.getFullYear();
			var m = today.getMonth() - dateOfBirth.getMonth();

			if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
				age--;
			}
			return age;
		}
	}
});
