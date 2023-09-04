const HomeComponent = { template: '<home></home>' }
const SelectedRentACarComponent = { template: '<selectedRentACar></selectedRentACar>' }

const router = new VueRouter({
	mode: 'hash',
	  routes: [
		{ path: '/', name: 'home', component: HomeComponent},
		{ path: '/selectedRentACar/:rentACarId', name: 'selectedRentACar', component: SelectedRentACarComponent}
	  ]
});

var app = new Vue({
	router,
	el: '#element'
});
