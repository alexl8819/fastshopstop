import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Redis } from '@upstash/redis';
import { getSecret } from 'astro:env/server';

const TIME_LEFT_REGEX = /^P(?:(\d+)D)?(?:T(\d+))?(?:H(\d+))?(?:M(\d+))?S$/m;

dayjs.extend(relativeTime);

export interface Inventory {
	lastUpdated: string
	items: Array<InventoryItem>
}

export interface InventoryItem {
	title: string
	description: string
	status: string
	quantity: number
	quantitySold: number
	categorySku: string
	price: number
	condition: string
	condition_description?: string
	listingUrl: string
	timeLeft: string | Date
	expiration?: string
	mainScreenshot: string
	returnsPolicy: {
		ReturnsAcceptedOption: string
		ReturnsAccepted: string
		InternationalReturnsAcceptedOption: string
	}
}

const redis = new Redis({
    url: getSecret('UPSTASH_REDIS_REST_URL'),
    token: getSecret('UPSTASH_REDIS_REST_TOKEN')
});

export async function getCurrentItems (key: string): Promise<string> {
    const currentInventory: string = (await redis.get(key) as unknown) as string;
    return currentInventory;
}

export function convertTimeLeft (time: string): Date {
	let futureDate = dayjs();
	// Parse time string against regex
	const parsedTime: Array<any> | null = TIME_LEFT_REGEX.exec(time.trim());
	// Throw if time string is invalid
	if (!parsedTime || !Array.isArray(parsedTime)) {
		throw new Error('Invalid time provided: must be string');
	}
	// TODO: simplify logic
	if (parsedTime[1]) {
		futureDate = futureDate.add(parsedTime[1], 'd');
	}
	if (parsedTime[2]) {
		futureDate = futureDate.add(parsedTime[2], 'h');
	} else if (parsedTime[2] && !parsedTime[1] && !parsedTime[3] && !parsedTime[4]) {
		futureDate = futureDate.add(parsedTime[2], 's');
	}
	if (parsedTime[3]) {
		futureDate = futureDate.add(parsedTime[3], 'm');
	} else if (!parsedTime[3] && (parsedTime[2] && parsedTime[4])) {
		futureDate = futureDate.add(parsedTime[2], 'm');
	}
	if (parsedTime[4]) {
		futureDate = futureDate.add(parsedTime[4], 's');
	}

	return futureDate.toDate();
}

export function convertTimeLeftToExpiration (future: string | Date): string {
	const now = dayjs();
	const days = dayjs(future).diff(now, 'days');
	
	if (days === 0) {
		const hours = dayjs(future).diff(now, 'hours');

		if (hours === 0) {
			const minutes = dayjs(future).diff(now, 'minutes');
			return `${minutes} minutes`;
		}

		return `${hours} hours`;
	}

	return `${days} days`;
}
