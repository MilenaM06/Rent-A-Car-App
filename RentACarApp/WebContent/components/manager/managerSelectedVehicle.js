Vue.component("managerSelectedVehicle", { 
	data: function () {
	    return {
	    	vehicle : {
				
				id: "",
				brand: "",
				model : "",
				price: "",
				type: "",
				rentACarId : "",
				transmissionType : "",
				fuelType : "",
				fuelConsumption : "",
				numberOfDoors : "",
				passengerCapacity : "",
				description : "",
				image : "",
				status : ""
			},
			changedVehicle : {},
			buttonVisible: "",
			formVisible : "",
			errorMessage : "",
			imageBase64 : null,
			imageFile : null,
			isImageChanged: "false"
		}
	},
	    template: 
	    `    
	<div>
	    <div class="d-flex justify-content-center align-items-center h-100">
		    <div class="frame p-4">
		        <img src="images/milmar_just_logo.png" alt="" class="mx-auto d-block" width="80px">
		        <h1 class="text-center mt-1 text-secondary">{{ vehicle.brand }} {{ vehicle.model }}</h1>
				<img class="mx-auto d-block" width="300px" :src="vehicle.image">
				
		        <div class="text-center mt-4 mb-4">
		            <table class="table">
		
		                <tr>
		                    <td><label>Price:</label></td>
		                    <td><label>{{ vehicle.price }}€</label></td>
		                </tr>
		                <tr>
		                    <td><label>Type:</label></td>
		                    <td><label>{{ vehicle.type }}</label></td>
		                </tr>
		
		                <tr>
		                    <td><label>Transmission Type:</label></td>
		                    <td><label>{{ vehicle.transmissionType }}</label></td>
		                </tr>
		
		                <tr>
		                    <td><label>Fuel Type:</label></td>
		                    <td><label>{{ vehicle.fuelType }}</label></td>
		                </tr>
		
		                <tr>
		                    <td><label>Fuel Consumption:</label></td>
		                    <td><label>{{ vehicle.fuelConsumption }} l/100km</label></td>
		                </tr>
		
		                <tr>
		                    <td><label>Number Of Doors:</label></td>
		                    <td><label>{{ vehicle.numberOfDoors }}</label></td>
		                </tr>
		
		                <tr>
		                    <td><label>Passenger Capacity:</label></td>
		                    <td><label>{{ vehicle.passengerCapacity }}</label></td>
		                </tr>
		
		                <tr>
		                    <td><label>Description:</label></td>
		                    <td><p>{{ vehicle.description }}</p></td>
		                </tr>
		            </table>
		
		            <div class="d-flex justify-content-center">
						<div v-bind:hidden="buttonVisible=='NOT_VISIBLE'">
							<button class="btn btn-primary mr-2" v-on:click="changeVehicle()">Change Vehicle Info</button>
						</div>
						<button class="btn btn-secondary" v-on:click="deleteVehicle">Delete Vehicle</button>
		            </div>
		        </div>


				<div  v-if= "formVisible == 'VISIBLE'">
	                <form>
	                    <table>
	                        <tr>
	                           <td><label for="brand">Brand:</label></td>
	                           <td><input class="form-control input-sm" type="text" v-model="changedVehicle.brand" name="brand" id="brand" value="vehicle.brand"></td>
	                        </tr>
	                        <tr>
	                            <td><label for="model">Model:</label></td>
	                            <td><input class="form-control input-sm" type="text" v-model="changedVehicle.model" name="model" id="model"></td>
	                        </tr>
	                        <tr>
	                            <td><label for="price">Price:</label></td>
	                            <td><input class="form-control input-sm" type="number" v-model="changedVehicle.price" name="price" id="price"></td>
	                        </tr>
	                        <tr>
	                            <td><label for="type">Type:</label></td>
	                            <td>
	                                <select class="form-control input-sm" v-model="changedVehicle.type" name="type" id="type">
						              <option value="CAR">CAR</option>
						              <option value="VAN">VAN</option>
									  <option value="MOBILEHOME">MOBILEHOME</option>
						            </select>
	                            </td>
	                        </tr>
	                        <tr>
	                            <td><label for="transmissionType">Transmission Type:</label></td>
	                            <td>
	                                <select  class="form-control input-sm" v-model="changedVehicle.transmissionType" name="transmissionType" id="transmissionType">
						              <option value="MANUAL">MANUAL</option>
						              <option value="AUTOMATIC">AUTOMATIC</option>
						            </select>
	                            </td>
	                        </tr>     
	                        
	                        <tr>
	                            <td><label for="fuelType">Fuel Type:</label></td>
	                            <td>
	                                <select class="form-control input-sm" v-model="changedVehicle.fuelType" name="fuelType" id="fuelType">
						              <option value="DIESEL">DIESEL</option>
						              <option value="PETROL">PETROL</option>
									  <option value="HYBRID">HYBRID</option>
									  <option value="ELECTRIC">ELECTRIC</option>
						            </select>
	                            </td>
	                        </tr> 
	
	                        <tr>
	                            <td><label for="numberOfDoors">Number Of Doors:</label></td>
	                            <td><input class="form-control input-sm" type="number" v-model="changedVehicle.numberOfDoors" name="numberOfDoors" id="numberOfDoors"></td>
	                        </tr>
	
	                        <tr>
	                            <td><label for="passengerCapacity">Passenger Capacity:</label></td>
	                            <td><input class="form-control input-sm" type="number" v-model="changedVehicle.passengerCapacity" name="passengerCapacity" id="passengerCapacity"></td>
	                        </tr>
	
	                        <tr>
	                            <td><label for="description">Description:</label></td>
	                            <td><input class="form-control input-sm" type="text" v-model="changedVehicle.description" name="description" id="description"></td>
	                        </tr>
	
	                        <tr>
	                            <td><label for="image">Image:</label></td>
	                            <td class="d-flex">
									<input class="form-control input-sm" id="imageUpload" type="file" @change="fileUpload" accept="image/jpeg, image/png, image/gif" required />
									<button class="btn btn-primary btn-block ml-2 mb-2" type="button" data-toggle="modal" data-target="#image-preview-modal" > Preview </button>
								</td>
	                        </tr>
	
	                    </table>
	    
	                    <div class="d-flex justify-content-center" >
	                        <button class="btn btn-primary ml-2" v-on:click="confirmChange">Confirm</button>
	                        <button class="btn btn-secondary ml-2" v-on:click="discardChange">Discard</button>
	                    </div>
	                </form>
                	<p class="error-message text-center mt-3 text-danger">{{errorMessage}}</p>
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
		      
	</div>
	    
	    `,
    mounted () {
		this.vehicle.id = this.$route.params.vehicleId;
 
		axios.get("rest/vehicles/getById/" +  this.vehicle.id)
        		.then(response => {
									this.vehicle = response.data;
								});				
    },

    methods: {
		deleteVehicle: function(){
			event.preventDefault();
			axios.delete(`rest/vehicles/deleteVehicle/${this.vehicle.id}`, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			}).then( response => {
						
								alert(response.data);
								router.push("/managerRentACar");
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
		changeVehicle : function(){
			this.buttonVisible = "NOT_VISIBLE";
			this.formVisible = "VISIBLE";
			
			axios.get("rest/vehicles/getById/" +  this.vehicle.id)
        		.then(response => {
								this.changedVehicle = response.data;
								});		
			
		},
		
		confirmChange : function() {
			this.changedVehicle.id = this.vehicle.id;

			if(document.getElementById("imageUpload").files.length != 0){
				this.changedVehicle.image = this.imageBase64;
				this.isImageChanged = "true";
			}else{
				this.changedVehicle.image = this.vehicle.image;
			}
			
			axios.put("rest/vehicles/changeVehicle/" + this.isImageChanged, this.changedVehicle, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			})
			.then(response => {
								this.vehicle = response.data;
								this.isImageChanged = "false";
							});
			
			event.preventDefault();
			this.buttonVisible = "VISIBLE";
			this.formVisible = "NOT_VISIBLE"
		},
		
		discardChange : function(){
			event.preventDefault();
			this.buttonVisible = "VISIBLE";
			this.formVisible = "NOT_VISIBLE"
		}
	}

});