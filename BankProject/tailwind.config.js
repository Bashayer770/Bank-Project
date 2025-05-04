module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      transform: {
        "preserve-3d": "transform-style: preserve-3d",
      },
      perspective: {
        1000: "1000px",
      },
      keyframes: {
        swipeIn: {
          "0%": { transform: "translateX(100vw) scale(0.95)", opacity: "0" },
          "100%": { transform: "translateX(0) scale(1)", opacity: "1" },
        },
      },
      animation: {
        "swipe-in": "swipeIn 0.6s ease-out both",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".backface-hidden": {
          "backface-visibility": "hidden",
        },
        ".backface-visible": {
          "backface-visibility": "visible",
        },
      });
    },
  ],
};
