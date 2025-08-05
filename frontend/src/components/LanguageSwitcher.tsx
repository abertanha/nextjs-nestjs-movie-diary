'use client';

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";

export default function LanguageSwitcher() {
    const [ isPending, startTransition ] = useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    const onSelectChange = (newLocale: string) => {
        startTransition(() => {
            router.push(pathname, {locale: newLocale});
        });
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => onSelectChange('pt-BR')}
                disabled={isPending || locale === 'pt-BR'}
                className={`p-1 rounded-md transistion-opacity ${locale === 'pt-BR' ? 'opacity-100' : 'opacity-50 hover:opacity-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Mudar para Português"
            >
                    <span className="text-2xl">🇧🇷</span>
            </button>
            <button
                onClick={() => onSelectChange('en-US')}
                disabled={isPending || locale === 'en-US'}
                className={`p-1 rounded-md transition-opacity ${locale === 'en-US' ? 'opacity-100' : 'opacity-50 hover:opacity-100'} disabled:opacity-50 disabled:cursor-not-allowed`}
                title="Switch to English"
            >
                <span className="text-2xl">🇺🇸</span>
            </button>
        </div>
    );
}