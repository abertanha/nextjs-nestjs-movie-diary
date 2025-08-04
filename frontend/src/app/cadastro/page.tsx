'use client';

import { useAuth } from "@/auth/AuthContext";
import Button from "@/components/Button";
import ContentContainer from "@/components/ContentContainer";
import { RegisterFormInputs } from "@/types/auth.types";
import Link from "next/link";
import { useState } from "react";

export default function CadastroPage() {
    const { register } = useAuth();
    const [formData, setFormData] = useState<RegisterFormInputs>({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value} ));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('The passwords are not indentical!');
            return;
        }

        setIsSubmitting(true);

        try {
            await register(formData);
        } catch (err: unknown) {
            if (err instanceof Error && 'response' in err && (err as Error & { response: { status: number } }).response?.status === 409){
                setError('Email already taken');
            } else {
                setError('Something went wrong during registration, please try again.');
            }
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
                    Create Account
                </h1>
                <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-4">
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={inputBaseClass}
                            required
                            placeholder="email"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className={labelBaseClass}>Password with at least 8 characters.:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className={inputBaseClass}
                            required
                            placeholder="password"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className={labelBaseClass}>Confirm password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={inputBaseClass}
                            required
                            placeholder="repeat your password"
                        />
                    </div>

                    {error && <p className="mb-4 text-sm text-center text-red-400">{error}</p>}

                    <div className="flex flex-col items-center gap-4">
                        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </Button>
                        <p className="text-sm text-neutral-400">
                            already signed up?{' '}
                            <Link href="/login" className="font-semibold text-sky-500 hover:text-sky-400">
                                Please sing in!
                            </Link>
                        </p>
                    </div>
                </form>
            </ContentContainer>
        </div>
    )
}