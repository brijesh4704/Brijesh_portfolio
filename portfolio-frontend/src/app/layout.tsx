import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import '@/app/globals.css';
import { Oxanium } from 'next/font/google';
import LenisProvider from '@/components/utils/LenisProvider';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/header/Header';

const oxanium = Oxanium({
    subsets: ['latin'],
    variable: '--font-oxanium', // Define a CSS variable for Tailwind
});

export const metadata = {
    title: 'Brijesh Singh',
    description: 'Brijesh Singh - Portfolio',
};

// Define Props Type
interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`antialiased ${oxanium.variable} font-oxanium bg-background  max-w-none`}
            >
                <LenisProvider />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Toaster />
                    <Header />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
