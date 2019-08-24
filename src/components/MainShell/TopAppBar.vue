<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click.stop="$emit('toggleDrawer')"/>
    <v-toolbar-title class="headline text-uppercase">
      <span>BFWiki</span>
      <span class="font-weight-light">Page Generator</span>
    </v-toolbar-title>
    <v-spacer/>
    <v-btn
      aria-label="Change Theme"
      icon
      @click="$vuetify.theme.dark = !$vuetify.theme.dark">
      <v-icon>fa-adjust</v-icon>
    </v-btn>
    <v-divider vertical/>
    <v-btn
      aria-label="Go to the GitHub Repository"
      icon
      href="https://github.com/BluuArc/bfwiki-page-generator"
      target="_blank"
      rel="noopener"
    >
      <v-icon>fab fa-github</v-icon>
    </v-btn>
    <v-btn
      aria-label="Join the Discord Server"
      icon
      href="https://discord.gg/8rUdRfr"
      target="_blank"
      rel="noopener"
    >
      <v-icon>fab fa-discord</v-icon>
    </v-btn>
    <v-btn
      aria-label="Go to the Brave Frontier Global Wiki"
      icon
      href="https://bravefrontierglobal.fandom.com/wiki/Brave_Frontier_Wiki"
      target="_blank"
      rel="noopener"
    >
      <v-icon>fa-link</v-icon>
    </v-btn>
  </v-app-bar>
</template>
