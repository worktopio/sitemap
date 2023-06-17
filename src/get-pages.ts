import dayjs from 'dayjs';
import fs from 'fs-extra';
import path from 'path';

interface Input {
  tag?: string;
  limit?: number;
  page?: number;
}

export default async function getPages(input?: Input) {
  const pagesPath = path.join(process.cwd(), 'app', 'pages.json');
  const pages = await fs.readJson(pagesPath);

  let results = pages as Page[];
  let total = pages.length;

  if (input?.tag) {
    const { tag } = input;
    results = results.filter((result) => result.tags?.includes(tag));
    total = results.length;
  }

  results = results.sort((a, b) => dayjs(b.datePublished).diff(dayjs(a.datePublished)));

  if (input?.page && input?.limit) {
    const { page, limit } = input;
    results = results.slice((page - 1) * limit, page * limit);
  }

  return {
    pages: results,
    total,
  };
}
