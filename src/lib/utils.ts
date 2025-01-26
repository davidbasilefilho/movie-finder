import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLanguageName(code: string, displayLocale = "en") {
  try {
    const locale = new Intl.Locale(code);
    const languageCode = locale.language;
    return new Intl.DisplayNames([displayLocale], { type: "language" }).of(
      languageCode
    );
  } catch (e) {
    if (e instanceof Error) {
      console.error("Invalid language code:", e.message);
      return null;
    }
  }
}
