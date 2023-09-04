Vue.component("managerCustomers", { 
	data: function () {
	    return {   
			rentACar : {},
	    	customers : {}
	    }
	},
	    template: 
	    `
	<div>	
		<div class="container mt-4 mb-4">
			<div class="card">
		        <table class="table">
		            <thead class="thead-light">
		                <tr>
		                    <th scope="col">Username</th>
		                    <th scope="col">Name</th>
		                    <th scope="col">Surname</th>
		                </tr>
		            </thead>
		
		        	<tbody>
		
		                <tr v-for="c in customers">
		                    <td>{{c.username}}</td>
		                    <td>{{c.name}}</td>
		                    <td>{{c.surname}}</td>
		                </tr>
		
		            </tbody>
	
		        </table>  
			</div>
   	 	</div>
		
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
			
			this.rentACar = response.data
			axios.get("rest/users/getCustomersByRentACarId/" + this.rentACar.id,  {
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'application/json'
						}
					})
    			.then(response => (this.customers = response.data))
			});
    },
    methods: {
	
    }
});