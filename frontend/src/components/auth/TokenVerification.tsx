import api from "@/services/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ContentContainer from "../ContentContainer";
import { useTranslations } from "next-intl";

export default function VerificationComponent () {
    const t = useTranslations('TokenVerification');
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your account...');

    useEffect(() => {
        if(!token) {
            setStatus('error');
            setMessage(t('error'));
            return;
        }

        const verifyToken = async () => {
            try {
                await api.get(`/auth/verify-email?token=${token}`);
                setStatus('success');
                setMessage(t('success'));
            } catch (error) {
                setStatus('error');
                setMessage(t('secondError'));
                console.error('Error in the token verification:', error);
                
            }
        };

        verifyToken();
    }, [token, t]);

    const renderContent = () => {
        switch(status) {
            case 'loading':
                return <p className="text-lg text-neutral-300">{message}</p>;
            case 'success':
                return (
                    <>
                        <p className="text-lg text-green-400 mb-6">{message}</p>
                        <Link href="/login" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded transition-colors">
                            {t('login')}
                        </Link>
                    </>
                );
            case 'error':
                return <p className="text-lg text-red-400">{message}</p>;
            }   
    }

    return (
        <div className="flex items-center justify-center min-h-screen text-center">
            <ContentContainer>
                <h1 className="text-4xl font-bold mb-4 text-white">{t('acc')}</h1>
                {renderContent()}
            </ContentContainer>
        </div>
    );
};
