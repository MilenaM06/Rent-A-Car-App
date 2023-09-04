Vue.component("managerOrders", {
	data: function () {
		return {
			rentACar: {},
			backupOrders: [],
			orders: [],
			searchInfo : {
				priceLower: null,
				priceUpper: null,
				startDate: null,
				endDate: null,
				status: "ALL"
			},
			sortOption: "Price",
			sortDirection: "Ascending",
			selectedOrder: "",
			declineReason: "",
			declineClicked: false
		}
	}, 
	template:
	`
	<div>
		
 		<div class="container mt-4 mb-4 rounded-container">

            <div class="row mb-3">
                <div class="col-md-3">
					<label>Start Date:</label>
                    <input class="form-control" type="date" v-model="searchInfo.startDate" name="startDate" :editable="true"> 
                </div>
                <div class="col-md-3">
					<label>End Date:</label>
                    <input class="form-control" type="date" v-model="searchInfo.endDate" name="endDate" :editable="true">
                </div>
                <div class="col-md-3">
					<label>The lowest price:</label>
                    <input class="form-control" type="number" v-model="searchInfo.priceLower" name="priceLower" placeholder="From"> 
                </div>
                <div class="col-md-3">
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
		
		
		<section class="container mt-3">
			<div class="row justify-content-center">
			
	  			<div class="col-md-4 mb-4" v-for="o in orders">
	    			<div class="card">


	                    <div class="card-body">
	                        <h5 class="card-title">{{ o.customerFullName }}</h5>
							<p class="card-text">Unique ID: {{ o.uniqueId }}</p>
	                        <p class="card-text">Start date: {{ new Date(o.startDate).toLocaleDateString('sr-RS') }}</p>
							<p class="card-text">End date: {{ new Date(o.endDate).toLocaleDateString('sr-RS') }}</p>
	                        <p class="card-text">{{ o.status }}</p>
							<div class="d-flex justify-content-center">
								 <button class="btn btn-primary btn-block ml-2 mr-2 mb-2" type="button" data-toggle="modal" data-target="#order-modal" v-on:click = "changeSelectedOrder(o)">Show order</button>	
							</div>
	                    </div>
	                   	  	            
						<div class="price">
		                        <span class="price-badge">{{ o.price }}€</span>
		                </div>
									
	    			</div>
	  			</div>
		
			</div>	
		</section>
		
		<div class="modal fade" id="order-modal" role="dialog" aria-hidden="true">
		  <div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
			
				<div class="modal-header">
					<h5 class="modal-title" id="cart-modal-label">Order</h5>
              		<button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click= "goBack()">
               			<span aria-hidden="true">&times;</span>
              		 </button>
				</div>
				
				 <div class="modal-body">
			
				 	<div class="text-center">
	                  	<table class="table">
	
		                    <tr v-for="v in selectedOrder.vehicles">
		                        <td>{{ v.brand }} {{ v.model }}</td>		      				
		                        <td><img width="100px" :src="v.image"></td>
		                    </tr>	

							<tr>
		                        <td>Customer:</td>
		                        <td>{{selectedOrder.customerFullName}}</td>
		                    </tr>	
		
		                    <tr>
		                        <td>Unique code:</td>
		                        <td>{{selectedOrder.uniqueId}}</td>
		                    </tr>
		
		                    <tr>
		                        <td>Start date:</td>
		                        <td>{{ new Date(selectedOrder.startDate).toLocaleDateString('sr-RS') }}</td>
		                    </tr>
		
		                    <tr>
		                        <td>End date:</td>
		                        <td>{{ new Date(selectedOrder.endDate).toLocaleDateString('sr-RS') }}</td>
		                    </tr>
		
		                    <tr> 
		                        <td>Price:</td>
		                        <td>{{selectedOrder.price}}€</td>
		                    </tr>
		
		                    <tr>
		                        <td>Status:</td>
		                        <td> {{selectedOrder.status}} </td>
		                    </tr>                     
                  		</table>

                 		<button class="btn btn-primary" type="button"  v-on:click = "changeOrderStatus('APPROVED')" v-if="checkOrderStatus('PROCESSING')" >Change Status to Approved</button>	
						<button class="btn btn-secondary" type="button"  v-on:click = "declineOrder()" v-if="checkOrderStatus('PROCESSING')" >Change Status to Declined</button>
							
						<div>	
							<label v-if="declineClicked">Decline reason:</label>
							<input type="text" v-model="declineReason" name="declineReason" v-if="declineClicked" :editable="true"></input> 
						</div>
						
						<button class="btn btn-primary" type="button" v-on:click = "changeOrderStatus('DECLINED')" v-if="declineClicked" >Confirmation of the decline</button>	
						<button class="btn btn-secondary" type="button" v-on:click = "goBack()" v-if="declineClicked" >Go back</button>
						<button class="btn btn-primary" type="button" v-on:click = "changeOrderStatus('TAKEN')" v-if="checkOrderStatus('APPROVED')" >Change Status to Taken</button>
						<button class="btn btn-primary" type="button" v-on:click = "changeOrderStatus('RETURNED')" v-if="checkOrderStatus('TAKEN')" >Change Status to Returned</button>

               	 	</div>
							
				</div>
				
			</div>
		</div>
	</div>
	</div>
	
	`,
	mounted(){

			axios.get("rest/rentACars/getByCurrentManagerId", {
							headers: {
								'Authorization': `Bearer ${localStorage.getItem('token')}`,
								'Content-Type': 'application/json'
							}
						})
        	.then(response => {
	
				this.rentACar = response.data

				axios.get("rest/orders/getByRentACarId/" + this.rentACar.id, {
							headers: {
								'Authorization': `Bearer ${localStorage.getItem('token')}`,
								'Content-Type': 'application/json'
							}
						})
        		.then(response => 
						{	this.backupOrders = response.data;
							this.orders = response.data;
							this.declineClicked = false;
							
							if(this.orders != 0){
								this.selectedOrder = this.orders[0];
							}
						})
				});	
	},
	
	methods: {	
		search: function() {
			this.orders = this.searchByPrices(this.backupOrders);
			this.orders = this.searchByDates(this.orders);	
			this.orders = this.filterByStatus(this.orders);

			this.sort();
		},
		
		searchByPrices: function(searchedOrders) {
			
            searchPriceLower = this.searchInfo.priceLower;
            searchPriceUpper = this.searchInfo.priceUpper;
			var filteredOrders = [];

			for(var o of searchedOrders){
				 if (searchPriceLower !== null && searchPriceUpper !== null) {
                    if(o.price >= searchPriceLower && o.price <= searchPriceUpper){
					filteredOrders.push(o);
					}
                } else if (searchPriceLower !== null) {
                    if(o.price >= searchPriceLower){
					filteredOrders.push(o);
					}
                } else if (searchPriceUpper !== null) {
                    if(o.price <= searchPriceUpper){
					filteredOrders.push(o);
					}
                } else {
                   return searchedOrders;
                }
			}
			return filteredOrders;     
		},


	 	searchByDates: function(searchedOrders) {
					
            searchStartDate = new Date(this.searchInfo.startDate);
            searchEndDate = new Date(this.searchInfo.endDate);
			var filteredOrders = [];
			for(var o of searchedOrders){
				orderStartDate = new Date(o.startDate);
				orderEndDate = new Date(o.endDate);

				if(searchStartDate > new Date(1970, 2, 1) && searchEndDate > new Date(1970,2,1)){
                    if(orderStartDate >= searchStartDate && orderEndDate <= searchEndDate){
						filteredOrders.push(o);
					}
				}else if(searchStartDate > new Date(1970, 2, 1)){
					if(orderStartDate >= searchStartDate){
						filteredOrders.push(o);
					}
				}else if(searchEndDate > new Date(1970, 2, 1)){
					if(orderEndDate <= searchEndDate){
						filteredOrders.push(o);
					}
				}else{
					return searchedOrders;
				}
			}    
			return filteredOrders;  
		},
		
		filterByStatus: function(searchedOrders) {
			var filteredOrders = [];	
									
			if(this.searchInfo.status === "ALL"){	
				return searchedOrders;		
			}else{
				for(var o of searchedOrders){
					if(o.status === this.searchInfo.status){
						filteredOrders.push(o);
					}
				}
			}	
			return filteredOrders;
		},
		clear: function() {
			this.orders = this.backupOrders;
			this.searchInfo.priceLower = "";
			this.searchInfo.priceUpper = "";
			this.searchInfo.startDate = "";
			this.searchInfo.endDate = "";
			this.searchInfo.status = "ALL";
		},
		
		sort: function() {
			switch (this.sortOption) {
				case "Price":
						this.orders.sort((a, b) =>this.compare(a.price, b.price));
					break;
				case "Date":
					this.orders.sort((a, b) =>this.compare(a.startDate, b.startDate));
				break;

				default:
					this.orders.sort((a, b) => (a.price > b.price ? 1 : -1));
			}
		},
		compare : function(a, b){
                if (a < b) {
                    if(this.sortDirection === 'Ascending')
                        return -1;
                    else
                        return 1;
                }
                if (a > b) {
                    if(this.sortDirection === 'Ascending')
                        return 1;
                    else
                        return -1;
                }
                return 0;
         },
		changeSelectedOrder: function(order){
			this.selectedOrder = order;
		},
		
		checkOrderStatus: function(orderStatus){
			if(this.selectedOrder.status === orderStatus){
				if(this.declineClicked === true){
					return false;
				}
				return true;
			}
			return false;
		},
		declineOrder: function(){
			this.declineClicked = true;	
		},
		goBack: function(){
			this.selectedOrder.status === "PROCESSING";	
			this.declineClicked = false;
		},
		changeOrderStatus: function(orderStatus){
			
			if(orderStatus === "DECLINED"){
				this.selectedOrder.declineReason = this.declineReason;
				this.declineClicked = false;
				
				event.preventDefault();
				if(	!this.declineReason){
					alert(`Reason for the decline is required`);
					return;
				}
				
			}else{
				this.selectedOrder.declineReason = "";
			}
			
			axios.put("rest/orders/changeStatus/" + orderStatus, this.selectedOrder, {
							headers: {
								'Authorization': `Bearer ${localStorage.getItem('token')}`,
								'Content-Type': 'application/json'
							}
						}).
			then(response => {
					if(response.data === "OK"){
						this.selectedOrder.status = orderStatus;	
					}else{	
						alert(`${response.data}`);
					}
				});
		}	
	}
})