/* tslint:disable */

import path from 'path';
import fs from 'fs-extra';

const createNewNode = (breadcrumb: Breadcrumb) => {
  return {
    name: breadcrumb.name,
    href: breadcrumb.href,
    children: [],
  };
};

const createHashForNodes = (node: Breadcrumb) => `${node.href}_${node.name}`;

export default async function execute(pages: Page[]) {
  const hashNodeMap = new Map();

  const output: SitemapNode = {
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

    if (!parent && !child) {
      continue;
    } else if (!!child) {
      const parentHash = createHashForNodes(parent);
      const childHash = createHashForNodes(child);

      let parentNode: SitemapNode;

      if (!hashNodeMap.has(parentHash)) {
        parentNode = createNewNode(parent);
        hashNodeMap.set(parentHash, parentNode);
        output.children.push(parentNode);
      } else {
        parentNode = hashNodeMap.get(parentHash);
      }

      if (hashNodeMap.has(childHash)) {
        const childNode = hashNodeMap.get(childHash);
        const possibleDuplication = parentNode.children.find(
          (node) => createHashForNodes(node) === createHashForNodes(childNode),
        );

        if (!possibleDuplication) {
          parentNode.children.push(childNode);
        }
      } else {
        const childNode = createNewNode(child);
        hashNodeMap.set(childHash, childNode);
        parentNode.children.push(childNode);
      }
    } else {
      const parentHash = createHashForNodes(parent);

      if (!hashNodeMap.has(parentHash)) {
        const parentNode = createNewNode(parent);
        hashNodeMap.set(parentHash, parentNode);
        output.children.push(parentNode);
      } else {
        const parentNode = hashNodeMap.get(parentHash);
        const possibleDuplication = output.children.find(
          (node) => createHashForNodes(node) === createHashForNodes(parentNode),
        );

        if (!possibleDuplication) {
          output.children.push(parentNode);
        }
      }
    }
  }

  const fullFilePath = path.join(process.cwd(), 'lib/data', 'sitemap.json');
  await fs.outputJson(fullFilePath, output);
}
