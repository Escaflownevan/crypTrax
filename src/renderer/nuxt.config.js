/**
 * By default, Nuxt.js is configured to cover most use cases.
 * This default configuration can be overwritten in this file
 * @link {https://nuxtjs.org/guide/configuration/}
 */


module.exports = {
  ssr: false,
  target: 'static',
  head: {
    title: 'crypTrax',
    meta: [{ charset: "utf-8" }]
  },
  loading: false,
  css: ['@/plugins/global.css'],
  plugins: [
    {ssr: true, src: '@/plugins/icons.js'},
    {ssr: true, src: '@/plugins/start.js'}

  ],
  buildModules: [

  ],
  modules: [
    '@nuxtjs/vuetify' ,
    'vuetify-dialog/nuxt'

],
vuetify: {
            theme: {
              themes: {
                light: {
                  primary: '#ce571d',
                  secondary: '#beaf97',
                  accent: '#ce571d',
                },
              },
            }
          }
};
