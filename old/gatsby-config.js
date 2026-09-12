module.exports = {
  siteMetadata: {
    siteUrl: 'https://danielalberski.adanit.pl',
    title: 'Daniel Alberski - JavaScript Frontend Developer',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-htaccess',
      options: {
        https: true
      }
    },
    'gatsby-plugin-fontawesome-css',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-image',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Daniel Alberski',
        short_name: 'Daniel Alberski',
        start_url: '/',
        background_color: '#ffffff',
        theme_color: '#d40000',
        display: 'minimal-ui',
        icon: 'src/images/icon.png',
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/',
      },
      __key: 'images',
    },
  ],
};
