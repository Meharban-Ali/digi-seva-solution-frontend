import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { i18n } = useTranslation();
  const currentLang = i18n.language && i18n.language.toLowerCase().startsWith("hi") ? "hi" : "en";

  const toggleLanguage = () => {
    const nextLang = currentLang === "en" ? "hi" : "en";
    i18n.changeLanguage(nextLang);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 border-slate-300 font-medium hover:bg-slate-100 transition-colors"
      title="Switch Language / भाषा बदलें"
    >
      <Globe className="h-4 w-4 text-slate-600" />
      <span className="text-xs uppercase tracking-wide">
        {currentLang === "en" ? (
          <>
            <span className="font-bold text-primary">EN</span>
            <span className="text-slate-400 font-normal"> | </span>
            <span className="text-slate-500 font-normal">हिंदी</span>
          </>
        ) : (
          <>
            <span className="text-slate-500 font-normal">EN</span>
            <span className="text-slate-400 font-normal"> | </span>
            <span className="font-bold text-primary">हिंदी</span>
          </>
        )}
      </span>
    </Button>
  );
}

export default LanguageToggle;
