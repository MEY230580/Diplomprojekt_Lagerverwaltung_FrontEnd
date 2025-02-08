import { ThemeProviderWrapper } from "@/app/components/Dark Mode/ThemeContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de">
        <body>
        <ThemeProviderWrapper>
            {children}
        </ThemeProviderWrapper>
        </body>
        </html>
    );
}
