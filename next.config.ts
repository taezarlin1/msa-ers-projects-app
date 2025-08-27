import createNextIntlPlugin from 'next-intl/plugin';
 
const BASE_URL = process.env.BASE_URL;

// console.log("Base url:", BASE_URL)

const nextConfig = {
  // This allows access from other devices on your network during development
  allowedDevOrigins: [
    `${BASE_URL}:3000`, // Replace with PC's local IP
    'http://100.88.188.94:3000', // If mobile resolves to this
    '*.local'                    // Optionally for local hostnames
  ]
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);