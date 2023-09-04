const HomePage = {template: "<home></home>"}
const ProfilePage = {template: "<userProfile></userProfile>"}
const AllProfiles = {template: "<allProfiles></allProfiles>"}
const SelectedRentACarComponent = { template: '<selectedRentACar></selectedRentACar>' }
const ManagerRegistration = {template: "<managerRegistration></managerRegistration>"}
const NewObject = {template: "<newObject></newObject>"}

const router = new VueRouter({
    mode: 'hash',
    routes: [
        {path: '/', component: HomePage},
        {path: '/userProfile', component: ProfilePage},
        {path: '/allProfiles', component: AllProfiles},
		{path: '/selectedRentACar/:rentACarId', component: SelectedRentACarComponent},
        {path: '/managerRegistration', component: ManagerRegistration},
        {path: '/newObject', component: NewObject}
    ]
});


var adminApp = new Vue({
    router,
    el: "#administrator"
});
