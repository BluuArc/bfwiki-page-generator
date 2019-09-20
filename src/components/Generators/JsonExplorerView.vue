<template>
	<v-treeview
		class="json-treeview"
		:items="treeData"
		:load-children="loadChildrenForEntry"
		open-on-click
	/>
</template>

<script>
import getLogger from '@/utilities/Logger';

const logger = getLogger('JsonExplorerView');
const FALSY_TYPES_TO_DISPLAY = ['number', 'string', 'boolean'];
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
			const valueType = typeof value;
			if (!value || valueType !== 'object') {
				const valueTypeToDisplay = value || FALSY_TYPES_TO_DISPLAY.includes(valueType) ? `: ${valueType}` : '';
				let valueToDisplay = value;
				if (!value && valueType === 'string') {
					valueToDisplay = '(Empty String)';
				}
				name = `${prop}${valueTypeToDisplay} = ${valueToDisplay}`;
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
			const transformedKeys = Object.keys(this.json || {}).sort().map(k => this.generateTreeNodeForEntry(k, this.json));
			if (this.useRootNode) {
				this.treeData = [
					{
						children: transformedKeys,
						id: -1,
						name: `${this.rootName}: ${Array.isArray(this.json) ? `Array(${this.json.length})` : typeof this.json}`,
					},
				];
			} else {
				this.treeData = transformedKeys.length > 0
					? transformedKeys
					: [{
						children: [],
						id: -1,
						name: `${this.rootName}: No properties found`,
					}];
			}
		},
	},
	props: {
		json: {
			required: true,
		},
		rootName: {
			default: 'root',
			type: String,
		},
		useRootNode: {
			default: false,
			type: Boolean,
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

<style lang="scss">
.json-treeview {
	.v-treeview-node__label {
		white-space: normal;
	}
}
</style>
