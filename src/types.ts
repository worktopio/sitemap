export type Breadcrumb = {
  name: string;
  href: string;
};

export type Page = {
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

export type SitemapNode = {
  name: string;
  href: string;
  children: SitemapNode[];
};
