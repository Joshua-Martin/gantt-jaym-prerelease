/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}', './src/styles/globals.css'],
  darkMode: 'class',
  theme: {
    fontFamily: {
      display: ['Open Sans', 'sans-serif'],
      body: ['Open Sans', 'sans-serif'],
      arimo: ['Arimo', 'sans-serif'],
    },
    extend: {
      keyframes: {
        shimmer: {
          '0%': { opacity: 0.9 },
          '50%': { opacity: 0.6 },
          '100%': { opacity: 0.9 },
        },
      },
      animation: {
        shimmer: 'shimmer 3s ease-in-out infinite',
      },
      colors: {
        clear: 'rgba(0, 0, 0, 0)',
        accentColor: 'rgba(242, 154, 12, 1)',
        /*AiChat*/
        sentBubble: 'rgba(213, 213, 213, 0.8)',
        sentBubbleHover: 'rgba(213, 213, 213, 1)',
        receivedBubble: 'rgba(240, 240, 240, 0.8)',
        receivedBubbleHover: 'rgba(240, 240, 240, 1)',
        /*IpdChat*/
        ipdSentBubble: '#FCBF4960',
        ipdSentBubbleHover: '#FCBF4980',
        ipdReceivedBubble: '#ffffff40',
        ipdReceivedBubbleHover: '#ffffff50',
        redBtnBorder: 'rgba(223, 48, 26, 0.1)',
        grayThemeLight: 'rgba(51, 51, 51, 0.1)',
        grayTheme: 'rgba(51, 51, 51, 0.2)',
        grayThemeMd: 'rgba(51, 51, 51, 0.4)',
        grayThemeDark: 'rgba(51, 51, 51, 0.9)',
        tableHover: 'rgba(242, 242, 242, 0.61)',
        themeOrange: 'rgba(242, 154, 12, 1)',
        themeOrangeFocus: 'rgba(251, 170, 30, 0.61)',
        themeSelected: 'rgba(240, 111, 6, 0.53)',
        themeOrangeHover: 'rgba(255, 157, 25, 0.32)',
        themeOrangeDark: 'rgba(232, 110, 2, 1)',
        themeRedError: 'rgba(255, 0, 0, 1)',
        /*slate*/
        themeSlate: 'rgba(38, 37, 35, 1)',
        themeSlateGray: 'rgba(93, 90, 86, 0.8)',
        themeSlateGrayLight: 'rgba(93, 90, 86, 0.4)',
        themeSlateHover: '#33302d',
        /*gray*/
        themeGray: '#dddddda1',
        /*theme white*/
        themeWhite: '#fffefa',
        themeWhiteHover: '#d9d9d9',
        themeOrangeBtnFocus: 'rgba(242, 154, 12, 0.8)',
        insightColor: 'rgba(231, 154, 6, 0.2)',
        paletteBlue: '#003049',
        paletteRed: '#BC1A00',
        paletteOrange: '#F29A0C',
        paletteOrangeHover: '#f0a50e',
        paletteYellow: '#fcdd53',
        paletteLtGray: '#ffffff40',
        paletteDkGray: '#080707',
        navText: {
          light: 'rgba(38, 37, 35, 0.8)',
          DEFAULT: 'rgb(209 213 219)',
          dark: 'rgb(209 213 219)',
        },
      },
      fontSize: {
        14: '14px',
      },
      backgroundColor: {
        'main-bg-light': '#ffffff',
        'main-bg-dark': '#ffffff',
        'nav-bg-dark': '#0a0a08',
        'nav-bg-light': '#ffffff',
      },
      borderWidth: {
        1: '1px',
        2: '2px',
      },
      borderRadius: {
        btn: '4px',
        iconBtn: '16px',
      },
      borderColor: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      width: {
        400: '400px',
        760: '760px',
        780: '780px',
        800: '800px',
        1000: '1000px',
        1200: '1200px',
        1400: '1400px',
      },
      height: {
        80: '80px',
        'custom-btn': '40px',
      },
      minHeight: {
        590: '590px',
      },
      backgroundImage: {
        'stop-work': "url('/public/mini-ex-site.jpeg')",
        'fog-skyline-dark': "url('/public/fogSkyline-dark.jpg')",
        'mobile-bg': "url('/public/mobile-img.jpg')",
        'main-bg-dark': "url('/public/mach-rm-dark.jpg')",
      },
      iconColor: {
        'icon-color-light': 'rgba(255, 255, 255, 1)',
        'icon-color-dark': 'rgba(0, 0, 0, 1)',
      },
      accentColor: {
        'accent-color-light': 'rgba(223, 48, 26, 1)',
        'accent-color-dark': 'rgba(184, 56, 60, 1)',
      },
      textColor: {
        'btn-text-color': 'rgba(255, 255, 255, 1)',
      },
    },
  },
  plugins: [],
};
