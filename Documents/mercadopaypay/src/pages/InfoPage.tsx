import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface InfoPageProps {
    title: string;
    content: React.ReactNode;
}

const InfoPage = ({ title, content }: InfoPageProps) => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-1 container max-w-3xl py-12 md:py-20 animate-fade-in">
                <h1 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight">{title}</h1>
                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
                    {content}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default InfoPage;
