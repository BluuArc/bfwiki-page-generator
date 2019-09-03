<template functional>
  <section>
		<p v-text="props.message"/>
    <v-progress-linear
      v-if="props.progress < 0"
			indeterminate
		/>
		<v-progress-linear
      v-else
			:buffer-value="props.bufferProgress"
			:value="props.progress"
			stream
		/>
	</section>
  <!-- NOTE: needs VProgressLinear from 'vuetify/lib' to be imported by consuming component -->
</template>
