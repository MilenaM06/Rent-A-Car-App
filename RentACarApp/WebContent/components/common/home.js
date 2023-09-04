Vue.component("home", {
	data: function() {
		return {
			id: '0',
			rentACars: [],
			searchResult: [],
			filteredObjects: [],
			searchInfo: {
				name: '',
				location: '',
				vehicleType: '',
				rating: ''
			},
			sortOption: 'Name',
			sortDirection: 'Ascending',
			filterOption: {
				transmissionType: 'ALL',
				fuelType: 'ALL',
				status: 'ALL'
			}
		}
	},
	template:
		`
	<div>

		<header class="jumbotron text-center">
	        <div class="homepicture_h1">
	            <h1>UNLOCK</h1>
	            <h1>YOUR</h1>
	            <h1>JOURNEY</h1>
	        </div>
	    </header>
		
		<div class="container mt-4 mb-4 rounded-container">
		    <form @submit="search">

				<div class="row mb-3">
	                <div class="col-md-3">
	            		<input class="form-control" type="text" v-model="searchInfo.name"  placeholder="Search by Name" />
					</div>
				
					 <div class="col-md-3">
						 <input class="form-control" type="text" v-model="searchInfo.location" placeholder="Search by City or Country" />
					</div>			
					
					 <div class="col-md-3">
						  <input  class="form-control" type="text" v-model="searchInfo.vehicleType" placeholder="Search by Vehicle type" />
					</div>
					
					 <div class="col-md-3">
						  <input  class="form-control" type="number" v-model="searchInfo.rating" step="0.01" min="0" max="5"  placeholder="Search by Rating" />
					</div>	
										            	           	         
				</div>
				
				<div class="row mb-3">
				
		            <div class="col-md-4">
			            <label>Transmission type:</label>
			            <select class="form-control" v-model="filterOption.transmissionType" v-on:change="applyFilter()">
							<option value="ALL">ALL</option>
                            <option value="AUTOMATIC">AUTOMATIC</option>
                            <option value="MANUAL">MANUAL</option>
			            </select>
		            </div>

					<div class="col-md-4">
			            <label>Fuel type:</label>
			            <select class="form-control" v-model="filterOption.fuelType" v-on:change="applyFilter()">
							<option value="ALL">ALL</option>
                            <option value="DIESEL">DIESEL</option>
                            <option value="PETROL">PETROL</option>
                            <option value="HYBRID">HYBRID</option>
                            <option value="ELECTRIC">ELECTRIC</option>
	                    </select>
		            </div>

					<div class="col-md-4">
			            <label>Status:</label>
	            		<select class="form-control" v-model="filterOption.status" v-on:change="applyFilter()">
							<option value="ALL">ALL</option>
                            <option value="OPEN">OPEN</option>
                            <option value="CLOSED">CLOSED</option>
	                    </select>
		            </div>
				</div>
				
				
				<div class="row mb-3">
	                <div class="col-md-12 d-flex justify-content-center">
			            <button class="btn btn-primary ml-2" type="submit">Search</button>
			            <button class="btn btn-secondary ml-2" v-on:click="clearSearch">Clear</button>
					</div>
				</div>
				
	           
				<div class="row mb-3">
                	<div class="col-md-6">
	            		<label>Sort:</label>
	            		<select class="form-control" v-model="sortOption" v-on:change="sort()">
                            <option>Name</option>
                            <option>Location</option>
                            <option>Rating</option>
	                    </select>
					</div>

					<div class="col-md-6">
	                    <label>&nbsp;</label>
		            	<select class="form-control" v-model="sortDirection" v-on:change="sort()">
                            <option>Ascending</option>
                            <option>Descending</option>
		                </select>
					</div>
				</div>
           </form>
		</div>
		

		<section class="container mt-3">
			<div class="row justify-content-center">
			
	  			<div class="col-md-4 mb-4" v-for="r in filteredObjects">
	    			<div class="card" v-on:click="showSelectedRentACar(r.id)">
						<img class="card-img-top" height="250" :src="r.logo" >
						
						<div class="card-body">
							<h5 class="card-title">{{ r.name }}</h5>
							<p class="card-text">{{ r.location.address.street }} {{ r.location.address.number }} <br>
                            {{ r.location.address.city }}, {{ r.location.address.country }}, {{ r.location.address.postcode }} <br>
                           {{ r.location.latitude }}, {{ r.location.longitude }}</p>
						</div>
						
						<div class="rating">
                        	<span class="rating-badge">{{fixDouble(r.rating)}} <i class="fas fa-star"></i></span>
                    	</div>
							
	    			</div>
	  			</div>	
			</div>
		</section>
	</div>
	    `,
	mounted() {
		axios.get("rest/rentACars/getAll")
			.then(response => {
				this.rentACars = response.data;
				this.searchResult = response.data;
				this.filteredObjects = response.data;
				this.sort();
			});
	},
	methods: {
		search: function() {
			event.preventDefault();
			var rating = this.searchInfo.rating;
			if (this.searchInfo.rating === '')
				rating = -1
			axios.get('rest/rentACars/search', {
				params: {
					name: this.searchInfo.name,
					location: this.searchInfo.location,
					vehicleType: this.searchInfo.vehicleType,
					rating: rating
				},
				headers: {
					'Content-Type': 'application/json'
				}
			})
				.then(response => {
					this.searchResult = response.data;
					this.applyFilter();
					this.sort();
				}).catch(function(error) {
					console.log(error);
				});
		},
		applyFilter: function() {
			this.filterByTransmissionType();
		},
		filterByTransmissionType: function() {
			if (this.filterOption.transmissionType === "ALL") {
				this.filteredObjects = this.searchResult;
				this.filterByFuelType();
			} else {
				axios.get(`rest/vehicles/getByTransmissionType/${this.filterOption.transmissionType}`,
					{
						headers: {
							'Content-Type': 'application/json'
						}
					}).then(response => {
						let objects = this.convertObjectToList(response.data);
						this.filteredObjects = this.searchResult.filter(object => objects.includes(object.id));
						this.filterByFuelType();
					});
			}
		},
		filterByFuelType: function() {
			if (this.filterOption.fuelType != "ALL") {
				axios.get(`rest/vehicles/getByFuelType/${this.filterOption.fuelType}`,
					{
						headers: {
							'Content-Type': 'application/json'
						}
					}).then(response => {
						let objects = this.convertObjectToList(response.data);
						this.filteredObjects = this.filteredObjects.filter(object => objects.includes(object.id));
						this.filterByStatus();
					});
			} else {
				this.filterByStatus(); // Continue to the next filter directly
			}
		},
		filterByStatus: function() {
			switch (this.filterOption.status) {
				case "OPEN":
					this.filteredObjects = this.filteredObjects.filter(object => object.status === 'OPEN');
					break;
				case "CLOSED":
					this.filteredObjects = this.filteredObjects.filter(object => object.status === 'CLOSED');
					break;
				default:
					break;
			}
		},
		sort: function() {
			switch (this.sortOption) {
				case "Name":
					this.filteredObjects.sort((a, b) => this.compare(a.name.toLowerCase(), b.name.toLowerCase()));
					break;
				case "Location":
					this.filteredObjects.sort((a, b) => this.compare(a.location.address.street.toLowerCase(), b.location.address.street.toLowerCase()));
					break;
				case "Rating":
					this.filteredObjects.sort((a, b) => this.compare(a.rating, b.rating));
					break;
				default:
					break;
			}
		},
		compare: function(a, b) {
			if (a < b) {
				if (this.sortDirection === 'Ascending')
					return -1;
				else
					return 1;
			}
			if (a > b) {
				if (this.sortDirection === 'Ascending')
					return 1;
				else
					return -1;
			}
			return 0;
		},
		clearSearch: function() {
			event.preventDefault();
			this.searchInfo.name = '';
			this.searchInfo.location = '';
			this.searchInfo.vehicleType = '';
			this.searchInfo.rating = '';
			this.filterOption.transmissionType = 'ALL';
			this.filterOption.fuelType = 'ALL';
			this.filterOption.status = 'ALL';
			this.searchResult = this.rentACars;
			this.filteredObjects = this.rentACars;
			this.sort();
		},
		convertObjectToList: function(object) {
			return object.map(obj => obj.rentACarId);
		},
		showSelectedRentACar: function(selectedRentACarId) {
			router.push(`/selectedRentACar/${selectedRentACarId}`);
		},
		fixDouble: function(rating){
			return Math.round(rating*100)/100;
		}
	}
});