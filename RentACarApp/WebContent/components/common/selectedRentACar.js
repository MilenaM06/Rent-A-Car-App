Vue.component("selectedRentACar", { 
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
			rentACarId : {},
	    	vehicles : {},
			comments : {}
	    }
	},
	    template: 
	    `
	<div>
	
	    <div class="container mt-4 rounded-container">
			<div class="row">
				<div class="col-md-6">
					<div class="text-center mt-4">
					
						<div class="mb-2">
							<img :src="rentACar.logo" class="rounded" height="200px">
						</div>		
						
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
	                            <td><label>{{ rentACar.location.address.street }}, {{ rentACar.location.address.number }}, <br>
	                                {{ rentACar.location.address.city }}, {{ rentACar.location.address.country}}, {{ rentACar.location.address.postcode }}, <br>
	                                {{ rentACar.location.latitude }}, {{ rentACar.location.longitude }}</label>
								</td>
                   	 		</tr>

							<tr>
	                            <td><label>Rating:</label></td>
	                            <td><label>{{ fixDouble(rentACar.rating) }} <i class="fas fa-star text-warning"></i> </label></td>
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
	    			<div class="card">
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

		<div class="container mt-4 mb-4">
	        <div class="card">
	            <div class="card-header bg-light" >
	                Comments
	            </div>
	            <div class="card-body">
	                
	                <div class="media" v-for="c in comments">
	                    <div class="media-body" >
	                        <h5 class="mt-0 d-flex align-items-center">{{c.customerUsername}}</h5>
	                        <span class="ml-2"> {{c.rating}} <i class="fas fa-star text-warning"></i></span> {{c.content}}
	                        <hr>
	                    </div>
	                </div>
	           </div>
	        </div>
   	 	</div>
	</div>   	    
	    `,
	mounted() {
		this.rentACarId = this.$route.params.rentACarId;
		axios.get("rest/vehicles/getByRentACarId/" + this.rentACarId)
			.then(response => (this.vehicles = response.data));

		axios.get("rest/rentACars/getById/" + this.rentACarId)
			.then(response => {
				this.rentACar = response.data;
				this.initMap();
			});
			
		axios.get("rest/comments/getAcceptedByRentACarId/" + this.rentACarId)
        		.then(response => (this.comments = response.data));
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
		fixDouble: function(rating){
			return Math.round(rating*100)/100;
		}
    }
});