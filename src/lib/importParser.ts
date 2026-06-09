import Papa from 'papaparse';
import { detectPlatform } from './linkDetector';
import type { Platform } from '../types/affiliate';

export type ImportedAffiliateItem = {
  productId: string;
  productName: string;
  price: string;
  sold: string;
  shopName: string;
  commissionRate: string;
  commissionAmount: string;
  productUrl: string;
  affiliateUrl: string;
  platform: Platform;
};

export function parseAffiliateLine(line: string): ImportedAffiliateItem | null {
  const result = Papa.parse<string[]>(line.trim(), {
    skipEmptyLines: true,
  });

  const row = result.data[0] as string[] | undefined;

  if (!row || row.length < 9) return null;

  const productUrl = row.find((item: string) => item.includes('shopee.vn')) || '';
  const affiliateUrl =
    row.find((item: string) => item.includes('s.shopee.vn')) || '';

  return {
    productId: row[0],
    productName: row[1],
    price: row[2],
    sold: row[3],
    shopName: row[4],
    commissionRate: row[5],
    commissionAmount: row[6],
    productUrl,
    affiliateUrl,
    platform: detectPlatform(productUrl || affiliateUrl),
  };
}