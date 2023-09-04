const HomePage = {template: "<home></home>"}
const LoginPage = {template: "<login></login>"}
const SelectedRentACarComponent = { template: '<selectedRentACar></selectedRentACar>' }
const ProfilePage = {template: "<userProfile></userProfile>"}
const CustomerOrders = {template: "<customerOrders></customerOrders>"}
const RentVehicle = {template: "<rentVehicle></rentVehicle>"}

const router = new VueRouter({
    mode: 'hash',
    routes: [
        {path: '/', component: HomePage},
		{path: '/login', component: LoginPage},
		{path: '/selectedRentACar/:rentACarId', component: SelectedRentACarComponent},
        {path: '/userProfile', component: ProfilePage},
		{path: '/customerOrders', component: CustomerOrders},
		{path: '/rentVehicle', component: RentVehicle}
    ]
});


var customerApp = new Vue({
    router,
    el: "#customer"
});
