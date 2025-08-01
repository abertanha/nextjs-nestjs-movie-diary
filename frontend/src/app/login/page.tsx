'use client';

import { useAuth } from "@/auth/AuthContext";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { LoginFormInputs } from "@/types/auth.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState<LoginFormInputs>({
        email: '', password: ''});
    const [error, setError ] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            await login(formData);
            // redirects to the first page as soon as the user signin
            router.push('/');
        } catch ( err: any) {

            // defines a friendly error msg for the user
            setError('Password or email are invalid, please try again.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputBaseClass = "w-full p-2.5 bg-neutral-800 border border-neutral-700 rounded-md text-white placeholder-neutral-500 focus:ring-sky-500 focus:border-sky-500 focus:outline-none";
    const labelBaseClass = "block mb-1.5 text-sm font-medium text-neutral-300";

    return (
        <div className="flex items-center justify-center min-h-screen">
            <ContentContainer className="w-full max-w-md">
                <h1 className="text-3xl sm:text-4xl font-bold text-white text-center italic mb-8">
                    Login
                </h1>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <label htmlFor="email" className={labelBaseClass}>Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder={formData.email}
                            onChange={handleInputChange}
                            className={inputBaseClass}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className={labelBaseClass}>Senha:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder={formData.password}
                            onChange={handleInputChange}
                            className={inputBaseClass}
                            required
                        />
                    </div>

                    {error && <p className="mb-4 text-sm text-center text-red-400">{error}</p>}

                    <div className="flex flex-col items-center gap-4">
                        <Button type="submit" variant="primary" className="w-fully" disabled={isSubmitting}>
                            {isSubmitting ? 'Entrando...' : 'Entrar'}
                        </Button>
                        <p className="text-sm text-neutral-400">
                            Não tem conta?{' '}
                            <Link href="/cadastro" className="font-semibold text-sky-500 hover:text-sky-400">
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </form>
            </ContentContainer>
        </div>
    );
}