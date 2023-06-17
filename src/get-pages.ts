import dayjs from 'dayjs';
import fs from 'fs-extra';
import path from 'path';

interface Input {
  tag?: string;
  limit?: number;
  page?: number;
}

export default async function getPages(input: Input) {
  const pagesPath = path.join(process.cwd(), 'lib/data/pages.json');
  const pages = await fs.readJson(pagesPath); 

  const { tag, limit = 10, page = 1 } = input;

  let results = pages as Page[];
  let total = pages.length;

  if (tag) {
    results = results.filter((result) => result.tags?.includes(tag));
    total = results.length;
  }

  results = results.sort((a, b) => dayjs(b.datePublished).diff(dayjs(a.datePublished)));

  results = results.slice((page - 1) * limit, page * limit);

  return {
    pages: results,
    total
  };
}