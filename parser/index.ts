import { JSDOM } from 'jsdom';

interface OpenGraphTags {
  title?: string;
  url?: string;
  siteName?: string;
  description?: string;
  image?: string;
  [x: string]: string;
}

interface MetaData {
  title: string;
  og: OpenGraphTags;
}

export const createHTMLInstance = (html: string): JSDOM => new JSDOM(html);

export const getHTMLTitle = (htmlInstance: JSDOM): string => htmlInstance.window.document.title;

export const filterOpenGraphTags = (meta: Element): boolean => meta.getAttribute('property').search(/og:/) > -1;

export const mapOpenGraphTags = (meta: Element): OpenGraphTags => ({
  [meta.getAttribute('property').replace(/og:/, '')]: meta.getAttribute('content'),
});

export const reduceOpenGraphTags = (result: OpenGraphTags, value: OpenGraphTags): OpenGraphTags => ({
  ...result,
  ...value,
});

export const getHTMLOpenGraphTags = (htmlInstance: JSDOM): OpenGraphTags => [...htmlInstance.window.document.querySelectorAll('meta[property]')]
  .filter(filterOpenGraphTags)
  .map(mapOpenGraphTags)
  .reduce(reduceOpenGraphTags, {});

export const createHTMLMetadataObject = (htmlInstance: JSDOM): MetaData => ({
  title: getHTMLTitle(htmlInstance),
  og: getHTMLOpenGraphTags(htmlInstance),
});

export const parser = (htmlFromSource: string): MetaData => createHTMLMetadataObject(createHTMLInstance(htmlFromSource));
