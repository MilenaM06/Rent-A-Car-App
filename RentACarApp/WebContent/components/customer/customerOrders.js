Vue.component("customerOrders", {
	data: function() {
		return {
			backupOrders: [],
			orders: [],
			searchInfo: {
				name: null,
				priceLower: null,
				priceUpper: null,
				startDate: null,
				endDate: null,
				status: "ALL"
			},
			sortOption: "Name",
			sortDirection: "Ascending",
			selectedOrder: "",
			comment: {
				content: "",
				rating: ""
			}
		}
	},
	template:
		`
	<div>
		<div>	
			
			<div class="container mt-4 rounded-container">

				<div class="row mb-3">					
	                <div class="col-md-2">
						<label>Rent A Car Name:</label>
	                    <input class="form-control" type="text" v-model="searchInfo.name" name="name" placeholder="Name"> 
	                </div>

					<div class="col-md-3">
						<label>Start Date:</label>
	                    <input class="form-control" type="date" v-model="searchInfo.startDate" name="startDate"> 
	                </div>
	
	                <div class="col-md-3">
						<label>End Date:</label>
	                    <input class="form-control" type="date" v-model="searchInfo.endDate" name="endDate">
	                </div>

	                <div class="col-md-2">
						<label>The lowest price:</label>
	                    <input class="form-control" type="number" v-model="searchInfo.priceLower" name="priceLower" placeholder="From"> 
	                </div>

	                <div class="col-md-2">
						<label>The highest price:</label>
	                    <input class="form-control" type="number" v-model="searchInfo.priceUpper" name="priceUpper" placeholder="Up to"> 
	                </div>
	            </div>

				<div class="md-4 mb-3">
					<label>Status:</label>
					<select class="form-control" v-model="searchInfo.status">
						<option>ALL</option>
						<option>PROCESSING</option>
						<option>APPROVED</option>
						<option>TAKEN</option>
						<option>RETURNED</option>
						<option>DECLINED</option>
						<option>CANCELLED</option>
					</select>
				</div>
				
				 <div class="row mb-3">
	                <div class="col-md-12 d-flex justify-content-center">
	                    <button class="btn btn-primary ml-2" v-on:click="search">Search</button>
	                    <button class="btn btn-secondary ml-2" v-on:click="clear">Clear</button> 
	                </div>
	            </div>

				 <div class="row mb-3">
			
	                <div class="col-md-6">
	                    <label>Sort:</label>
	                    <select class="form-control" v-model="sortOption" v-on:change="sort()">
							<option>Name</option>
							<option>Price</option>
							<option>Date</option>
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

			</div>
		
		  	<section class="container mt-4">
				<div class="row justify-content-center">
				
		  			<div class="col-md-4 mb-4" v-for="o in orders">
		    			<div class="card">
							<div class="card-body">
		                        <h5 class="card-title">{{ o.rentACarName }}</h5>
 								<p class="card-text">Unique ID: {{ o.uniqueId }}</p>
		                        <p class="card-text">Start date: {{ new Date(o.startDate).toLocaleDateString('sr-RS') }} </p>
								<p class="card-text">End date: {{ new Date(o.endDate).toLocaleDateString('sr-RS') }}</p>
		                        <p class="card-text">{{ o.status }}</p>
								<div class="d-flex justify-content-center">
									<button class="btn btn-primary mr-2" v-show="o.status === 'PROCESSING'" v-on:click="cancelOrder(o)" >Cancel</button>	
									<button class="btn btn-primary mr-2" v-if="checkCommentButtonVisiblity(o)" data-toggle="modal" data-target="#comment-modal"  v-on:click = "changeSelectedOrder(o)">Comment</button>
									<button class="btn btn-primary mr-2" type="button" data-toggle="modal" data-target="#order-modal" v-on:click = "changeSelectedOrder(o)">Show order</button>   
								</div>
								
		                    </div>
							
							<div class="price">
		                        <span class="price-badge">{{ o.price }}€</span>
		                    </div>
							
		    			</div>
		  			</div>	
			   		 
			    </div>  
			</section>

		</div>
	
	
		<div class="modal fade" id="order-modal" role="dialog" aria-hidden="true">
		  <div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
			
				<div class="modal-header">
					<h5 class="modal-title">Order</h5>
	          		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
	           			<span aria-hidden="true">&times;</span>
	          		 </button>
				</div>
				
				<div class="modal-body">
	                <div class="text-center">

	                  <table class="table">
						
						<tr>
	                        <td>Rent A Car:</td>
	                        <td>{{ selectedOrder.rentACarName }}</td>
	                    </tr>
						
	                    <tr>
	                        <td>Unique code:</td>
	                        <td>{{ selectedOrder.uniqueId }}</td>
	                    </tr>
	
	                    <tr>
	                        <td>Start date:</td>
	                        <td>{{ new Date(selectedOrder.startDate).toLocaleDateString('sr-RS') }}</td>
	                    </tr>
	
	                    <tr>
	                        <td>End date:</td>
	                        <td>{{ new Date(selectedOrder.endDate).toLocaleDateString('sr-RS')}}</td>
	                    </tr>
	
	                    <tr> 
	                        <td>Price:</td>
	                        <td>{{selectedOrder.price}}€</td>
	                    </tr>						

						<tr v-for="v in selectedOrder.vehicles">
	                        <td>{{ v.brand }} {{ v.model }}</td>		      				
	                        <td><img width="100px" :src="v.image"></td>
	                    </tr>
	
	                    <tr>
	                        <td>Status:</td>
	                        <td>{{selectedOrder.status}}</td>
	                    </tr>  

						<tr v-show="selectedOrder.status === 'DECLINED'">
	                        <td>Decline reason:</td>
	                        <td>{{selectedOrder.declineReason}}</td>
	                    </tr> 
                   
	                  </table>
	                </div>		
				</div>
			
			</div>
		</div>	   
	</div>	
	
	<div class="modal fade" id="comment-modal" role="dialog" aria-hidden="true">
	  <div class="modal-dialog modal-dialog-centered">
		<div class="modal-content">
		
			<div class="modal-header">
				<h5 class="modal-title" >Comment</h5>
          		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
           			<span aria-hidden="true">&times;</span>
          		 </button>
			</div>
			
			 <div class="modal-body">
				<div class="d-flex justify-content-center align-items-center">
					<table>
						<tr>
							<td><label>Comment:</label></td>
							<td><input class="form-control input-sm" type="text" v-model="comment.content"/></td>
						</tr>
						
						<tr>
							<td><label>Rating(1-5):</label></td>
							<td><input class="form-control input-sm" type="number" v-model="comment.rating"></td>
						</tr>
					</table>
				</div>
				
				<button class="btn btn-primary btn-block mt-3" v-on:click="confirmComment" data-dismiss="modal" aria-label="Close">Confirm</button>
			</div>
			
		</div>
	</div>
	</div>
	   
	</div> 
	    `,
	mounted() {

		axios.get("rest/orders/getByCurrentCustomerId", {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			}
		})
			.then(response => {

				this.orders = response.data;
				this.backupOrders = response.data;

				if (this.orders != 0) {
					this.selectedOrder = this.orders[0];
				}
			});
	},
	methods: {
		search: function() {
			this.orders = this.searchByNames(this.backupOrders);
			this.orders = this.searchByPrices(this.orders);
			this.orders = this.searchByDates(this.orders);
			this.orders = this.filterByStatus(this.orders);
			this.sort();
		},
		cancelOrder: function(o) {
			axios.put(`rest/orders/cancelOrder`, o, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			})
				.then(response => {
					o.status = 'CANCELLED';
				});
		},

		searchByNames: function(searchedOrders) {

			searchName = this.searchInfo.name;
			var filteredOrders = [];

			for (var o of searchedOrders) {
				if (searchName !== null) {
					if (o.rentACarName.toLowerCase().includes(searchName.toLowerCase())) {
						filteredOrders.push(o);
					}
				} else {
					return searchedOrders;
				}
			}
			return filteredOrders;
		},

		searchByPrices: function(searchedOrders) {

			searchPriceLower = this.searchInfo.priceLower;
			searchPriceUpper = this.searchInfo.priceUpper;
			var filteredOrders = [];

			for (var o of searchedOrders) {
				if (searchPriceLower !== null && searchPriceUpper !== null) {
					if (o.price >= searchPriceLower && o.price <= searchPriceUpper) {
						filteredOrders.push(o);
					}
				} else if (searchPriceLower !== null) {
					if (o.price >= searchPriceLower) {
						filteredOrders.push(o);
					}
				} else if (searchPriceUpper !== null) {
					if (o.price <= searchPriceUpper) {
						filteredOrders.push(o);
					}
				} else {
					return searchedOrders;
				}
			}
			return filteredOrders;
		},

		searchByDates: function(searchedOrders) {

			searchStartDate = new Date(this.searchInfo.startDate).setHours(0, 0, 0, 0);
			searchEndDate = new Date(this.searchInfo.endDate).setHours(0, 0, 0, 0);
			var filteredOrders = [];
			for (var o of searchedOrders) {
				orderStartDate = new Date(o.startDate);
				orderEndDate = new Date(o.endDate);

				if (searchStartDate > new Date(1970, 2, 1) && searchEndDate > new Date(1970, 2, 1)) {
					if (orderStartDate >= searchStartDate && orderEndDate <= searchEndDate) {
						filteredOrders.push(o);
					}
				} else if (searchStartDate > new Date(1970, 2, 1)) {
					if (orderStartDate >= searchStartDate) {
						filteredOrders.push(o);
					}
				} else if (searchEndDate > new Date(1970, 2, 1)) {
					if (orderEndDate <= searchEndDate) {
						filteredOrders.push(o);
					}
				} else {
					return searchedOrders;
				}
			}
			return filteredOrders;
		},
		filterByStatus: function(searchedOrders) {
			var filteredOrders = [];

			if (this.searchInfo.status === "ALL") {
				return searchedOrders;
			} else {
				for (var o of searchedOrders) {
					if (o.status === this.searchInfo.status) {
						filteredOrders.push(o);
					}
				}
			}
			return filteredOrders;
		},

		clear: function() {
			this.orders = this.backupOrders;
			this.searchInfo.name = "";
			this.searchInfo.priceLower = "";
			this.searchInfo.priceUpper = "";
			this.searchInfo.startDate = "";
			this.searchInfo.endDate = "";
			this.searchInfo.status = "ALL";
		},

		sort: function() {
			switch (this.sortOption) {
				case "Name":
					this.orders.sort((a, b) => this.compare(a.rentACarName.toLowerCase(), b.rentACarName.toLowerCase()));
					break;
				case "Price":
					this.orders.sort((a, b) => this.compare(a.price, b.price));
					break;
				case "Date":
					this.orders.sort((a, b) => this.compare(a.startDate, b.startDate));
					break;

				default:
					this.orders.sort((a, b) => (a.price > b.price ? 1 : -1));
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
		changeSelectedOrder: function(order) {
			this.selectedOrder = order;
		},

		checkCommentButtonVisiblity: function(order) {
			return (order.commentId == '0' && order.status === "RETURNED" && !(order.rentACarName === "DELETED OBJECT"));
		},

		confirmComment: function() {

			event.preventDefault();

			if (!this.comment.content) {
				alert(`Comment is required`);
				return;
			} else if (this.comment.rating < 1 || this.comment.rating > 5) {
				alert(`Rating must be between 1 and 5`);
				return;
			}

			this.comment.customerId = this.selectedOrder.customerId;
			this.comment.rentACarId = this.selectedOrder.rentACarId;

			axios.post(`rest/comments/add/${this.selectedOrder.id}`, this.comment, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			})
				.then(response => {
					this.selectedOrder.commentId = response.data;
				});

		}
	}

});