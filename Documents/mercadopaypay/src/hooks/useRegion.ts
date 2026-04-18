import { useState, useEffect } from "react";

export type CountryCode = "AO" | "BR" | "PT" | "MZ" | "CV" | "GW" | "ST" | "TL";

export interface Country {
    code: CountryCode;
    name: string;
    flag: string;
}

export const countries: Country[] = [
    { code: "AO", name: "Angola", flag: "🇦🇴" },
    { code: "BR", name: "Brasil", flag: "🇧🇷" },
    { code: "PT", name: "Portugal", flag: "🇵🇹" },
    { code: "MZ", name: "Moçambique", flag: "🇲🇿" },
    { code: "CV", name: "Cabo Verde", flag: "🇨🇻" },
    { code: "GW", name: "Guiné-Bissau", flag: "🇬🇼" },
    { code: "ST", name: "São Tomé e Príncipe", flag: "🇸🇹" },
    { code: "TL", name: "Timor-Leste", flag: "🇹🇱" },
];

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

    useEffect(() => {
        const handleStorage = () => {
            const saved = localStorage.getItem("mercadopay_region");
            const found = countries.find((c) => c.code === saved);
            if (found) setSelectedCountry(found);
        };

        window.addEventListener("regionChange", handleStorage);
        return () => window.removeEventListener("regionChange", handleStorage);
    }, []);

    return { selectedCountry, setRegion, countries };
};
