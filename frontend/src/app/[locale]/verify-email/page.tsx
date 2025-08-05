'use client';

import VerificationComponent from "@/components/auth/TokenVerification";
import { useTranslations } from "next-intl";
import { Suspense } from "react";

export default function VerifyEmailPage() {
    const t = useTranslations('VerifyEmail');
    return (
        <Suspense fallback={<div>{t('loading')}</div>}>
            <VerificationComponent />
        </Suspense>
    )
}