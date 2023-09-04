const HomePage = {template: "<home></home>"}
const LoginPage = {template: "<login></login>"}
const SelectedRentACarComponent = { template: '<selectedRentACar></selectedRentACar>' }
const ProfilePage = {template: "<userProfile></userProfile>"}
const ManagerRentACarPage = {template: "<managerRentACar></managerRentACar>"}
const AddVehiclePage = {template: "<addVehicle></addVehicle>"}
const ManagerSelectedVehiclePage = {template: "<managerSelectedVehicle></managerSelectedVehicle>"}
const ManagerOrders = {template: "<managerOrders></managerOrders>"}
const ManagerComments = {template: "<managerComments></managerComments>"}
const ManagerCustomers = {template: "<managerCustomers></managerCustomers>"}

const router = new VueRouter({
    mode: 'hash',
    routes: [
        {path: '/', component: HomePage},
		{path: '/login', component: LoginPage},
		{path: '/selectedRentACar/:rentACarId', component: SelectedRentACarComponent},
        {path: '/userProfile', component: ProfilePage},
		{path: '/managerRentACar', component: ManagerRentACarPage},
		{path: '/addVehicle', component: AddVehiclePage},
		{path: '/managerSelectedVehicle/:vehicleId', component: ManagerSelectedVehiclePage},
		{path: '/managerOrders', component: ManagerOrders},
		{path: '/managerComments', component: ManagerComments},
		{path: '/managerCustomers', component: ManagerCustomers}
]
});


var managerApp = new Vue({
    router,
    el: "#manager"
});
