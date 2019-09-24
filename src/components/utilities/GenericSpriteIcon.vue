<template functional>
  <svg
    :width="props.displayWidth || props.iconWidth" :height="props.displayHeight || props.iconHeight"
    :viewBox="`0 0 ${props.iconWidth} ${props.iconHeight}`"
    :style="`min-width: ${props.displayWidth || props.iconWidth}px; min-height: ${props.displayHeight || props.iconHeight}px;`"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink">
    <title v-if="props.iconTitle" v-text="props.iconTitle"/>
    <slot name="before"/>
    <image
      :width="props.sheetWidth" :height="props.sheetHeight"
      :xlink:href="props.src"
      :href="props.src"
      :transform="props.customTransform || `translate(${[-props.iconX, -props.iconY].join(' ')})`"
    />
    <slot name="after"/>
  </svg>
</template>
