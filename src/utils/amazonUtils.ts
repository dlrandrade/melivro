
/**
 * Utility to ensure Amazon links have the correct affiliate tag.
 */
import { AFFILIATE_TAG } from '../../constants';

export const getAmazonSearchUrl = (query: string): string => {
    return `https://www.amazon.com.br/s?k=${encodeURIComponent(query)}&tag=${AFFILIATE_TAG}`;
};

export const appendAffiliateTag = (url: string): string => {
    if (!url || !url.includes('amazon.')) return url;

    try {
        const urlObj = new URL(url);
        urlObj.searchParams.set('tag', AFFILIATE_TAG);
        return urlObj.toString();
    } catch (e) {
        // If it's a shortened link like amzn.to, we can't easily append without resolving,
        // but usually those are created with the tag already.
        // For regular URLs that might fail URL constructor (though unlikely for valid hrefs):
        if (url.includes('?')) {
            return url.includes('tag=') ? url.replace(/tag=[^&]*/, `tag=${AFFILIATE_TAG}`) : `${url}&tag=${AFFILIATE_TAG}`;
        }
        return `${url}?tag=${AFFILIATE_TAG}`;
    }
};
