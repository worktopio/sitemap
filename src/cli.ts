#!/usr/bin/env node

/* tslint:disable */

import pagesJson from './pages';
import sitemap from './sitemap';

(async function () {
  const pages = await pagesJson();
  sitemap(pages);
})();
