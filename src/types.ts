import { Metadata as NextMetadata } from 'next';
import { Author } from 'next/dist/lib/metadata/types/metadata-types';

declare global {
  type Breadcrumb = {
    name: string;
    href: string;
  };

  interface Metadata extends NextMetadata {
    title: string;
    datePublished: string;
    dateModified?: string;
    authors: Author[];
    breadcrumbs: Breadcrumb[];
    internalTitle?: string;
    internalDescription?: string;
    image?: string;
    tags?: string[];
  }

  interface Page extends Metadata {
    href: string;
  }

  type SitemapNode = {
    name: string;
    href: string;
    children: SitemapNode[];
  };
}
