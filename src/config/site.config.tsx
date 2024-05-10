import { Metadata } from 'next';
import logoImg from '@public/logo.svg';
import { LAYOUT_OPTIONS } from '@/config/enums';
import logoIconImg from '@public/logo-short.svg';
import { OpenGraph } from 'next/dist/lib/metadata/types/opengraph-types';

enum MODE {
  DARK = 'dark',
  LIGHT = 'light',
}

export const siteConfig = {
  title: 'dashfusion | App Dashboard',
  description: `dashfusion is an all-in-one dashboard with apps built for modern web technologies. It's a modern, beautiful, and customizable dashboard that you can use to build awesome apps.`,
  logo: logoImg,
  icon: logoIconImg,
  mode: MODE.LIGHT,
  layout: LAYOUT_OPTIONS.HYDROGEN,
  // TODO: favicon
};

export const metaObject = (
  title?: string,
  openGraph?: OpenGraph,
  description: string = siteConfig.description
): Metadata => {
  return {
    title: title ? `${title} | dashfusion` : siteConfig.title,
    description,
    openGraph: openGraph ?? {
      title: title ? `${title} | dashfusion` : title,
      description,
      url: 'https://dashfusion.vercel.app/',
      siteName: 'dashfusion',
      images: {
        url: 'https://dashfusion.vercel.app/og-banner.png',
        width: 1200,
        height: 630,
      },
      locale: 'en_US',
      type: 'website',
    },
  };
};
