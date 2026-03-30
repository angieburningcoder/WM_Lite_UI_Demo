import { UserProfile } from '@/data/types';

export const BASE_PRICE = 300;
export const KEYWORD_PRICE = 99;
export const PLATFORM_PRICE = 299;
export const BRAND_PRICE = 299;
export const DELEGATION_PRICE = 599;

export function calculateMonthlyPrice(
  keywords: number,
  platforms: number,
  brands: number,
  isDelegate: boolean
): number {
  return (
    BASE_PRICE +
    keywords * KEYWORD_PRICE +
    platforms * PLATFORM_PRICE +
    brands * BRAND_PRICE +
    (isDelegate ? DELEGATION_PRICE : 0)
  );
}

export function calculateYearlyPrice(monthly: number): number {
  return monthly * 10;
}

export function calculateMonthlyPriceFromProfile(profile: Pick<UserProfile, 'monitoredKeywords' | 'platforms' | 'brandNames' | 'delegationPreference'>): number {
  return calculateMonthlyPrice(
    profile.monitoredKeywords.length,
    profile.platforms.length,
    profile.brandNames.length,
    profile.delegationPreference === 'delegate_when_needed'
  );
}
