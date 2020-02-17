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
	{
		component: () => import(/* webpackChunkName: "generators" */ '@/views/Generators/UnitsView.vue'),
		listConfig: {
			hidden: true,
		},
		name: 'Unit Generator - Loading...',
		path: '/generators/units/:id',
	},
	{
		component: () => import(/* webpackChunkName: "generators" */ '@/views/Generators/Items.vue'),
		listConfig: {
			icon: 'fa-shield-alt',
		},
		name: 'Item Generator',
		path: '/generators/items',
	},
	{
		component: () => import(/* webpackChunkName: "generators" */ '@/views/Generators/ItemsView.vue'),
		listConfig: {
			hidden: true,
		},
		name: 'Item Generator - Loading...',
		path: '/generators/items/:id',
	},
	{
		component: () => import(/* webpackChunkName: "generators" */ '@/views/Generators/ExtraSkills.vue'),
		listConfig: {
			icon: 'fa-tablet',
		},
		name: 'Extra Skill Generator',
		path: '/generators/extra-skills',
	},
	{
		component: () => import(/* webpackChunkName: "generators" */ '@/views/Generators/ExtraSkillsView.vue'),
		listConfig: {
			hidden: true,
		},
		name: 'Extra Skill Generator - Loading...',
		path: '/generators/extra-skills/:id',
	},
	{
		component: () => import(/* webpackChunkName: "generators" */ '@/views/Generators/Bursts.vue'),
		listConfig: {
			icon: 'fa-skull',
		},
		name: 'Burst Generator',
		path: '/generators/bursts',
	},
	{
		component: () => import(/* webpackChunkName: "generators" */ '@/views/Generators/BurstsView.vue'),
		listConfig: {
			hidden: true,
		},
		name: 'Burst Generator - Loading...',
		path: '/generators/bursts/:id',
	},
];

export default pageGeneratorRoutes.map(r => { r.listConfig.parent = 'Page Generators'; return r; });
