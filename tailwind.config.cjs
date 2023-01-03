/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {},
    screens: {
      "phone": {"max": "390px"},
      "tablet": {"max": "640px"},
      "tablet-xl": {"max": "835px"},
      "laptop": {"max": "1024px"},
      "desktop": {"max": "1280px"},
    },
  },
  plugins: [
        require("flowbite/plugin")
  ],
}
