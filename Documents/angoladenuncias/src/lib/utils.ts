import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(dateString: string) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return formatDistanceToNow(date, { addSuffix: true, locale: pt });
  } catch (e) {
    return dateString;
  }
}

export const withTimeout = async <T extends unknown>(promise: Promise<T> | PromiseLike<T> | any, timeoutMs: number = 60000): Promise<T> => {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Timeout: A operação demorou demasiado tempo (${timeoutMs / 1000}s). Verifique a sua ligação.`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

export const getYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/|live\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export function toSlug(text: string) {
  return text
    .toString()
    .normalize('NFD') // separate accents from characters
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // spaces to hyphens
    .replace(/[^\w-]+/g, '') // remove special chars
    .replace(/--+/g, '-'); // remove double hyphens
}
