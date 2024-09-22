/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "worldstrides.com",
      "assets.editorial.aetnd.com",
      "media.tatler.com",
      "th.bing.com",
      "fthmb.tqn.com",
      "lp-cms-production.imgix.net",
      "cloudfront-us-east-2.images.arcpublishing.com",
      "static.nationalgeographic.co.uk",
      "www.nomadicchica.com",
      "a.cdn-hotels.com",
      "e5rxtr4t5ah.exactdn.com",
      "dynamic-media-cdn.tripadvisor.com",
      "www.travelandleisure.com",
      "media.discoverafrica.com",
      "www.newzealand.com",
    ],
  },
};

module.exports = nextConfig;
