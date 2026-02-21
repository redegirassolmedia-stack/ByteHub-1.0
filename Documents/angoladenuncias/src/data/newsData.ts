import newsHero1 from "@/assets/news-hero-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";
import news4 from "@/assets/news-4.jpg";
import news5 from "@/assets/news-5.jpg";
import news6 from "@/assets/news-6.jpg";
import news7 from "@/assets/news-7.jpg";
import news8 from "@/assets/news-8.jpg";

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  image: string;
  timestamp: string;
  author: string;
}

export const heroArticle: NewsArticle = {
  id: "1",
  title: "Governo anuncia novo pacote de medidas para combater a crise habitacional",
  summary: "O executivo apresentou esta quinta-feira um conjunto de 12 medidas que visam aumentar a oferta de habitação acessível nas grandes cidades. Entre as propostas está a simplificação do licenciamento urbanístico e novos incentivos fiscais para senhorios.",
  category: "Política",
  image: newsHero1,
  timestamp: "Há 45 minutos",
  author: "Redação",
};

export const topArticles: NewsArticle[] = [
  {
    id: "2",
    title: "Inflação recua para 2,1% em fevereiro, o valor mais baixo em dois anos",
    summary: "Os preços ao consumidor desaceleraram pelo quinto mês consecutivo, aproximando-se da meta do BCE.",
    category: "Economia",
    image: news2,
    timestamp: "Há 1 hora",
    author: "Ana Martins",
  },
  {
    id: "3",
    title: "Empresas tecnológicas lideram contratações no primeiro trimestre",
    summary: "O setor tecnológico criou mais de 15 mil postos de trabalho nos primeiros três meses do ano.",
    category: "Negócios",
    image: news3,
    timestamp: "Há 2 horas",
    author: "Pedro Costa",
  },
  {
    id: "4",
    title: "Seleção Nacional prepara duplo compromisso nas eliminatórias",
    summary: "Roberto Martínez convocou 26 jogadores para os jogos contra a Suécia e Eslováquia.",
    category: "Desporto",
    image: news4,
    timestamp: "Há 2 horas",
    author: "Miguel Sousa",
  },
  {
    id: "5",
    title: "Inteligência artificial transforma diagnósticos médicos em Portugal",
    summary: "Hospitais portugueses adotam sistemas de IA para deteção precoce de doenças oncológicas.",
    category: "Tecnologia",
    image: news5,
    timestamp: "Há 3 horas",
    author: "Sofia Oliveira",
  },
];

export const latestArticles: NewsArticle[] = [
  {
    id: "6",
    title: "SNS reforça resposta com contratação de 2.000 novos profissionais",
    summary: "O Ministério da Saúde anunciou a abertura de concursos para médicos e enfermeiros em todo o país.",
    category: "Saúde",
    image: news6,
    timestamp: "Há 3 horas",
    author: "Joana Ferreira",
  },
  {
    id: "7",
    title: "UE aprova novo pacto de defesa com investimento recorde de €800 mil milhões",
    summary: "Os 27 Estados-membros chegaram a acordo sobre o maior reforço militar da história europeia.",
    category: "Mundo",
    image: news7,
    timestamp: "Há 4 horas",
    author: "Ricardo Almeida",
  },
  {
    id: "8",
    title: "Lisboa recebe maior exposição de arte contemporânea portuguesa",
    summary: "O MAAT inaugura retrospetiva com obras de 50 artistas nacionais das últimas três décadas.",
    category: "Cultura",
    image: news8,
    timestamp: "Há 5 horas",
    author: "Maria Santos",
  },
];

export const opinionArticles = [
  { id: "o1", title: "A ilusão da recuperação económica", author: "Carlos Guimarães", timestamp: "Há 2 horas" },
  { id: "o2", title: "Porque precisamos de repensar a educação", author: "Teresa Lopes", timestamp: "Há 4 horas" },
  { id: "o3", title: "O futuro da energia em Portugal", author: "Rui Tavares", timestamp: "Há 6 horas" },
  { id: "o4", title: "Democracia e redes sociais: uma relação perigosa", author: "Isabel Moreira", timestamp: "Há 8 horas" },
];

export const categories = [
  "Destaque", "Política", "Economia", "Mundo", "Desporto", "Cultura", "Tecnologia", "Opinião", "Saúde"
];
