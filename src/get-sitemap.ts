import fs from 'fs-extra';
import path from 'path';

export default async function getSitemap() {
  const sitemapPath = path.join(process.cwd(), '.worktop', 'sitemap.json');
  const sitemap = await fs.readJson(sitemapPath);

  return sitemap;
}
