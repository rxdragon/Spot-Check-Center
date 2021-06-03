module.exports = {
  purge: [
    './index.html',
    'src/**/*.vue',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    outline: false
  },
  important: '#app'
}
