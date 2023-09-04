Vue.component("newObject", {

	data: function() {
		return {
			rentACarsObjects: [],
			selectedManager: null,
			managersLength: 0,
			name: null,
			startTime: null,
			endTime: null,
			imageBase64: null,
			imageFile: null,
			position: null,
			location: {
				address: {
					street: "",
					number: "",
					city: "",
					country: "",
					postcode: "",
				},
				latitude: '',
				longitude: '',
			},
			mapInstance: null,
			marker: null,

			errorMessage: '',
			newUser: {},
			showError: false,
			errorMessageManger: '',
		}
	},
	template:
		`
<div>
   <div class="d-flex mt-4 mb-4 justify-content-center align-items-center">
      <div class="frame">
         <img src="images/milmar_just_logo.png" alt="" class="mx-auto d-block" width="80px;">
         <h1 class="text-center text-secondary">Registration Form</h1>
         <form id="objectForm" method="post" @submit.prevent="save">
            <div class="row">
               <div class="col-md-6">
                  <table>
                     <tr>
                        <td>Name:</td>
                        <td>
                           <input class="form-control input-sm" type="text" name="name" v-model="name" required>
                        </td>
                     </tr>
                     <tr>
                        <td>Working hours:</td>
                        <td class="d-flex">
                           <input class="form-control input-sm" type="time" name="startTime" v-model="startTime" pattern="HH:mm" placeholder="HH:mm" required>
                           <input class="form-control input-sm" type="time" name="endTime" v-model="endTime"  pattern="HH:mm" placeholder="HH:mm" required>
                        </td>
                     </tr>
                     <tr>
                        <td>Street:</td>
                        <td>
                           <input class="form-control input-sm" type="text" name="street" v-model="location.address.street" required readonly>
                        </td>
                     </tr>
                     <tr>
                        <td>Street Number:</td>
                        <td>
                           <input class="form-control input-sm" type="text" name="streetNumber" v-model="location.address.number" required>
                        </td>
                     </tr>
                     <tr>
                        <td>City:</td>
                        <td>
                           <input class="form-control input-sm" type="text" name="city" v-model="location.address.city" required readonly>
                        </td>
                     </tr>
                     <tr>
                        <td>Country:</td>
                        <td>
                           <input class="form-control input-sm" type="text" name="country" v-model="location.address.country" required readonly>
                        </td>
                     </tr>
                     <tr>
                        <td>Zipcode:</td>
                        <td>
                           <input class="form-control input-sm" type="text" name="zipcode" v-model="location.address.postcode" required readonly>
                        </td>
                     </tr>
                     <tr>
                        <td>Longitude:</td>
                        <td>
                           <input class="form-control input-sm" type="text" name="longitude" v-model="location.longitude" required readonly>
                        </td>
                     </tr>
                     <tr>
                        <td>Latitude:</td>
                        <td>
                           <input class="form-control input-sm" type="text" name="latitude" v-model="location.latitude" required readonly>
                        </td>
                     </tr>
                     <tr>
                        <td>Logo:</td>
                        <td class="d-flex">
                           <input class="form-control input-sm" id="Image" type="file" @change="fileUpload" accept="image/jpeg, image/png, image/gif" required />
                           <button class="btn btn-primary btn-block ml-2 mb-2" type="button" data-toggle="modal" data-target="#image-preview-modal" > Preview </button>
                        </td>
                     </tr>
                     <tr>
                        <td>Manager</td>
                        <td class="d-flex">
                           <select class="form-control input-sm" id="selectManager" name="selectManager" v-model="selectedManager" v-show="managersLength != 0"></select>
                           <button class="btn btn-primary btn-block ml-2 mb-2" type="button" data-toggle="modal" data-target="#manager-registration-modal"  data-backdrop="static" data-keyboard="false" v-show="managersLength == 0">Register manager</button>
                        </td>
                     </tr>
                  </table>
               </div>
               <div class="col-md-6">
                  <div class="map-frame">
                     <div id="map" style="height: 400px; width: 400px"></div>
                  </div>
               </div>
            </div>
            <button class="btn btn-primary btn-block" type="submit" @submit="save">Save</button>
         </form>
         <p class="error-message text-center mt-3 text-danger">{{errorMessage}}</p>
      </div>
   </div>

   <div class="modal fade" id="manager-registration-modal" tabindex="-1" role="dialog" aria-labelledby="manager-registration-modal-label" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
         <div class="modal-content">
            <div class="modal-header">
               <h5 class="modal-title" id="manager-registration-modal-label">Manager Registration</h5>
               <button type="button" class="close" aria-label="Close" data-dismiss="modal">
               <span aria-hidden="true">&times;</span>
               </button>
            </div>
            <div class="modal-body">
                  <div class="d-flex justify-content-center align-items-center">
                     <div class="frame">
                        <img src="images/milmar_just_logo.png" alt="" class="mx-auto d-block" width="80px;">
                        <h1 class="text-center mt-1 text-secondary">Register Manager</h1>
                        <form id="forma">
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
                           <button type="button" class="btn btn-primary btn-block mt-3" v-on:click="registerManager">Save</button>
                        </form>
                        <p class="error-message text-center mt-3 text-danger">{{errorMessageManger}}</p>
                     </div>
               </div>
            </div>
         </div>
      </div>
   </div>

   <div class="modal fade" id="image-preview-modal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
         <div class="modal-content">
            <div class="modal-header">
               <h5 class="modal-title" id="manager-registration-modal-label">Image preview</h5>
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
               <span aria-hidden="true">&times;</span>
               </button>
            </div>
            <div class="modal-body">
               <div class="d-flex justify-content-center align-items-center">
                  <img :src="imageBase64" v-if="imageBase64" alt="Preview" class="img-fluid" />
               </div>
            </div>
         </div>
      </div>
   </div>

   <div class="container mt-4 mb-4 rounded-container">
    	<table class="table table-bordered">
	         <thead class="thead-light">
	            <tr>
	               <th class="text-center align-middle">Logo</th>
	               <th class="text-center align-middle">Object name</th>
	               <th class="text-center align-middle">Rating</th>
	               <th class="text-center align-middle"></th>
	            </tr>
	         </thead>
	         <tbody>
	            <tr v-for="o in rentACarsObjects">
	               <td class="d-flex justify-content-center align-items-center" ><img class="img-fluid rounded" style="max-height: 80px; max-width: 120px" :src="o.logo" ></td>
	               <td class="text-center align-middle">{{o.name}}</td>
	               <td class="text-center align-middle">{{fixDouble(o.rating)}} <i class="fas fa-star text-warning"></i></td>
	               <td class="align-middle"><button class="btn btn-primary btn-block" v-on:click="deleteObject(o)">Delete</button></td>
	            </tr>
	         </tbody>
      	</table>
  	</div>
</div>

    `,
	mounted() {
		axios.get("rest/rentACars/getAll")
			.then(response => {
				this.rentACarsObjects = response.data;
			});
		this.initSelectManager();
		this.initMap();
	},
	methods:
	{
		save: function() {
			event.preventDefault();
			if (!this.location.address.postcode || !this.location.address.postcode
				|| !this.location.address.street || !this.location.address.number || !this.location.address.country || !this.location.address.city
				|| !this.location.latitude || !this.location.longitude) {
				this.errorMessage = "Please, select location from map";
			}
			else if (!this.selectedManager) {
				this.errorMessage = "Please, select manager";
			}
			else if (this.startTime >= this.endTime && this.startTime != "00:00") {
				this.errorMessage = "Start working hour should be before end working hour";
			} else {
				this.errorMessage = "";
			}

			if (this.errorMessage === "") {

				let object = {
					"id": "-1",
					"name": this.name,
					"status": "OPEN",
					"location": this.location,
					"logo": this.imageBase64,
					"rating": 0.0,
					"workingHours": {
						startTime: this.startTime,
						endTime: this.endTime
					},
					"managerId": this.selectedManager
				}
				if (this.selectedManager === "-1") {
					this.newUser.role = "MANAGER";
					this.newUser.password = "123";
					axios.post("rest/users/registerManager", this.newUser, {
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'application/json'
						}
					}).then((response) => {
						alert("Manager is registered");
						object.managerId = response.data;
						axios.post("rest/rentACars/add", object, {
							headers: {
								'Authorization': `Bearer ${localStorage.getItem('token')}`,
								'Content-Type': 'application/json'
							}
						}).then((response) => {
							alert(response.data);
							this.$router.go(this.$router.currentRoute);
						}).catch(error => {
							this.errorMessage = error.response.data;
						});
					});
				} else {
					axios.post("rest/rentACars/add", object, {
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'application/json'
						}
					}).then((response) => {
						alert(response.data);
						this.$router.go(this.$router.currentRoute);
					}).catch(error => {
						this.errorMessage = error.response.data;
					});
				}
			}
		},
		deleteObject: function(object) {
			event.preventDefault();
			axios.delete(`rest/rentACars/${object.id}`, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			}).then((response) => {
				
			}).catch((error) => {
					alert(error.response.data);
				});
			this.rentACarsObjects = this.rentACarsObjects.filter(o => o.id !== object.id);
		},
		initSelectManager: function() {

			const select = document.getElementById('selectManager');
			let managers = [];

			axios.get('rest/users/freeManagers', {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			})
				.then((response) => {
					managers = response.data;
					this.managersLength = managers.length;
					managers.forEach((manager) => {
						let option = new Option(manager.name + " " + manager.surname, manager.id);
						option.value = manager.id;
						select.add(option, undefined);
					});

				});
		},
		fileUpload: function(event) {
			this.imageFile = event.target.files[0];
			this.imageToBase64();
		},
		imageToBase64: function() {
			let reader = new FileReader();
			reader.onload = (event) => {
				this.imageBase64 = event.target.result;
			};
			reader.readAsDataURL(this.imageFile);

		},

		initMap: function() {
			this.mapInstance = L.map('map').setView([45.267136, 19.833549], 10);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
				maxZoom: 18
			}).addTo(this.mapInstance);

			this.marker = L.marker([45.267136, 19.833549], { draggable: true }).addTo(this.mapInstance);
			this.position = this.marker.getLatLng();

			this.marker.on('dragend', event => {
				let marker = event.target;
				this.position = marker.getLatLng();
				this.reverseGeocode();
			});
		},
		reverseGeocode() {
			let lat = this.position.lat;
			let lng = this.position.lng;
			this.location.latitude = this.position.lat;
			this.location.longitude = this.position.lng;
			let geocodeApi = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat.toString() + '&lon=' + lng.toString();

			axios.get(geocodeApi)
				.then((response) => {
					let geoData = response.data;
					this.location.address.street = geoData.address.road || '';
					this.location.address.number = geoData.address.house_number || '';
					this.location.address.city = geoData.address.city || '';
					this.location.address.country = geoData.address.country || '';
					this.location.address.postcode = geoData.address.postcode;
				})
				.catch((error) => {
					console.log(error);
				});
		},
		registerManager: function() {
			$(document).ready(function() {
				$("#myModal").modal('show');
			});
			this.validateInput();
			if (this.errorMessageManger === "") {
				axios.post(`rest/users/checkManager/${this.newUser.username}`, {}, {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'application/json'
					}
				}).then((response) => {
					if (response.data === this.newUser.username) {
						$(function() {
							$('#manager-registration-modal').modal('toggle');
						});
						const select = document.getElementById('selectManager');
						this.managersLength = 1;
						let option = new Option(this.newUser.name + " " + this.newUser.surname, -1);
						select.add(option, undefined);
					}
					else {
						this.errorMessageManger = "Username is taken"
					}
				}).catch(error => {
					this.errorMessageManger = error.response.data.message;
				});
			}
		},
		validateInput: function() {

			if (!this.newUser.dateOfBirth || !this.newUser.username || !this.newUser.name || !this.newUser.surname || !this.newUser.gender) {
				this.errorMessageManger = 'All fields are required';
			} else if (this.calculateAge() < 18) {
				this.errorMessageManger = 'Manager should be older than 18.';
			} else {
				this.errorMessageManger = '';
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
		},
		fixDouble: function(rating){
			return Math.round(rating*100)/100;
		}
	}
});
