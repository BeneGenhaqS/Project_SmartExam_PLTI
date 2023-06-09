/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import router from '../router'

// Pinia
import pinia from "@/plugins/store";

export function registerPlugins (app) {
  loadFonts()
  app
    .use(pinia)
    .use(vuetify)
    .use(router)
}
