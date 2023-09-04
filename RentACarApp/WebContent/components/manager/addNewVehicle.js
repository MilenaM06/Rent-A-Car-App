Vue.component("addVehicle", {
	data: function() {
		return {
			rentACar: {},
			newVehicle: {},
			imageBase64: null,
			imageFile: null,
			errorMessage: ''
		}
	},
	template:
		`    
    <div>

	    <div class="d-flex justify-content-center align-items-center mt-1 mb-2">
			<div class="frame">
				<img src="images/milmar_just_logo.png" alt="" class="mx-auto d-block" width="80px;">
    			<h1 class="text-center mt-1 text-secondary">Add New Vehicle</h1>
	
		    	<form @submit.prevent="addVehicle">
			      	<table>
		
				        <tr>
				          <td><label for="brand">Brand*</label></td>
				          <td><input class="form-control input-sm" type="text" v-model="newVehicle.brand" name="brand" id="brand" required></td>
				        </tr>
				
				        <tr>
				          <td><label for="model">Model*</label></td>
				          <td><input class="form-control input-sm" type="text" v-model="newVehicle.model" name="model" id="model" required></td>
				        </tr>
				
				        <tr>
				          <td><label for="price">Price*</label></td>
				          <td><input class="form-control input-sm" type="number" v-model="newVehicle.price" name="price" id="price" required></td>
				        </tr>
				
				        <tr>
				          <td><label for="type">Type*</label></td>
							
				          <td>
							<select class="form-control input-sm" v-model="newVehicle.type" name="type" id="type" required>
				              <option value="CAR">CAR</option>
				              <option value="VAN">VAN</option>
							  <option value="MOBILEHOME">MOBILEHOME</option>
				            </select>
						  </td>
				        </tr>
				
				        <tr>
				          <td><label for="transmissionType">Transmission Type*</label></td>
				          <td>
							<select class="form-control input-sm" v-model="newVehicle.transmissionType" name="transmissionType" id="transmissionType" required>
				              <option value="MANUAL">MANUAL</option>
				              <option value="AUTOMATIC">AUTOMATIC</option>
				            </select>
						  </td>
				        </tr>
				
				        <tr>
				          <td><label for="fuelType">Fuel Type*</label></td>
				          <td>
				            <select class="form-control input-sm" v-model="newVehicle.fuelType" name="fuelType" id="fuelType" required>
				              <option value="DIESEL">DIESEL</option>
				              <option value="PETROL">PETROL</option>
							  <option value="HYBRID">HYBRID</option>
							  <option value="ELECTRIC">ELECTRIC</option>
				            </select>
				          </td>
				        </tr>
				
				        <tr>
				          <td><label for="fuelConsumption">Fuel Consumption</label></td>
				           <td><input class="form-control input-sm" type="number" v-model="newVehicle.fuelConsumption" name="fuelConsumption" id="fuelConsumption" required></td>
				        </tr>
		
						 <tr>
				          <td><label for="numberOfDoors">Number Of Doors</label></td>
				           <td><input class="form-control input-sm" type="number" v-model="newVehicle.numberOfDoors" name="numberOfDoors" id="numberOfDoors" required></td>
				        </tr>
		
		 				<tr>
				          <td><label for="passengerCapacity">Passenger Capacity</label></td>
				           <td><input class="form-control input-sm" type="number" v-model="newVehicle.passengerCapacity" name="passengerCapacity" id="passengerCapacity" required></td>
				        </tr>
		
						<tr>
				          <td><label for="description">Description</label></td>
				           <td><input class="form-control input-sm" type="text" v-model="newVehicle.description" name="description" id="description"></td>
				        </tr>
						
						<tr>
				          	<td><label for="image">Image</label></td>
				          	<td class="d-flex">
								<input class="form-control input-sm" id="image" type="file" @change="fileUpload" accept="image/jpeg, image/png, image/gif" required />
								<button class="btn btn-primary btn-block ml-2 mb-2" type="button" data-toggle="modal" data-target="#image-preview-modal" > Preview </button>
							</td>
				        </tr>
		
			      	</table>
	
					<button class="btn btn-primary btn-block mt-3" type="submit" @submit="addVehicle">Add Vehicle</button>

			    </form>
	
	    		<p class="error-message text-center mt-3 text-danger">{{errorMessage}}</p>
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
		
	</div>
	    
	    `,
	mounted() {

		axios.get("rest/rentACars/getByCurrentManagerId", {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			}
		})
			.then(response => (this.rentACar = response.data));
	},

	methods: {

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

		addVehicle: function() {
			
			event.preventDefault();

			if (this.newVehicle.price <= 0) {
				this.errorMessage = "Price must be greater than 0.";
				return;
			} else if (this.newVehicle.fuelConsumption <= 0) {
				this.errorMessage = "Fuel consumption must be greater than 0.";
				return;
			}else if (this.newVehicle.numberOfDoors <= 0 || this.newVehicle.numberOfDoors > 6) {
				this.errorMessage = "Number of doors must be between 1 and 6.";
				return;
			}else if (this.newVehicle.passengerCapacity <= 0 || this.newVehicle.passengerCapacity > 15) {
				this.errorMessage = "Passenger capacity must be between 1 and 15.";
				return;
			}
			
			
			this.newVehicle.rentACarId = this.rentACar.id;
			this.newVehicle.image = this.imageBase64;
			axios.post("rest/vehicles/addVehicle", this.newVehicle, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			})
				.then(response => (router.push("/managerRentACar"))
				).catch((error) => {
					alert(error.response.data);
				});

		},
	}

});