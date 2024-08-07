module.exports = {
    siteUrl: 'https://storykids.tech',
    generateRobotsTxt: true, // (optional)
    sitemapSize: 7000,
    exclude: ['/server-sitemap.xml'], // <- Excludes server-side rendered sitemap
    robotsTxtOptions: {
      additionalSitemaps: [
        'https://storykids.tech/server-sitemap.xml', // <-- Add here server-side rendered sitemap
      ],
    },
  }