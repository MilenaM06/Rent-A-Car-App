Vue.component("rentVehicle", {
	data: function() {
		return {
			availableVehicles: {},
			wantedStart: null,
			wantedEnd: null,
			errorMessage: '',
			cart: {
				customerId: '',
				items: []
			},
			cartPrice: 0,
			discount: 0

		}
	},
	template:
		`
	<div>
		<div class="d-flex justify-content-between align-items-center">
    		<div></div>
			<button class="btn btn-primary mr-2 mt-2 ml-2" type="button" data-toggle="modal" data-target="#cart-modal">Show cart</button>
		</div>
		
		<div class="container mt-4 mb-4 rounded-container">

	            <div class="row mb-3 d-flex justify-content-center align-items-center">
	                <div class="col-md-3">
						<label>Start Date:</label>
	                    <input class="form-control" type="date" v-model="wantedStart" name="wantedStartDate" :editable="true" v-on:change="isDateRangeValid()">
	                </div>

	                <div class="col-md-3">
						<label>End Date:</label>
	                    <input class="form-control" type="date" v-model="wantedEnd" name="wantedEndDate" :editable="true" v-on:change="isDateRangeValid()">
	                </div>
	            </div>
	
	            <div class="row mb-3">
	                <div class="col-md-12 d-flex justify-content-center">
	                   <button class="btn btn-primary ml-2" v-on:click="search">Search</button> 
	                </div>
	            </div>
	
	            <p class="error-message text-center mt-3">{{errorMessage}}</p>   
    	</div>

		<section class="container mt-3">
		   	<div class="row justify-content-center">

		      <div class="col-md-4 mb-4" v-for="v in availableVehicles">

		         <div class="card">
					<img class="card-img-top" height="250"" :src="v.image"><br>
                    <div class="card-body">
                        <h5 class="card-title">{{ v.brand }} {{ v.model }}</h5>
                        <p class="card-text">{{v.type}}, {{v.transmissionType}}, {{v.fuelType}}</p>
                        <p class="card-text">{{v.fuelConsumption}} l/100km, {{v.numberOfDoors}} doors, {{v.passengerCapacity}} passengers</p>
                        <p class="card-text">{{v.description}}</p>
                        <button class="btn btn-primary btn-block" v-on:click="addToCart(v)">Add to cart</button>
                    </div>

                    <div class="price">
                        <span class="price-badge">{{ v.price }}€</span>
                    </div>
		            
		         </div>
		      </div>
		   </div>
		</section>


	   <div class="modal fade" id="cart-modal" tabindex="-1" role="dialog" aria-labelledby="cart-modal-label" aria-hidden="true">
	      <div class="modal-dialog modal-dialog-centered modal-lg"> 
	         <div class="modal-content">

	            <div class="modal-header">
	               <h5 class="modal-title" id="cart-modal-label">Shopping cart</h5>
	               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
	               <span aria-hidden="true">&times;</span>
	               </button>
	            </div>

	            <div class="modal-body">

					<div class="text-center">
	                    <p>Cart price: {{cartPrice}} €</p>
	                    <p>Price with discount: {{(cartPrice * (100 - discount)/100)}} €</p>
	                </div>

	                <button class="btn btn-primary btn-block" v-on:click="emptyCart" v-show="cart.items.length !== 0">Empty cart</button>

	                 <table class="table" v-show="cart.items.length !== 0">
	                    <thead>
	                       <tr>
	                          <th>Dates</th>
	                          <th>Vehicles</th>
	                          <th>Price</th>
	                          <th></th>
	                       </tr>
	                    </thead>
	                    <tbody>	
	                       <tr v-for="item in cart.items">
	                        <td>From: {{new Date(item.startDate).toLocaleDateString('sr-RS')}} <br>
								To: {{new Date(item.endDate).toLocaleDateString('sr-RS')}}</td>
	                        <td>
	                           <table class="table">
	                              <tbody>
	                                 <tr v-for="vehicle in item.vehicles">
	                                    <td><img v-bind:src="vehicle.image" class="img-fluid rounded" style="max-height: 50px; max-width: 70px" ></td>
	                                    <td>{{vehicle.brand}}</td>
	                                    <td>{{vehicle.model}}</td>
	                                    <td>{{vehicle.price}}€</td>
	                                    <td><button class="btn btn-primary" v-on:click="removeVehicle(item, vehicle)">Remove</button></td>
	                                 </tr>
	                              </tbody>
	                           </table>
	                        </td>
	                        <td>{{item.price}}€</td>
	                        <td><button class="btn btn-primary" v-on:click="removeItem(item)">Remove</button></td>
	                     </tr>
	                    </tbody>
	                </table>
               		<button class="btn btn-primary btn-block" v-on:click="createOrders" v-show="cart.items.length !== 0">Make order</button>
	              </div>

	            </div>
	         </div>
	      </div>
	   </div>


	</div>
	    `,
	mounted() {
		this.getDiscount();
		axios.get("rest/carts/getCustomerCart", {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			}
		})
			.then(response => {
				this.cart = response.data;
				this.calculatePrice();
			});
	},
	components: {
		vuejsDatepicker
	},
	methods: {
		search: function() {
			this.isDateRangeValid();
			if (this.errorMessage === "") {
				axios.get("rest/vehicles/getAvailable/" + this.wantedStart + "/" + this.wantedEnd)
					.then(response => { this.availableVehicles = response.data })
					.catch(error => { console.error(error); });
			}
		},
		calculatePrice: function() {
			this.cartPrice = 0;
			for (let item of this.cart.items) {
				this.cartPrice += item.price;
			}
		},
		getDiscount: function() {
			axios.get("rest/customersInfo/getDiscount", {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			})
				.then(response => {
					this.discount = response.data;
				});
		},
		addToCart: function(v) {
			if (!this.doesOrderExist(v)) {
				for (let item of this.cart.items) {
					if (item.rentACarId === v.rentACarId && item.startDate === this.wantedStart && item.endDate === this.wantedEnd) {
						item.vehicles.push(v);
						days = ((new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
						item.price += (v.price * days);
						this.cartPrice += (v.price * days);
						axios.post("rest/carts/addVehicle", item, {
							headers: {
								'Authorization': `Bearer ${localStorage.getItem('token')}`,
								'Content-Type': 'application/json'
							}
						})
							.then(response => { });
						alert(`${v.brand} ${v.model} has been added to cart`);
						return;
					}
				}
				let newItem = {
					id: '1',
					uniqueId: '1',
					vehicles: [],
					rentACarId: v.rentACarId,
					rentACarName: "",
					startDate: this.wantedStart,
					endDate: this.wantedEnd,
					price: 0.0,
					customerId: '0',
					status: 'PROCESSING',
					declineReason: '',
					commentId: '0'
				};
				newItem.vehicles.push(v);
				days = ((new Date(newItem.endDate).getTime() - new Date(newItem.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
				newItem.price += (v.price * days);
				this.cartPrice += (v.price * days);

				axios.post("rest/carts/addItem", newItem, {
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'application/json'
					}
				})
					.then(response => {
						newItem.uniqueId = response.data;
						this.cart.items.push(newItem);
					});
				alert(`${v.brand} ${v.model} has been added to cart`);
			} else {
				alert(`${v.brand} ${v.model} is already in cart`);
			}

		},
		removeVehicle: function(item, vehicle) {
			event.preventDefault();
			axios.delete(`rest/carts/removeVehicle/${item.uniqueId}/${vehicle.id}`, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			}).then(response => {
				item.vehicles = item.vehicles.filter(v => v.id !== vehicle.id);
				days = ((new Date(item.endDate).getTime() - new Date(item.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;
				item.price -= (vehicle.price * days);
				if (item.vehicles.length === 0) {
					this.cart.items = this.cart.items.filter(i => i.vehicles.length !== 0);
				}
				this.cartPrice -= (vehicle.price * days);

			}).catch(error => {
				console.error(error);
			});
		},
		removeItem: function(i) {
			event.preventDefault();
			axios.delete(`rest/carts/removeItem/${i.uniqueId}`, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			})
				.then(response => {
					this.cart.items = this.cart.items.filter(item => item !== i);
					this.calculatePrice();
				})
				.catch(error => {
					console.error(error);
				});
		},
		emptyCart: function() {
			axios.post("rest/carts/emptyCart", {}, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			}).then(response => {
				this.cart = {
					customerId: response.data,
					items: []
				};
				this.cartPrice = 0;
			});
		},
		doesOrderExist: function(newVehicle) {
			for (let item of this.cart.items) {
				const isObjectSame = item.rentACarId === newVehicle.rentACarId;
				const isInDateRange1 = this.wantedStart <= item.startDate && this.wantedEnd >= item.startDate;
				const isInDateRange2 = this.wantedStart >= item.startDate && this.wantedStart <= item.endDate;
				if ((isInDateRange1 || isInDateRange2) && isObjectSame) {
					for (let vehicle of item.vehicles) {
						if (vehicle.id === newVehicle.id) {
							return true;
						}
					}
				}
			}
			return false;
		},
		isDateRangeValid: function() {
			if (!this.wantedStart || !this.wantedEnd) {
				this.errorMessage = "Please input date range";
				this.availableVehicles = {};
			} else if (this.wantedStart > this.wantedEnd) {
				this.errorMessage = "Start should be before end";
				this.availableVehicles = {};
			} else if (new Date(this.wantedStart) <= new Date() || new Date(this.wantedEnd) <= new Date()) {
				this.errorMessage = "Dates can't be before today";
				this.availableVehicles = {};
			} else {
				this.errorMessage = "";
				this.availableVehicles = {};
			}
		},
		createOrders: function() {
			axios.post("rest/orders/add", this.cart.items, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			})
				.then((response) => {
					console.log(response.data);
					$("#cart-modal").modal("hide");
					this.search();
					this.emptyCart();
					this.getDiscount();
				})
				.catch(error => {
					this.errorMessage = error.response.data.message;
				});
		}
	}

});