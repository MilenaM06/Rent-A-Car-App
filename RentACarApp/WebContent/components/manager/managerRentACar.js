Vue.component("managerRentACar", { 
	data: function () {
	    return {   
			rentACar : {
				
				id: "",
				name: "",
				status : "",
				location: {
					address: {
						street : "",
						number : "",
						city : "",
						country : "",
						postcode : ""
					},
					latitude : "",
					longitude : ""
				},
				logo: "",
				rating : "",
				workingHours: {
					startTime: "",
					endTime: ""
				}
			},
	    	vehicles : {}
	    }
	},
	    template: 
	    `
	<div>
		
	    <div class="container mt-4 mb-4 rounded-container">
			<h5 v-if="rentACar.id === ''" class="text-center mt-1 text-secondary justify-content-center">Currently, there is no object assigned to you.</h5>
        	<div class="row">

            	<div class="col-md-6">
                	<div class="text-center mt-4">

	                    <div class="mb-2"><img class="rounded" width="200px" :src="rentACar.logo"></div>
	                    
	                    <table class="table">
	                        <tr>
	                            <td><label>Name:</label></td>
	                            <td><label>{{ rentACar.name }}</label></td>
	                        </tr>
	
	                        <tr>
	                            <td><label>Status:</label></td>
	                            <td><label>{{ rentACar.status }}</label></td>
	                        </tr>
	
	                        <tr>
	                            <td><label>Location:</label></td>
	                            <td>
									<label>{{ rentACar.location.address.street }}, {{ rentACar.location.address.number }},  <br>
	                               {{ rentACar.location.address.city }}, {{ rentACar.location.address.country}}, {{ rentACar.location.address.postcode }} <br>
	                               {{ rentACar.location.latitude }}, {{ rentACar.location.longitude }} </label>
								</td>
	                        </tr>
	
	                        <tr>
	                            <td><label>Rating:</label></td>
	                            <td><label>{{ fixDouble(rentACar.rating) }} <i class="fas fa-star text-warning"></i></label></td>
	                        </tr>
	
	                        <tr>
	                            <td><label>Working hours:</label></td>
	                            <td><label> {{rentACar.workingHours.startTime}} - {{rentACar.workingHours.endTime}}</label></td>
	                        </tr>
	                    </table>
                	</div>
            	</div>
        
	            <div class="col-md-6">
	                <div class="map-frame">
	                    <div id="map" style="height: 400px; width: 400px"></div>
	                </div>
			    </div>

        	</div>
 		</div>
		
		<section class="container mt-4">
			<div class="row justify-content-center">				
	  			<div class="col-md-4 mb-4" v-for="v in vehicles"> 
	    			<div class="card" v-on:click="showVehicle(v.id)">
						<img class="card-img-top" height="250" :src="v.image">
						
						<div class="card-body">
	                        <h5 class="card-title">{{ v.brand }} {{ v.model }}</h5>
	                        <p class="card-text">{{v.type}}, {{v.transmissionType}}, {{v.fuelType}}</p>
	                        <p class="card-text">{{v.fuelConsumption}} l/100km, {{v.numberOfDoors}} doors, {{v.passengerCapacity}} passengers</p>
	                        <p class="card-text">{{v.description}}</p>
	                    </div>

						<div class="price">
	                        <span class="price-badge">{{ v.price }}€</span>
	                    </div>												
	    			</div>
	  			</div>	
		    </div>  
		</section>
			  
	</div>   	    
	    `,
    mounted () {

 			axios.get("rest/rentACars/getByCurrentManagerId" , {
							headers: {
								'Authorization': `Bearer ${localStorage.getItem('token')}`,
								'Content-Type': 'application/json'
							}
						})
        	.then(response => {
																
				if(response.data != ""){ 
					this.rentACar = response.data;
					this.initMap();
					
					axios.get("rest/vehicles/getByRentACarId/" + this.rentACar.id, {
								headers: {
									'Authorization': `Bearer ${localStorage.getItem('token')}`,
									'Content-Type': 'application/json'
								}
							}).then(response => (this.vehicles = response.data))
				}
				
			});
				

    },
    methods: {
		initMap: function() {
			
			var initialCoordinates = [this.rentACar.location.latitude, this.rentACar.location.longitude];

			this.mapInstance = L.map('map').setView(initialCoordinates, 10);

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
				maxZoom: 18
			}).addTo(this.mapInstance);

			// Set the initial marker position to the provided coordinates
			this.marker = L.marker(initialCoordinates, { draggable: false }).addTo(this.mapInstance);
			this.position = this.marker.getLatLng();
		},
		
		showVehicle : function(selectedVehicleId){
			router.push(`/managerSelectedVehicle/${selectedVehicleId}`);
		},
		fixDouble: function(rating){
			return Math.round(rating*100)/100;
		}
    }
});