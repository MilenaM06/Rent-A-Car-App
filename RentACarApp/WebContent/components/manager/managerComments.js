Vue.component("managerComments", { 
	data: function () {
	    return {   
			rentACar : {},
	    	comments : {}
	    }
	},
	    template: 
	    `
		<div>		
  			
	    	<div class="container mt-4 mb-4">
        		<div class="card">
            		<div class="card-header bg-light" >
               			Comments
            		</div>
					
					 <div class="card-body"> 
				            
		                <div class="media" v-for="c in comments">
		                    <div class="media-body">
		                        <h5 class="mt-0 d-flex align-items-center">{{c.customerUsername}}</h5>
		                        <span class="ml-2"> {{c.rating}} <i class="fas fa-star text-warning"></i></span> {{c.content}}

		                        <div class="d-flex justify-content-end">
									<div class="comment_status" v-show="c.status != 'PENDING'">{{c.status}}</div>
		                            <button  class="btn btn-primary ml-2" v-on:click="changeStatus(c, 'ACCEPTED')" v-if="checkStatus(c)" >Accept</button>
									<button class="btn btn-secondary ml-2" v-on:click="changeStatus(c, 'DENIED')" v-if="checkStatus(c)">Deny</button>
		                        </div>
		                        <hr>
		                    </div>
		                </div>

					</div>
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
			axios.get("rest/comments/getByRentACarId/" + this.rentACar.id)
    		.then(response => (this.comments = response.data))
			});
    
    },
    methods: {
		checkStatus: function(comment){
			return comment.status === "PENDING";
		},
		
		changeStatus: function(comment, status){
			axios.put(`rest/comments/changeStatus/${status}`, comment, {
							headers: {
								'Authorization': `Bearer ${localStorage.getItem('token')}`,
								'Content-Type': 'application/json'
							}
						}).
				then(response => {
								comment.status = status;
								alert(response.data);
								});
		}
	
    }
});
