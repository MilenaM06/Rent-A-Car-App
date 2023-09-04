Vue.component("allProfiles", {
	data: function() {
		return {
			backupUsers: [],
			filteredUsers: [],
			users: [],
			admins: [],
			managers: [],
			customers: [],
			sus: [],
			searchInfo: {
				username: '',
				name: '',
				surname: '',
			},
			filterOption: {
				customerType: 'All'
			},
			sortOption: {
				All: 'Name',
				Admin: 'Name',
				Manager: 'Name',
				Customer: 'Name'
			},
			sortDirection: {
				All: 'Ascending',
				Admin: 'Ascending',
				Manager: 'Ascending',
				Customer: 'Ascending'
			},
			activeTab: 'ALL', // Set default active tab
		}
	},
	template: `
	
	<div>
	
	    <div class="container mt-4 rounded-container">
          <form @submit="searchUsers">

            <div class="row mb-3 d-flex justify-content-center">
                <div class="col-md-3">
                   <input class="form-control" type="text" v-model="searchInfo.username"  placeholder="Search by Username" />
                </div>
                <div class="col-md-3">
                    <input class="form-control" type="text" v-model="searchInfo.name" placeholder="Search by Name" />
                </div>
                <div class="col-md-3">
                    <input class="form-control" type="text" v-model="searchInfo.surname" placeholder="Search by Surname" />
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-12 d-flex justify-content-center">
					<button class="btn btn-primary ml-2" type="submit">Search</button>
					<button class="btn btn-secondary ml-2" v-on:click="clearSearch">Clear</button> 
                </div>
            </div>  
               
           </form>
    	</div>

		<div class="row mt-3 mb-3 d-flex justify-content-center">
		 	<button class="btn btn-primary ml-2" v-on:click="changeTab('ALL')">ALL</button>
			<button class="btn btn-primary ml-2" v-on:click="changeTab('ADMINS')">ADMINS</button>
			<button class="btn btn-primary ml-2" v-on:click="changeTab('MANAGERS')">MANAGERS</button>
			<button class="btn btn-primary ml-2" v-on:click="changeTab('CUSTOMER')">CUSTOMER</button>
	        <button class="btn btn-primary ml-2" v-on:click="changeTab('SUS')">SUS</button>
	    </div>		

		<!-- ALL -->
		<div class="container mt-4 mb-4 rounded-container" v-show="activeTab === 'ALL'" id="ALL">
	        <div class="row mb-3 justify-content-center">   
	            <div class="col-md-4">
	                <select class="form-control" v-model="sortOption.All" v-on:change="sortAll()">
                        <option>Name</option>
                        <option>Surname</option>
                        <option>Username</option>
                	</select>
	            </div>

	            <div class="col-md-4">
	               <select class="form-control" v-model="sortDirection.All" v-on:change="sortAll()">
                        <option>Ascending</option>
                        <option>Descending</option>
                    </select> 
	            </div>

	        </div>
	   
	     	 <table class="table table-bordered">
		         <thead class="thead-light">
		            <tr>
		               <th>Username</th>
		               <th>Name</th>
		               <th>Surname</th>
		               <th></th>
		            </tr>
		         </thead>
		         <tbody>
		            <tr v-for="u in users">
		               <td>{{u.username}}</td>
		               <td>{{u.name}}</td>
		               <td>{{u.surname}}</td>
		               <td class="d-flex justify-content-center">
							<button class="btn btn-primary ml-2" v-if="!u.blocked && u.role !== 'ADMINISTRATOR'" v-on:click="blockUser(u)">Block</button>
		                	<button class="btn btn-primary ml-2" v-else-if="u.blocked && u.role !== 'ADMINISTRATOR'" v-on:click="unblockUser(u)">Unblock</button>
 							<button class="btn btn-secondary ml-2" v-if="u.role !== 'ADMINISTRATOR'" v-on:click="deleteUser(u)">Delete</button>
							<div class="admin_status" v-if="u.role === 'ADMINISTRATOR'">ADMINISTRATOR</div>
		               </td>
		            </tr>
		         </tbody>
	      	</table>
		</div>
		
		
		<!-- ADMINS -->
		<div class="container mt-4 mb-4 rounded-container" v-show="activeTab == 'ADMINS'" id="ADMINS">
	        <div class="row mb-3 justify-content-center">   
	            <div class="col-md-4">
	               	<select class="form-control" v-model="sortOption.Admin" v-on:change="sortAdmins()">
		                <option>Name</option>
		                <option>Surname</option>
		                <option>Username</option>
	            	</select>
	            </div>

	            <div class="col-md-4">
	               	<select class="form-control" v-model="sortDirection.Admin" v-on:change="sortAdmins()">
	                    <option>Ascending</option>
	                    <option>Descending</option>
	                </select> 
	            </div>

	        </div>
	   
	     	 <table class="table table-bordered">
		         <thead class="thead-light">
		            <tr>
		               <th>Username</th>
		               <th>Name</th>
		               <th>Surname</th>
		            </tr>
		         </thead>
		         <tbody>
		            <tr v-for="u in admins">
		               <td>{{u.username}}</td>
		               <td>{{u.name}}</td>
		               <td>{{u.surname}}</td>
		            </tr>
		         </tbody>
	      	</table>
		</div>


		<!-- MANAGERS -->
		<div class="container mt-4 mb-4 rounded-container"  v-show="activeTab == 'MANAGERS'" id="MANAGERS">
	        <div class="row mb-3 justify-content-center">   
	            <div class="col-md-4">
	                <select class="form-control" v-model="sortOption.Manager" v-on:change="sortManagers()">
                        <option>Name</option>
                        <option>Surname</option>
                        <option>Username</option>
                    </select>
	            </div>

	            <div class="col-md-4">
	               	<select class="form-control" v-model="sortDirection.Manager" v-on:change="sortManagers()">
                        <option>Ascending</option>
                        <option>Descending</option>
                    </select>
	            </div>

	        </div>
	   
	     	 <table class="table table-bordered">
		         <thead class="thead-light">
		            <tr>
		               <th>Username</th>
		               <th>Name</th>
		               <th>Surname</th>
		               <th>Birth date</th>
		               <th>Gender</th>
		               <th></th>
		            </tr>
		         </thead>
		         <tbody>
		            <tr v-for="u in managers">
		               	<td>{{u.username}}</td>
		               	<td>{{u.name}}</td>
		              	<td>{{u.surname}}</td>
						<td>{{new Date(u.dateOfBirth).toLocaleDateString('sr-RS')}}</td>
						<td>{{u.gender}}</td>
		               <td class="d-flex justify-content-center">
							<button class="btn btn-primary ml-2" v-if="!u.blocked" v-on:click="blockUser(u)">Block</button>
							<button  class="btn btn-primary ml-2" v-else-if="u.blocked" v-on:click="unblockUser(u)">Unblock</button>
							<button class="btn btn-secondary ml-2" v-on:click="deleteUser(u)">Delete</button>
		               </td>
		            </tr>
		         </tbody>
	      	</table>
		</div>
		
		
		<!-- CUSTOMERS -->
		<div class="container mt-4 mb-4 rounded-container" v-show="activeTab == 'CUSTOMER'" id="CUSTOMER">
	        <div class="row mb-3 justify-content-center">   
	            <div class="col-md-4">
	                <select class="form-control" v-model="sortOption.Customer" v-on:change="sortCustomers()">
                        <option>Name</option>
                        <option>Surname</option>
                        <option>Username</option>
                        <option>Points</option>
                    </select>
	            </div>

	            <div class="col-md-4">
                 	<select class="form-control" v-model="sortDirection.Customer" v-on:change="sortCustomers()">
                        <option>Ascending</option>
                        <option>Descending</option>
                    </select>  
	            </div>

				<div class="col-md-4">
                 	<select class="form-control" v-model="filterOption.customerType" v-on:change="filter()">
		                <option value="All">All</option>
		                <option value="BRONZE">BRONZE</option>
		                <option value="SILVER">SILVER</option>
		                <option value="GOLD">GOLD</option>
		                <option value="NONE">NONE</option>
				    </select> 
	            </div>

	        </div>
	   
	     	 <table class="table table-bordered">
		         <thead class="thead-light">
		            <tr>
		                <th>Username</th>
		               <th>Name</th>
		               <th>Surname</th>
		               <th>Birth date</th>
		               <th>Gender</th>
		               <th>Type</th>
		               <th>Points</th>
		               <th></th>       
		            </tr>
		         </thead>
		         <tbody>
		            <tr v-for="u in customers">
		               <td>{{u.username}}</td>
		               <td>{{u.name}}</td>
		               <td>{{u.surname}}</td>
		               <td>{{new Date(u.dateOfBirth).toLocaleDateString('sr-RS')}}</td>
		               <td>{{u.gender}}</td>
		               <td>{{u.customerType}}</td>
		               <td>{{u.points}}</td>
		               <td class="d-flex justify-content-center">
							<button class="btn btn-primary ml-2" v-if="!u.blocked" v-on:click="blockUser(u)">Block</button>
	                  		<button class="btn btn-primary ml-2" v-else-if="u.blocked" v-on:click="unblockUser(u)">Unblock</button>
							<button  class="btn btn-secondary ml-2" v-on:click="deleteUser(u)">Delete</button>				
		               </td>
		            </tr>
		         </tbody>
	      	</table>
		</div>
		
	  	<!-- SUS -->
		<div class="container mt-4 mb-4 rounded-container" v-show="activeTab == 'SUS'" id="SUS">   
	     	 <table class="table table-bordered">
		         <thead class="thead-light">
		            <tr>
		               <th>Username</th>
		               <th>Name</th>
		               <th>Surname</th>
		               <th>Birth date</th>
		               <th>Gender</th>
		               <th>Points</th>
		               <th></th>
		            </tr>
		         </thead>
		         <tbody>
		            <tr v-for="u in sus">
		               <td>{{u.username}}</td>
		               <td>{{u.name}}</td>
		               <td>{{u.surname}}</td>
		               <td>{{new Date(u.dateOfBirth).toLocaleDateString('sr-RS')}}</td>
		               <td>{{u.gender}}</td>
		               <td>{{u.points}}</td>
		               <td class="d-flex justify-content-center">				
							<button class="btn btn-primary ml-2" v-if="!u.blocked" v-on:click="blockUser(u)">Block</button>
	                  		<button class="btn btn-primary ml-2" v-else-if="u.blocked" v-on:click="unblockUser(u)">Unblock</button>						
		               </td>
		            </tr>
		         </tbody>
	      	</table>
		</div>
			  	
	</div>
  `,
	mounted() {
		axios.get("rest/users/getAll", {
			headers: {
				'Authorization': `Bearer ${localStorage.getItem('token')}`,
				'Content-Type': 'application/json'
			}
		})
			.then(response => {
				this.initializeUsers(response.data);
			})
	},
	methods: {
		changeTab: function(tabName) {
			this.activeTab = tabName;
		},
		initializeUsers: function(users) {
			this.backupUsers = users;
			this.filteredObjects = users;
			this.users = users;
			this.admins = this.users.filter(user => user.role === 'ADMINISTRATOR');
			this.managers = this.users.filter(user => user.role === 'MANAGER');
			this.customers = this.users.filter(user => user.role === 'CUSTOMER');
			this.sus = this.users.filter(user => user.isSuspicious === true);
			this.sort();
		},
		searchUsers: function() {
			event.preventDefault();
			this.filteredUsers = this.searchByName(this.backupUsers);
			this.filteredUsers = this.searchBySurname(this.filteredUsers);
			this.filteredUsers = this.searchByUsername(this.filteredUsers);
			this.users = this.filteredUsers
			this.admins = this.filteredUsers.filter(user => user.role === 'ADMINISTRATOR');
			this.managers = this.filteredUsers.filter(user => user.role === 'MANAGER');
			this.customers = this.filteredUsers.filter(user => user.role === 'CUSTOMER');
			this.sus = this.filteredUsers.filter(user => user.isSuspicious === true);
			this.sort();
		},
		searchByName: function(backupUsers) {

			searchName = this.searchInfo.name;
			var filteredUsers = [];

			for (var u of backupUsers) {
				if (searchName !== null) {
					if (u.name.toLowerCase().includes(searchName.toLowerCase())) {
						filteredUsers.push(u);
					}
				} else {
					return backupUsers;
				}
			}
			return filteredUsers;
		},
		searchBySurname: function(backupUsers) {

			searchSurname = this.searchInfo.surname;
			var filteredUsers = [];

			for (var u of backupUsers) {
				if (searchSurname !== null) {
					if (u.surname.toLowerCase().includes(searchSurname.toLowerCase())) {
						filteredUsers.push(u);
					}
				} else {
					return backupUsers;
				}
			}
			return filteredUsers;
		},
		searchByUsername: function(backupUsers) {

			searchUsername = this.searchInfo.username;
			var filteredUsers = [];

			for (var u of backupUsers) {
				if (searchUsername !== null) {
					if (u.username.toLowerCase().includes(searchUsername.toLowerCase())) {
						filteredUsers.push(u);
					}
				} else {
					return backupUsers;
				}
			}
			return filteredUsers;
		},
		filter: function() {

			switch (this.filterOption.customerType) {
				case "NONE":
					this.customers = this.filteredObjects.filter(user => (user.customerType === 'NONE' && user.role === 'CUSTOMER'));
					break;
				case "BRONZE":
					this.customers = this.filteredObjects.filter(user => user.customerType === 'BRONZE');
					break;
				case "SILVER":
					this.customers = this.filteredObjects.filter(user => user.customerType === 'SILVER');
					break;
				case "GOLD":
					this.customers = this.filteredObjects.filter(user => user.customerType === 'GOLD');
					break;
				case "All":
					this.customers = this.filteredObjects.filter(user => user.role === 'CUSTOMER');
				default:
					break;
			}
		},
		sort: function() {
			this.sortAll();
			this.sortAdmins();
			this.sortManagers();
			this.sortCustomers();
		},
		sortAll: function() {
			switch (this.sortOption.All) {
				case "Name":
					this.users.sort((a, b) => this.compare(a.name.toLowerCase(), b.name.toLowerCase(), "All"));
					break;
				case "Surname":
					this.users.sort((a, b) => this.compare(a.surname.toLowerCase(), b.surname.toLowerCase(), "All"));
					break;
				case "Username":
					this.users.sort((a, b) => this.compare(a.username.toLowerCase(), b.username.toLowerCase(), "All"));
					break;
				default:
					this.users.sort((a, b) => (a.name > b.name ? 1 : -1));
			}
		},
		sortAdmins: function() {
			switch (this.sortOption.Admin) {
				case "Name":
					this.admins.sort((a, b) => this.compare(a.name.toLowerCase(), b.name.toLowerCase(), "Admin"));
					break;
				case "Surname":
					this.admins.sort((a, b) => this.compare(a.surname.toLowerCase(), b.surname.toLowerCase(), "Admin"));
					break;
				case "Username":
					this.admins.sort((a, b) => this.compare(a.username.toLowerCase(), b.username.toLowerCase(), "Admin"));
					break;
				default:
					this.admins.sort((a, b) => (a.name > b.name ? 1 : -1));
			}
		},
		sortManagers: function() {
			switch (this.sortOption.Manager) {
				case "Name":
					this.managers.sort((a, b) => this.compare(a.name.toLowerCase(), b.name.toLowerCase(), "Manager"));
					break;
				case "Surname":
					this.managers.sort((a, b) => this.compare(a.surname.toLowerCase(), b.surname.toLowerCase(), "Manager"));
					break;
				case "Username":
					this.managers.sort((a, b) => this.compare(a.username.toLowerCase(), b.username.toLowerCase(), "Manager"));
					break;
				default:
					this.managers.sort((a, b) => (a.name > b.name ? 1 : -1));
			}
		},
		sortCustomers: function() {
			switch (this.sortOption.Customer) {
				case "Name":
					this.customers.sort((a, b) => this.compare(a.name.toLowerCase(), b.name.toLowerCase(), "Customer"));
					break;
				case "Surname":
					this.customers.sort((a, b) => this.compare(a.surname.toLowerCase(), b.surname.toLowerCase(), "Customer"));
					break;
				case "Username":
					this.customers.sort((a, b) => this.compare(a.username.toLowerCase(), b.username.toLowerCase(), "Customer"));
					break;
				case "Points":
					this.customers.sort((a, b) => this.compare(a.points, b.points, "Customer"));
					break;
				default:
					this.customers.sort((a, b) => (a.name > b.name ? 1 : -1));
			}
		},
		compare: function(a, b, type) {
			switch (type) {
				case "All":
					if (a < b) {
						if (this.sortDirection.All === 'Ascending')
							return -1;
						else
							return 1;
					}
					if (a > b) {
						if (this.sortDirection.All === 'Ascending')
							return 1;
						else
							return -1;
					}
					return 0;
					break;
				case "Admin":
					if (a < b) {
						if (this.sortDirection.Admin === 'Ascending')
							return -1;
						else
							return 1;
					}
					if (a > b) {
						if (this.sortDirection.Admin === 'Ascending')
							return 1;
						else
							return -1;
					}
					return 0;
					break;
				case "Manager":
					if (a < b) {
						if (this.sortDirection.Manager === 'Ascending')
							return -1;
						else
							return 1;
					}
					if (a > b) {
						if (this.sortDirection.Manager === 'Ascending')
							return 1;
						else
							return -1;
					}
					return 0;
					break;
				case "Customer":
					if (a < b) {
						if (this.sortDirection.Customer === 'Ascending')
							return -1;
						else
							return 1;
					}
					if (a > b) {
						if (this.sortDirection.Customer === 'Ascending')
							return 1;
						else
							return -1;
					}
					return 0;
					break
			}
		},
		clearSearch: function() {
			event.preventDefault();
			this.searchInfo.name = '';
			this.searchInfo.surname = '';
			this.searchInfo.username = '';
			this.filterOption.customerType = 'All';
			this.sortOption.All = 'Name';
			this.sortOption.Admin = 'Name'
			this.sortOption.Manager = 'Name'
			this.sortOption.Customer = 'Name'
			this.sortDirection.All = 'Ascending',
			this.sortDirection.Admin = 'Ascending',
			this.sortDirection.Manager = 'Ascending',
			this.sortDirection.Customer = 'Ascending',
			this.initializeUsers(this.backupUsers);
		},
		blockUser: function(user) {
			event.preventDefault();
			axios.post("rest/users/block", user.username, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			});
			this.blockUserInLists(user.id, true);
		},
		unblockUser: function(user) {
			event.preventDefault();
			axios.post("rest/users/unblock", user.username, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			});
			this.blockUserInLists(user.id, false);
		},
		deleteUser: function(user) {
			event.preventDefault();
			axios.delete(`rest/users/${user.username}`, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			}).then((response) => {
				this.deleteUserInLists(user.id);
			}).catch((error) => {
					alert(error.response.data);
				});
		},
		deleteUserInLists: function(userId) {
			this.backupUsers = this.backupUsers.filter(user => user.id !== userId);
			this.filteredUsers = this.filteredUsers.filter(user => user.id !== userId);
			this.users = this.users.filter(user => user.id !== userId);
			this.customers = this.customers.filter(user => user.id !== userId);
			this.managers = this.managers.filter(user => user.id !== userId);
			this.sus = this.sus.filter(user => user.id !== userId);
		},
		blockUserInLists: function(userId, block) {
			if ((foundIndex = this.users.findIndex(item => item.id === userId)) !== -1) {
				this.users[foundIndex].blocked = block;
			}
			if ((foundIndex = this.filteredUsers.findIndex(item => item.id === userId)) !== -1) {
				this.filteredUsers[foundIndex].blocked = block;
			}
			if ((foundIndex = this.backupUsers.findIndex(item => item.id === userId)) !== -1) {
				this.backupUsers[foundIndex].blocked = block;
			}
			if ((foundIndex = this.managers.findIndex(item => item.id === userId)) !== -1) {
				this.managers[foundIndex].blocked = block;
			}
			if ((foundIndex = this.customers.findIndex(item => item.id === userId)) !== -1) {
				this.customers[foundIndex].blocked = block;
			}
			if ((foundIndex = this.sus.findIndex(item => item.id === userId)) !== -1) {
				this.sus[foundIndex].blocked = block;
			}
		}
	}
});
