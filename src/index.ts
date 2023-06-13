#!/usr/bin/env node

import fg from 'fast-glob';
import fs from 'fs-extra';
import parseJson from 'loose-json';
import path from 'path';

type Breadcrumb = {
  name: string;
  href: string;
};

type Page = {
  title: string;
  datePublished: string;
  dateModified?: string;
  authors: string[];
  breadcrumbs: Breadcrumb[];
  tags?: string[];
  internalTitle?: string;
  internalDescription?: string;
  image?: string;
};

function filePathToUrlPath(filePath: string) {
  if (filePath === 'app/page.tsx') {
    return '/';
  }

  return filePath.replace('app', '').replace('/page.tsx', '');
}

export default async function execute() {
  const pages: Page[] = [];

  const paths = await fg(['app/page.tsx', 'app/**/page.tsx', 'app/**/**/page.tsx']);

  for (const filePath of paths) {
    const fileContent = fs.readFileSync(path.join(process.cwd(), filePath), 'utf-8');

    const regex = /export const metadata: Metadata = (\{[^;]*\})/m;
    const matches = fileContent.match(regex);

    if (matches?.[1]) {
      const metadataString = matches[1].replaceAll('\n', '');
      const metadata = parseJson(metadataString);
      metadata.path = filePathToUrlPath(filePath);

      if (metadata.image) {
        let file;

        if (metadata.image.startsWith('/')) {
          file = path.join(process.cwd(), metadata.image);
        } else {
          file = path.resolve(path.dirname(filePath), metadata.image);
        }

        const exists = await fs.pathExists(file);

        if (exists) {
          const destination = file.replace('/app', '/public');

          fs.copySync(file, destination);

          metadata.image = destination.split('/public')[1];
        }
      }

      pages.push(metadata);
    }
  }

  const fullFilePath = path.join(process.cwd(), 'pages.json');
  if (fs.existsSync(fullFilePath)) {
    await fs.promises.unlink(fullFilePath);
  }

  await fs.promises.writeFile(fullFilePath, JSON.stringify(pages.flat()));
}
