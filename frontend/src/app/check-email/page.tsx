import ContentContainer from "@/components/ContentContainer";
import Link from "next/link";

export default function CheckEmailPage() {
    return (
        <div className="flex items-center justify-center min-h-screen text-center">
            <ContentContainer>
                <h1 className="text-4xl font-bold mb-4 text-white">Quase lá!</h1>
                <p className="text-lg text-neutral-300 mb-8">
                    We sent to your email an verification link.
                    <br />
                    Please, click in the like to activate your account.
                </p>
                <Link href="/login" className="text-sky-500 hover:underline font-semibold">
                    Back to the login page.
                </Link>
            </ContentContainer>
        </div>
    )
}