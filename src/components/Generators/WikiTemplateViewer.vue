<template>
	<section class="wiki-template-viewer">
		<slot name="templateOptions" :inputChanged="getWikiTemplate"/>
		<copy-button block :value="wikiTemplate"/>
		<pre><code v-text="wikiTemplate"/></pre>
	</section>
</template>

<script>
import CopyButton from '@/components/utilities/CopyButton';
import getLogger from '@/utilities/Logger';

const logger = getLogger('WikiTemplateView');
export default {
	components: {
		CopyButton,
	},
	created () {
		this.getWikiTemplate();
	},
	data () {
		return {
			wikiTemplate: 'Loading template...',
		};
	},
	methods: {
		getWikiTemplate () {
			logger.debug('in getWikiTemplate');
			this.wikiTemplate = 'Loading template...';
			return Promise.resolve(this.generateTemplate())
				.then(templateData => {
					this.wikiTemplate = templateData;
				}).catch(err => {
					logger.error(err);
					this.wikiTemplate = err;
				});
		},
	},
	props: {
		generateTemplate: {
			required: true,
			type: Function,
		},
	},
};
</script>

<style lang="scss">
.wiki-template-viewer {
	pre {
    overflow: auto;
    flex: auto;
		background-color: #F5F5F5;

		.theme--dark & {
			background-color: black;
		}
  }

  code {
    width: 100%;
    height: auto;
		background-color: #F5F5F5;

    &::before {
      content: '';
    }

    .theme--dark & {
      border: 1px solid var(--background-color);
      background-color: black;
      color: lightgreen;
    }
  }
}
</style>
