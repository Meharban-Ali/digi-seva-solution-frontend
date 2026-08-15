import { useTranslation } from "react-i18next";

/**
 * Custom hook that returns the current language code formatted for the backend API query param (?lang=en|hi).
 * @returns 'en' | 'hi'
 */
export function useApiLang(): "en" | "hi" {
  const { i18n } = useTranslation();
  return i18n.language && i18n.language.toLowerCase().startsWith("hi") ? "hi" : "en";
}

export default useApiLang;
