<template>
	<div :key="startToken">
		<v-fade-transition mode="out-in">
			<template v-if="isVisuallyLoading">
				<template v-if="isPostMount">
					<slot name="loading">
						<progress-viewer
							:message="loadingMessage"
							:progress="progress"
							:bufferProgress="progress"
						/>
					</slot>
				</template>
			</template>
			<template v-else-if="hasError">
				<slot name="error" :error="error">
					<span>Error: {{ error.message || JSON.stringify(error) }}</span>
				</slot>
			</template>
			<template v-else>
				<slot name="default" :result="result">
					<span>{{ result }}</span>
				</slot>
			</template>
		</v-fade-transition>
	</div>
</template>

<script>
import LoadingDebouncer from '@/utilities/LoadingDebouncer';
import ProgressViewer from '@/components/utilities/ProgressViewer';
import { VProgressLinear } from 'vuetify/lib';
import { getRandomToken } from '@/utilities/utils';

export default {
	beforeDestroy () {
		if (this.loadingDebouncer) {
			this.loadingDebouncer.dispose();
		}
	},
	components: {
		ProgressViewer,
		// needed to use ProgressViewer
		VProgressLinear, // eslint-disable-line vue/no-unused-components
	},
	created () {
		if (this.loadingDebouncer) {
			this.loadingDebouncer.dispose();
		}
		this.loadingDebouncer = new LoadingDebouncer(val => {
			this.isVisuallyLoading = val;
		});

		this.loadingDebouncer.setValue(() => this.isInternallyLoading);
	},
	data () {
		return {
			error: null,
			hasError: false,
			isInternallyLoading: true,
			isPostMount: false,
			isVisuallyLoading: true,
			loadingDebouncer: null,
			result: null,
			startToken: 0,
		};
	},
	methods: {
		onPromiseChange () {
			this.resetState();
			const { startToken } = this;
			const tokenIsValid = () => startToken === this.startToken;
			Promise.resolve(this.promise)
				.then((result) => {
					if (tokenIsValid()) {
						this.result = result;
					}
				}).catch((err) => {
					if (tokenIsValid()) {
						this.error = err || new Error('An error has occurred.');
						this.hasError = true;
					}
				}).then(() => {
					if (tokenIsValid()) {
						this.isInternallyLoading = false;
					}
				});
		},
		resetState () {
			this.result = null;
			this.hasError = false;
			this.error = null;
			this.isInternallyLoading = true;
			this.startToken = getRandomToken();
		},
	},
	mounted () {
		// delay showing any loading messages to prevent brief flash of message for quickly resolved promises
		setTimeout(() => {
			this.isPostMount = true;
		}, 25);
	},
	props: {
		loadingMessage: {
			default: 'Loading...',
			type: String,
		},
		progress: {
			default: -1,
			type: Number,
		},
		promise: {
			required: true,
		},
	},
	watch: {
		isInternallyLoading () {
			this.loadingDebouncer.setValue(() => this.isInternallyLoading);
		},
		promise: {
			handler () {
				this.onPromiseChange();
			},
			immediate: true,
		},
	},
};
</script>
