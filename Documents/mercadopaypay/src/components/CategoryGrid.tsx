import { useNavigate } from "react-router-dom";
import { Car, Home, Smartphone, Shirt, Sofa, Bike, Laptop, Baby, Wrench, Gamepad2 } from "lucide-react";

const iconMap: Record<string, any> = {
  Car, Home, Smartphone, Shirt, Sofa, Bike, Laptop, Baby, Wrench, Gamepad2,
};

const categories = [
  { name: "Autos e peças", icon: "Car", slug: "autos" },
  { name: "Imóveis", icon: "Home", slug: "imoveis" },
  { name: "Celulares", icon: "Smartphone", slug: "celulares" },
  { name: "Moda", icon: "Shirt", slug: "moda" },
  { name: "Móveis", icon: "Sofa", slug: "moveis" },
  { name: "Esportes", icon: "Bike", slug: "esportes" },
  { name: "Eletrônicos", icon: "Laptop", slug: "eletronicos" },
  { name: "Bebês", icon: "Baby", slug: "bebes" },
  { name: "Serviços", icon: "Wrench", slug: "servicos" },
  { name: "Games", icon: "Gamepad2", slug: "games" },
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <section className="container py-8">
      <h2 className="text-lg font-bold mb-4">Categorias</h2>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon];
          return (
            <button
              key={cat.slug}
              onClick={() => navigate(`/buscar?categoria=${cat.slug}`)}
              className="group flex flex-col items-center gap-2 rounded-xl p-3 transition-colors hover:bg-accent"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {Icon && <Icon className="h-5 w-5" />}
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground text-center leading-tight">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
