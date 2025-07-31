import BackgroundSetter from "@/components/BackgroundSetter";

const backgroundImages = [
    '/backgrounds/cena.jpg', 
    '/backgrounds/cena1.jpg', 
    '/backgrounds/cena2.jpeg', 
    '/backgrounds/cena3.jpg', 
    '/backgrounds/cena4.jpg', 
    '/backgrounds/cena5.jpg', 
    '/backgrounds/cena6.jpg',
    '/backgrounds/cena7.jpg',
    '/backgrounds/cena8.jpg',
    '/backgrounds/cena9.png',
    '/backgrounds/cena10.jpg',
];
export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
        <BackgroundSetter images={backgroundImages} />
        <main className="relative z-10">
            {children}
        </main>
        </>
    );
}