/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/views/**/*.ejs", "./src/public/js/**/*.js"],
  theme: {
    extend: {
      colors: {
        green: {
          light: "#8BCF9B",
          fresh: "#4CAF70",
          dark: "#1F5D3A"
        },
        surface: {
          DEFAULT: "#FFFFFF",
          off: "#F7FAF7",
          mint: "#EEF8F0"
        },
        ink: {
          DEFAULT: "#17231B",
          muted: "#66736A"
        }
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      borderRadius: {
        card: "1.25rem"
      },
      boxShadow: {
        card: "0 10px 30px -18px rgba(31, 93, 58, 0.35)",
        nav: "0 8px 24px -16px rgba(23, 35, 27, 0.35)"
      },
      maxWidth: {
        site: "72rem"
      }
    }
  },
  plugins: []
};
