import Home from '@/views/Home.vue';
import pageGeneratorRoutes from './pageGeneratorRoutes';

export default [
	{
		component: Home,
		listConfig: {
			icon: 'fa-home',
		},
		name: 'Home',
		path: '/',
	},
	...pageGeneratorRoutes,
];
