<template>
	<v-treeview
		activatable
		:items="treeData"
		:load-children="loadChildrenForEntry"
		open-on-click
	/>
</template>

<script>
import getLogger from '@/utilities/Logger';

const logger = getLogger('JsonExplorerView');
export default {
	data () {
		return {
			treeData: [
				{
					children: [],
					id: -1,
					name: 'root',
				},
			],
		};
	},
	methods: {
		generateTreeNodeForEntry (prop, obj, currentPath = '') {
			let name, children;
			const value = obj[prop];
			if (!value || typeof value !== 'object') {
				name = `${prop}${value ? `: ${typeof 'value'}` : ''} = ${value}`;
			} else if (Array.isArray(value)) {
				name = `${prop}: Array(${value.length})`;
				children = [];
			} else {
				name = `${prop}: Object{}`;
				children = [];
			}
			return {
				children,
				id: [currentPath, prop].filter(v => v).join('.'),
				name,
			};
		},
		getDataForPath (path = '') {
			if (typeof path === 'string') {
				const items = path.split('.');
				let currentValue = this.json;
				try {
					for (const key of items) {
						currentValue = currentValue[key];
					}
				} catch (err) {
					logger.error({ err, json: this.json, path });
					currentValue = undefined;
				}
				return currentValue;
			}
		},
		loadChildrenForEntry (item) {
			logger.debug({ item });
			const currentPath = item.id;
			const currentEntry = this.getDataForPath(currentPath) || {};
			Object.keys(currentEntry).forEach(key => {
				item.children.push(this.generateTreeNodeForEntry(key, currentEntry, currentPath));
			});
			return Promise.resolve();
		},
		resetTreeData () {
			this.treeData = [
				{
					children: Object.keys(this.json || {}).map(k => this.generateTreeNodeForEntry(k, this.json)),
					id: -1,
					name: `root: ${Array.isArray(this.json) ? `Array(${this.json.length})` : typeof this.json}`,
				},
			];
		},
	},
	props: {
		json: {
			required: true,
		},
	},
	watch: {
		json: {
			handler (newValue) {
				if (newValue) {
					this.resetTreeData();
				}
			},
			immediate: true,
		},
	},
};
</script>
