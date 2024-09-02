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
                },
                customBeige: {
                    100: '#EFECE7',
                },
                customGray: {
                    100: '#CDCAC5',
                },
                customBrown: {
                    100: '#A38970',
                },
            },
        },
    },
    plugins: [],
};
export default config;