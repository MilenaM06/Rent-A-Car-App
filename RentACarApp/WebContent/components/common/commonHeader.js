Vue.component("common-header", {
    data: function () {
		return {
			logged: {
				username: '',
				password: ''
			},
			
			newUser: {},
			passwordCheck: '',
			errorMessage: ''

		}
    },
    template: `

	<div>
	
		<nav class="navbar navbar-expand-lg navbar-light bg-light">
	        <div class="container">
	            <a class="navbar-brand" href="#">
	              <img src="images/milmar_logo.png" alt="" width="200">
	            </a>
	        </div>
	
	        <div class="collapse navbar-collapse" id="navbarNav">
	            <ul class="navbar-nav ml-auto">
	                <li class="nav-item">
	                    <a class="nav-link" href="#/">Home</a>
	                </li>
	                <li class="nav-item">
	                    <a class="nav-link" href="#/" data-toggle="modal" data-target="#login-modal" v-on:click="clearLogin()">Login</a>
	                </li>
	                <li class="nav-item">
	                    <a class="nav-link" href="#/" data-toggle="modal" data-target="#register-modal" v-on:click="clearRegister()">Register</a>
	                </li>
	            </ul>
	        </div>
    	</nav>	


		<div class="modal fade" id="login-modal" tabindex="-1" role="dialog" aria-hidden="true">
	  		<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
			
					<div class="modal-header">
		          		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
		           			<span aria-hidden="true">&times;</span>
		          		 </button>
					</div>
					
					 <div class="modal-body">
						 <div class="d-flex justify-content-center align-items-center ">
							<div class="frame">
						    	<img src="images/milmar_just_logo.png" alt="" class="mx-auto d-block" width="80px;">
				            	<h1 class="text-center mt-1 mb-3 text-secondary" >Login Form</h1>
				
								<form>
									<table>
								        <tr>
								          <td><label for="username-login">Username: </label></td>
								          <td><input class="form-control input-sm" type="text" v-model="logged.username" name="username-login" id="username-login"></td>
								        </tr>
								
								        <tr>
								          <td><label for="password-login">Password: </label></td>
								          <td><input class="form-control input-sm" type="password" v-model="logged.password" name="password-login" id="password-login"></td>
								        </tr>
									</table>
									
									<button class="btn btn-primary btn-block mt-3" type="button" v-on:click="tryToLogin">Login</button>
								</form>
								<p class="error-message text-center mt-3 text-danger">{{errorMessage}}</p>
								<p class=" text-center mt-3">Don't have an account?<br><a href="/#" data-dismiss="modal" aria-label="Close" data-toggle="modal" data-target="#register-modal" >Register here</a> </p>
							</div>
						</div>
	
					</div>
				
				</div>
			</div>
		</div>
		
		
		<div class="modal fade" id="register-modal" tabindex="-1" role="dialog" aria-hidden="true">
	  		<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content">
			
					<div class="modal-header">
		          		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
		           			<span aria-hidden="true">&times;</span>
		          		 </button>
					</div>
					
					 <div class="modal-body">
						 <div class="d-flex justify-content-center align-items-center">
							<div class="frame">
							 	<img src="images/milmar_just_logo.png" alt="" class="mx-auto d-block" width="80px;">
								<h1 class="text-center mt-1 mb-4 text-secondary">Registration Form</h1>
						
							    <form>
							    	<table>
								        <tr>
								          <td><label for="username">Username*</label></td>
								          <td><input class="form-control input-sm" type="text" v-model="newUser.username" name="username" id="username"></td>
								        </tr>
								
								        <tr>
								          <td><label for="password">Password*</label></td>
								          <td><input class="form-control input-sm" type="password" v-model="newUser.password" name="password" id="password"></td>
								        </tr>
								
								        <tr>
								          <td><label for="passwordCheck">Password check*</label></td>
								          <td><input class="form-control input-sm" type="password" v-model="passwordCheck" name="passwordCheck" id="passwordCheck"></td>
								        </tr>
								
								        <tr>
								          <td><label for="name">Name*</label></td>
								          <td><input class="form-control input-sm" type="text" v-model="newUser.name" name="name" id="name"></td>
								        </tr>
								
								        <tr>
								          <td><label for="surname">Surname*</label></td>
								          <td><input class="form-control input-sm"  type="text" v-model="newUser.surname" name="surname" id="surname"></td>
								        </tr>
								
								        <tr>
								          <td><label for="gender">Gender*</label></td>
								          <td>
								            <select class="form-control input-sm" v-model="newUser.gender" name="gender" id="gender">
								              <option value="MALE">MALE</option>
								              <option value="FEMALE">FEMALE</option>
								            </select>
								          </td>
								        </tr>
								
								        <tr>
								          <td><label for="dateOfBirth">Date of birth*</label></td>
								          <td><input class="form-control input-sm"  type="date" v-model="newUser.dateOfBirth" name="dateOfBirth" id="dateOfBirth" required onkeydown="return false;"></td>
								        </tr>
							    	</table>
				
									<button class="btn btn-primary btn-block mt-3" type="button" v-on:click="signup">Sign Up</button>
							    </form>
						
								<p class="error-message text-center mt-3 text-danger">{{errorMessage}}</p>
								
							</div>													
						</div>	
					</div>	
								
				</div>
			</div>
		</div>

	</div>    

    `,
    methods: {
		tryToLogin: function() {

			if (this.logged.username == '' || this.logged.password == '') {
				this.errorMessage = "All fields are required";
			}
			else {

				axios
					.post('rest/users/login', this.logged)
					.then(response => {

						if (response.data.token) {
							// Signup successful, token received
							// You can store the token in local storage or a cookie for later use
							localStorage.setItem('token', response.data.token);
						}

						// Redirect to the user profile page
						location.href = response.data.message;
					})
					.catch(err => {
						this.errorMessage = err.response.data.message;
					})
			}
	    },
		
		signup: function() {
	
	
				event.preventDefault();
	
				if (!this.newUser.username || !this.newUser.password || !this.newUser.name ||
					!this.newUser.surname || !this.newUser.gender || !this.newUser.dateOfBirth) {
	
					this.errorMessage = "Please fill in all required fields"
					return;
				}
				else if (this.newUser.password != this.passwordCheck) {
					this.errorMessage = "Passwords do not match";
					return;
				}
				else {
					axios.post("rest/users/signup", this.newUser).
						then(response => {
							if (response.data.token) {
								localStorage.setItem('token', response.data.token);
								location.href = "/RentACarApp/customerPage.html";
							}
						})
						.catch(error => {
							this.errorMessage = error.response.data.message;
						})
				}
			
		},
		
		clearLogin: function(){
			this.logged.username = "";
			this.logged.password = "";
			this.errorMessage = "";
		},
		
		clearRegister: function(){
			this.newUser.username = "";
			this.newUser.password = "";
			this.passwordCheck = "";
			this.newUser.name = "";
			this.newUser.surname = "";
			this.newUser.gender = "";
			this.newUser.dateOfBirth = "";
			this.errorMessage = "";
		}
	}

});

