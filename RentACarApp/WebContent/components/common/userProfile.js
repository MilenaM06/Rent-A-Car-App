Vue.component("userProfile", {
	data: function() {
		return {

			currentUser: {},
			currentUserChangeModel: {},
			currentUsername: '',
			oldPassword: '',
			password: '',
			passwordCheck: '',
			mode: 'SHOW',
			buttonMode: 'SHOW',
			errorMessage: ''

		}
	},
	template:
		`
	    
    <div>	
		<br><br><br><br>
		<div class="d-flex justify-content-center align-items-center h-100">
			<div class="frame p-4">
			   	<img src="images/milmar_just_logo.png" alt="" class="mx-auto d-block" width="80px;">
            	<h1 class="text-center mt-1 text-secondary">My Profile</h1>
				
				<div class="text-center mt-4">
	                <table class="table">
	                    <tr>
	                        <td><label>Username:</label></td>
	                        <td><label>{{ currentUser.username }}</label></td>
	                    </tr>
	                    <tr>
	                        <td><label>Name:</label></td>
	                        <td><label>{{ currentUser.name }}</label></td>
	                    </tr>
	    
	                    <tr>
	                        <td><label>Surname:</label></td>
	                        <td><label>{{ currentUser.surname }}</label></td>
	                    </tr>
	    
	                    <tr>
	                        <td><label>Gender:</label></td>
	                        <td><label>{{ currentUser.gender }}</label></td>
	                    </tr>
	    
	                    <tr>
	                        <td><label>Date of Birth:</label></td>
	                        <td><label>{{ new Date(currentUser.dateOfBirth).toLocaleDateString('sr-RS') }}</label></td>
	                    </tr>
	    
	                    <tr>
	                        <td><label>Role:</label></td>
	                        <td><label> {{ currentUser.role }}</label></td>
	                    </tr>
	                </table>

	                <div class="d-flex justify-content-center" v-bind:hidden="buttonMode=='CHANGE'">
				        <button class="btn btn-primary mr-2" v-on:click="change(1)">Change Info</button>
				        <button class="btn btn-primary" v-on:click="change(2)">Change Password</button>
			    	</div>
            	</div>
			

			    <div class="mt-3" v-if="mode === 'CHANGEPASSWORD'">
			    	<form>
				      	<table>
				      		<tr>
					          <td><label for="oldPassword">Old password*</label></td>
					          <td><input class="form-control input-sm" type="password" v-model="oldPassword" name="oldPassword" id="oldPassword"></td>
					        </tr>
					        <tr>
					          <td><label for="password">New password*</label></td>
					          <td><input class="form-control input-sm" type="password" v-model="password" name="password" id="password"></td>
					        </tr>
					
					        <tr>
					          <td><label for="passwordCheck">Password check*</label></td>
					          <td><input class="form-control input-sm" type="password" v-model="passwordCheck" name="passwordCheck" id="passwordCheck"></td>
					        </tr>
				       	</table>
						
						<div class="d-flex justify-content-center" v-bind:hidden="buttonMode=='CHANGE'">
				        	<button class="btn btn-primary mr-2" v-on:click="changePassword" style="width:95px">Confirm</button>
				        	<button class="btn btn-secondary" v-on:click="discardChange" style="width:95px">Discard</button>
			    		</div>
						
				    </form>
					<p class="error-message text-center mt-3 text-danger">{{errorMessage}}</p>
			    </div>
			
				<div class="mt-3" v-if="mode === 'CHANGE'">
					<form>
						<table>
							<tr>
								<td><label>Username*</label></td>
								<td><input class="form-control input-sm" type="text" v-model="currentUserChangeModel.username"></td>
							</tr>
							<tr>
								<td><label>Name*</label></td>
								<td><input class="form-control input-sm" type="text" v-model="currentUserChangeModel.name"></td>
							</tr>
							<tr>
								<td><label>Surname*</label></td>
								<td><input class="form-control input-sm" type="text" v-model="currentUserChangeModel.surname"></td>
							</tr>
							<tr>
								<td><label for="gender">Gender*</label></td>
								<td>
									<select class="form-control input-sm" name="gender" id="gender" v-model="currentUserChangeModel.gender">
										<option value="MALE">MALE</option>
					              		<option value="FEMALE">FEMALE</option>
									</select>
								</td>
							</tr>
							<tr>
								<td><label>Date of birth*</label></td>
								<td><vuejs-datepicker class="mb-3 mt-2 ml-2" v-model="currentUserChangeModel.dateOfBirth" format="dd.MM.yyyy." name="dateInput" :editable="true"></vuejs-datepicker></td>
							</tr>
						</table>
						
						<div class="d-flex justify-content-center" v-bind:hidden="buttonMode=='CHANGE'">
				        	<button class="btn btn-primary mr-2" v-on:click="changeInfo">Confirm</button>
				        	<button class="btn btn-secondary" v-on:click="discardChange">Discard</button>
			    		</div>
						
					</form>
					<p class="error-message text-center mt-3 text-danger">{{errorMessage}}</p>
				</div>
			</div>
		</div>
		<br><br><br><br>
	</div>
	    
	    `,
	mounted() {
		axios.get("rest/users/getProfile", {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			}
		})
			.then(response => {
				this.currentUser = response.data;
			});
	},
	components: {
		vuejsDatepicker
	},
	methods: {
		change: function(requiredMode) {
			event.preventDefault();
			this.buttonMode = 'CHANGE';
			if (requiredMode === 1) {
				this.mode = 'CHANGE';
			}
			else {
				this.mode = 'CHANGEPASSWORD';
			}
			axios.get("rest/users/getProfile", {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			})
				.then(response => {
					
					var foundUser = response.data;
					var date = new Date(foundUser.dateOfBirth);
					foundUser.dateOfBirth =  new Date(foundUser.dateOfBirth);
					this.currentUserChangeModel = foundUser;

				})
		},
		discardChange: function() {
			event.preventDefault();
			this.resetData();
		},
		changeInfo: function() {
			event.preventDefault();

			if (!this.currentUserChangeModel.username || !this.currentUserChangeModel.name || !this.currentUserChangeModel.surname
				|| !this.currentUserChangeModel.gender || !this.currentUserChangeModel.dateOfBirth) {
				this.errorMessage = "All fileds are required"
				return;
			}
			else {
				axios.post("rest/users/checkUsername",
					{
						params: {
							oldUsername: this.currentUser.username,
							newUsername: this.currentUserChangeModel.username,
						}
					}).
					then(response => {
						if (response.data === "Username taken") {
							this.errorMessage = "Username is already taken";
							return;
						} else {
							axios.put("rest/users/changeProfile", this.currentUserChangeModel, {
								params: { username: this.currentUser.username },
								headers: {
									'Authorization': `Bearer ${localStorage.getItem('token')}`,
									'Content-Type': 'application/json'
								}
							})
								.then(response => {
									this.currentUser = response.data;
									const date = new Date(this.currentUser.dateOfBirth);
									this.currentUser.dateOfBirth = date;
									this.currentUsername = response.data.username;
									this.resetData();
								});
						}
					})
					.catch(err => {
						this.errorMessage = "error";
					})
			}

		},
		changePassword: function() {
			event.preventDefault();
			if (this.oldPassword != this.currentUser.password) {
				this.errorMessage = "Wrong old password";
				return;
			}
			else if (this.password != this.passwordCheck) {
				this.errorMessage = "Passwords do not match";
				return;
			} else if (this.password === this.currentUser.password) {
				this.errorMessage = "Password is same as previous";
				return;
			} else {
				this.currentUser.password = this.password;
				this.currentUserChangeModel.password = this.password;
				axios.put("rest/users/changeProfile?username=" + this.currentUser.username, this.currentUserChangeModel,
					{
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'application/json'
						}
					})
					.then(response => {
						var foundUser = response.data;
						foundUser.dateOfBirth = this.formatDate(response.data);
						this.currentUser = foundUser;
						this.currentUsername = response.data.username;
						this.resetData();
					});
			}
		},
		resetData: function() {
			this.oldPassword = '';
			this.password = '';
			this.passwordCheck = '';
			this.mode = 'SHOW';
			this.buttonMode = 'SHOW';
			this.errorMessage = '';
		},
		formatDate: function(initialDate){
			const date = new Date(initialDate);
			const day = String(date.getDate()).padStart(2, '0');
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const year = date.getFullYear();
			return day + '.' + month + '.' + year + '.';
		}
	}
});