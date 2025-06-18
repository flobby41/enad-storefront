import { LOCALIZED_COUNTRIES } from "@/constants/markets";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import translations from "../constants/translations.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const useTranslation = (lang: string = "en") => {
  const locale = LOCALIZED_COUNTRIES.includes(lang) ? lang : "en";
  const transArray: {
    [key: string]: {
      items: {
        key: string;
        value: null | string;
      }[];
    };
  } = translations;
  return {
    t: (key: string) =>
      transArray[locale]?.["items"].find((item: any) => item.key === key)
        ?.value || key,
  };
};
