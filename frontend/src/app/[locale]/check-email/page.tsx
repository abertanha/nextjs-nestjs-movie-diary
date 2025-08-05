import ContentContainer from "@/components/ContentContainer";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function CheckEmailPage() {
    const t = useTranslations("CheckEmail")
    return (
        <div className="flex items-center justify-center min-h-screen text-center">
            <ContentContainer>
                <h1 className="text-4xl font-bold mb-4 text-white">{t('almost')}</h1>
                <p className="text-lg text-neutral-300 mb-8">
                    {t('sent')}
                    <br />
                    {t('click')}
                </p>
                <Link href="/login" className="text-sky-500 hover:underline font-semibold">
                    {t('back')}
                </Link>
            </ContentContainer>
        </div>
    )
}