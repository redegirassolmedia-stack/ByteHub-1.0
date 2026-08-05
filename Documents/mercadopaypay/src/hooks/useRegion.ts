import { useState, useEffect } from "react";

export type CountryCode = "AO" | "BR" | "PT" | "MZ" | "CV" | "GW" | "ST" | "TL";

export interface Country {
    code: CountryCode;
    name: string;
    flag: string;
    currency: string;
    currencyCode: string;
    locale: string;
}

export const countries: Country[] = [
    { code: "AO", name: "Angola", flag: "🇦🇴", currency: "Kz", currencyCode: "AOA", locale: "pt-AO" },
    { code: "BR", name: "Brasil", flag: "🇧🇷", currency: "R$", currencyCode: "BRL", locale: "pt-BR" },
    { code: "PT", name: "Portugal", flag: "🇵🇹", currency: "€", currencyCode: "EUR", locale: "pt-PT" },
    { code: "MZ", name: "Moçambique", flag: "🇲🇿", currency: "MT", currencyCode: "MZN", locale: "pt-MZ" },
    { code: "CV", name: "Cabo Verde", flag: "🇨🇻", currency: "$", currencyCode: "CVE", locale: "pt-CV" },
    { code: "GW", name: "Guiné-Bissau", flag: "🇬🇼", currency: "FCFA", currencyCode: "XOF", locale: "pt-GW" },
    { code: "ST", name: "São Tomé e Príncipe", flag: "🇸🇹", currency: "Db", currencyCode: "STN", locale: "pt-ST" },
    { code: "TL", name: "Timor-Leste", flag: "🇹🇱", currency: "$", currencyCode: "USD", locale: "pt-TL" },
];

/** Formats a price value using the currency of a given country */
export const formatPrice = (price: number | string, country: Country): string => {
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(numericPrice)) return `${country.currency} 0`;
    const formatted = numericPrice.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    return `${country.currency} ${formatted}`;
};

export const useRegion = () => {
    const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
        const saved = localStorage.getItem("mercadopay_region");
        if (saved) {
            const found = countries.find((c) => c.code === saved);
            if (found) return found;
        }
        return countries[0]; // Default to Angola
    });

    const setRegion = (code: CountryCode) => {
        const country = countries.find((c) => c.code === code);
        if (country) {
            setSelectedCountry(country);
            localStorage.setItem("mercadopay_region", code);
            window.dispatchEvent(new Event("regionChange"));
        }
    };

    // Geolocation: auto-detect country on first visit (no saved region)
    useEffect(() => {
        const saved = localStorage.getItem("mercadopay_region");
        if (saved) return; // Already has a saved preference

        const detectCountry = async () => {
            try {
                const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(5000) });
                if (!res.ok) return;
                const data = await res.json();
                const code = data.country_code as string;
                const match = countries.find((c) => c.code === code);
                if (match) {
                    setSelectedCountry(match);
                    localStorage.setItem("mercadopay_region", match.code);
                    window.dispatchEvent(new Event("regionChange"));
                }
            } catch {
                // Silently fail — keep default (Angola)
            }
        };
        detectCountry();
    }, []);

    useEffect(() => {
        const handleStorage = () => {
            const saved = localStorage.getItem("mercadopay_region");
            const found = countries.find((c) => c.code === saved);
            if (found) setSelectedCountry(found);
        };

        window.addEventListener("regionChange", handleStorage);
        return () => window.removeEventListener("regionChange", handleStorage);
    }, []);

    return { selectedCountry, setRegion, countries, formatPrice: (price: number | string) => formatPrice(price, selectedCountry) };
};
