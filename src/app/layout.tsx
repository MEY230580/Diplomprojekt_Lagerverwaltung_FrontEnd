import { ThemeProviderWrapper } from "@/app/components/Dark Mode/ThemeContext";
import { LocationProvider } from "@/app/location/LocationContext";
import { SearchProvider} from "@/app/components/TopBar/SearchContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="de">
        <body>
        <ThemeProviderWrapper>
            <LocationProvider>
                <SearchProvider>
                {children}
                </SearchProvider>
            </LocationProvider>
        </ThemeProviderWrapper>
        </body>
        </html>
    );
}
