Vue.component("customer-header", {
    data: function () {
		return {
            
        };
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
	                    <a class="nav-link nowrap" href="#/">Home</a>
	                </li>

	                <li class="nav-item">
	                   	<a class="nav-link nowrap" href="#/userProfile">My profile</a>
	                </li>

	                <li class="nav-item">
	                    <a class="nav-link nowrap" href="#/rentVehicle">Rent vehicle</a>
	                </li>

					<li class="nav-item">
	                    <a class="nav-link nowrap" href="#/customerOrders">My orders</a>
	                </li>

					<li class="nav-item">
	                    <a class="nav-link nowrap" v-on:click="logout" href="">Logout</a>
	                </li>
	            </ul>
	        </div>
    	</nav>

	</div>
    
    `,
    methods: {
        logout: function () {
				event.preventDefault();
				axios.post("rest/carts/emptyCart", {}, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
					}});
                localStorage.setItem('token', null);
      			location.href = "/RentACarApp";
        },
    },
});
