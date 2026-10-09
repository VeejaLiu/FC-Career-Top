/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.fccareer.top',
  generateRobotsTxt: true,
  outDir: 'out',
};
