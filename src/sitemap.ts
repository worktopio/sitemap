/* tslint:disable */

import { Page } from './types';
import path from 'path';
import fs from 'fs-extra';

const createNewNode = (breadcrumb: { name: any; href: any }) => {
  return {
    name: breadcrumb.name,
    href: breadcrumb.href,
    children: [],
  };
};

const createHashForNodes = (node: { href: any; name: any }) => `${node.href}_${node.name}`;

export default async function execute(pages: Page[]) {
  const hashNodeMap = new Map();

  const output = {
    name: 'Home',
    href: '/',
    children: [],
  };

  /**
   * ASSUMTIONS:
   * 1) There is no circular dependencies (children are not parents of itself)
   * 2) Breadcrumbs with 1 item is skipped
   */
  for (const data of pages) {
    const {
      breadcrumbs: [parent, child],
    } = data;

    if (!!child) {
      const parentHash = createHashForNodes(parent);
      const childHash = createHashForNodes(child);

      let parentNode;

      if (!hashNodeMap.has(parentHash)) {
        parentNode = createNewNode(parent);
        hashNodeMap.set(parentHash, parentNode);
        // @ts-ignore
        output.children.push(parentNode);
      } else {
        parentNode = hashNodeMap.get(parentHash);
      }

      if (hashNodeMap.has(childHash)) {
        const childNode = hashNodeMap.get(childHash);
        const possibleDuplication = parentNode.children.find((node: { href: any }) => node.href === childNode.href);

        if (!possibleDuplication) {
          parentNode.children.push(childNode);
        }
      } else {
        const childNode = createNewNode(child);
        hashNodeMap.set(childHash, childNode);
        parentNode.children.push(childNode);
      }
    }
  }

  const fullFilePath = path.join(process.cwd(), 'lib/constants', 'sitemap.json');
  await fs.outputJson(fullFilePath, output);
}
