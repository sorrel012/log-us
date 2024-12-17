import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                customLightBlue: {
                    100: 'rgba(110, 127, 145, 0.5)',
                    200: '#6E7F91',
                },
                customDarkBlue: {
                    100: '#394C60',
                    200: '#506b87',
                },
                customBeige: {
                    100: '#F7F5F3',
                },
                customGray: {
                    100: '#CDCAC5',
                    200 :'#F6F6F6',
                },
                customBrown: {
                    100: '#A38970',
                },
                customMint : {
                    100 : '#A5C4BD',
                },
            },
            screens: {
                '3xl': '1800px',
                '4xl': '2200px',
            },
            fontSize: {
                md: '1rem',
            },
        },
    },
    plugins: [],
};
export default config;
