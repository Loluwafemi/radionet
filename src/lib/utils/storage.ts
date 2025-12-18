/**
 * localStorage utility functions with type safety and error handling
 */

export interface StorageOptions {
	prefix?: string;
	serialize?: (value: any) => string;
	deserialize?: (value: string) => any;
}

const DEFAULT_OPTIONS: Required<StorageOptions> = {
	prefix: 'radio_',
	serialize: JSON.stringify,
	deserialize: JSON.parse
};

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
	try {
		const test = '__storage_test__';
		localStorage.setItem(test, test);
		localStorage.removeItem(test);
		return true;
	} catch {
		return false;
	}
}

/**
 * Get item from localStorage with type safety
 */
export function getItem<T>(key: string, defaultValue: T, options: StorageOptions = {}): T {
	if (!isStorageAvailable()) {
		return defaultValue;
	}

	const { prefix, deserialize } = { ...DEFAULT_OPTIONS, ...options };
	const fullKey = prefix + key;

	try {
		const item = localStorage.getItem(fullKey);
		if (item === null) {
			return defaultValue;
		}
		return deserialize(item) as T;
	} catch (error) {
		console.error(`Error reading from localStorage (key: ${fullKey}):`, error);
		return defaultValue;
	}
}

/**
 * Set item in localStorage
 */
export function setItem<T>(key: string, value: T, options: StorageOptions = {}): boolean {
	if (!isStorageAvailable()) {
		return false;
	}

	const { prefix, serialize } = { ...DEFAULT_OPTIONS, ...options };
	const fullKey = prefix + key;

	try {
		const serialized = serialize(value);
		localStorage.setItem(fullKey, serialized);
		return true;
	} catch (error) {
		console.error(`Error writing to localStorage (key: ${fullKey}):`, error);
		return false;
	}
}

/**
 * Remove item from localStorage
 */
export function removeItem(key: string, options: StorageOptions = {}): boolean {
	if (!isStorageAvailable()) {
		return false;
	}

	const { prefix } = { ...DEFAULT_OPTIONS, ...options };
	const fullKey = prefix + key;

	try {
		localStorage.removeItem(fullKey);
		return true;
	} catch (error) {
		console.error(`Error removing from localStorage (key: ${fullKey}):`, error);
		return false;
	}
}

/**
 * Clear all items with the specified prefix
 */
export function clear(options: StorageOptions = {}): boolean {
	if (!isStorageAvailable()) {
		return false;
	}

	const { prefix } = { ...DEFAULT_OPTIONS, ...options };

	try {
		const keys = Object.keys(localStorage);
		keys.forEach(key => {
			if (key.startsWith(prefix)) {
				localStorage.removeItem(key);
			}
		});
		return true;
	} catch (error) {
		console.error('Error clearing localStorage:', error);
		return false;
	}
}

/**
 * Get all keys with the specified prefix
 */
export function getAllKeys(options: StorageOptions = {}): string[] {
	if (!isStorageAvailable()) {
		return [];
	}

	const { prefix } = { ...DEFAULT_OPTIONS, ...options };

	try {
		const keys = Object.keys(localStorage);
		return keys
			.filter(key => key.startsWith(prefix))
			.map(key => key.replace(prefix, ''));
	} catch (error) {
		console.error('Error getting keys from localStorage:', error);
		return [];
	}
}

/**
 * Watch for storage changes across tabs/windows
 */
export function watchStorage(
	key: string,
	callback: (newValue: any, oldValue: any) => void,
	options: StorageOptions = {}
): () => void {
	if (!isStorageAvailable()) {
		return () => {};
	}

	const { prefix } = { ...DEFAULT_OPTIONS, ...options };
	const fullKey = prefix + key;

	const handler = (e: StorageEvent) => {
		if (e.key === fullKey && e.storageArea === localStorage) {
			try {
				const oldValue = e.oldValue ? JSON.parse(e.oldValue) : null;
				const newValue = e.newValue ? JSON.parse(e.newValue) : null;
				callback(newValue, oldValue);
			} catch (error) {
				console.error('Error parsing storage event:', error);
			}
		}
	};

	window.addEventListener('storage', handler);

	// Return cleanup function
	return () => {
		window.removeEventListener('storage', handler);
	};
}

/**
 * Get storage size in bytes
 */
export function getStorageSize(): number {
	if (!isStorageAvailable()) {
		return 0;
	}

	try {
		let size = 0;
		for (const key in localStorage) {
			if (localStorage.hasOwnProperty(key)) {
				size += localStorage[key].length + key.length;
			}
		}
		return size * 2; // UTF-16 uses 2 bytes per character
	} catch (error) {
		console.error('Error calculating storage size:', error);
		return 0;
	}
}

/**
 * Format storage size for display
 */
export function formatStorageSize(bytes: number): string {
	const units = ['B', 'KB', 'MB'];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(2)} ${units[unitIndex]}`;
}