const pageGeneratorRoutes = [
	{
		component: () => import(/* webpackChunkName: "generators" */ '@/views/Generators/Generators.vue'),
		listConfig: {
			hidden: true,
		},
		name: 'Generators Home',
		path: '/generators',
	},
	{
		component: () => import(/* webpackChunkName: "generators" */ '@/views/Generators/Units.vue'),
		listConfig: {
			icon: 'fa-users',
		},
		name: 'Unit Generator',
		path: '/generators/units',
	},
];

export default pageGeneratorRoutes.map(r => { r.listConfig.parent = 'Page Generators'; return r; });
