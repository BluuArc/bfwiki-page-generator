<template>
	<v-navigation-drawer
		v-model="showDrawer"
		app temporary
	>
		<v-list-item>
			<v-list-item-content>
				<v-list-item-title>
					BF Wiki Page Generator
				</v-list-item-title>
			</v-list-item-content>
		</v-list-item>
		<v-divider/>
		<v-list nav>
			<template v-for="parentCategory in routeConfig">
				<v-subheader
					v-if="parentCategory.name"
					:key="`${parentCategory.name}-header`"
				>
					{{ parentCategory.name }}
				</v-subheader>
				<v-list-item-group
					:key="`${parentCategory.name}-pages`"
					color="primary"
				>
					<v-list-item
						v-for="page in parentCategory.pages"
						:key="page.path"
						:to="page.path"
					>
						<v-list-item-icon>
							<v-icon v-text="page.listConfig.icon"/>
						</v-list-item-icon>
						<v-list-item-content>
							<v-list-item-title v-text="page.name"/>
						</v-list-item-content>
					</v-list-item>
				</v-list-item-group>
			</template>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
import routes from '@/router/routes';

export default {
	computed: {
		routeConfig () {
			const parentCategories = [undefined]; // start with general root-level routes
			const routesToDisplay = routes.filter(r => r.listConfig && !r.listConfig.hidden);
			routesToDisplay.forEach(route => {
				if (!parentCategories.includes(route.listConfig.parent)) {
					parentCategories.push(route.listConfig.parent);
				}
			});

			return parentCategories.map(categoryName => {
				return {
					name: categoryName,
					pages: routesToDisplay.filter(r => r.listConfig.parent === categoryName),
				};
			});
		},
	},
	data () {
		return {
			showDrawer: false,
		};
	},
	props: {
		value: {
			default: false,
			type: Boolean,
		},
	},
	watch: {
		showDrawer (newValue) {
			if (newValue !== this.value) {
				this.$emit('input', newValue);
			}
		},
		value: {
			handler (newValue) {
				if (!!newValue !== this.showDrawer) {
					this.showDrawer = !!newValue;
				}
			},
			immediate: true,
		},
	},
};
</script>
