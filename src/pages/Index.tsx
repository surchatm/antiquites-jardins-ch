import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import AntiqueCard from "@/components/antiques/AntiqueCard";
import { useAntiques } from "@/hooks/useAntiques";
import { Skeleton } from "@/components/ui/skeleton";
const Index = () => {
  const {
    data: antiques,
    isLoading,
    error
  } = useAntiques();
  return <>
      <Helmet>
        <title>Antiquités et Jardins | Eric Surchat - Bulle, Suisse</title>
        <meta name="description" content="Découvrez notre collection d'antiquités et objets anciens sélectionnés avec passion à La Tour-de-Trême – Bulle, Suisse. Pièces uniques pour votre intérieur et jardin." />
      </Helmet>

      <Layout>
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />
          <div className="container relative">
            <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
              <span className="inline-block text-xs font-medium tracking-[0.3em] text-primary uppercase mb-4">
                Bulle, Suisse
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight">
                Antiquités et Jardins
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">Une sélection raffinée de pièces et objets anciens, choisis avec passion pour sublimer votre intérieur et votre jardin.</p>
            </div>
          </div>
        </section>

        {/* Collection Section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-3">
                Notre Collection
              </h2>
              <p className="text-muted-foreground">
                Découvrez nos pièces actuellement disponibles
              </p>
            </div>

            {isLoading ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[4/3] w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-6 w-1/3" />
                  </div>)}
              </div> : error ? <div className="text-center py-12">
                <p className="text-destructive">
                  Une erreur est survenue lors du chargement des articles.
                </p>
              </div> : antiques && antiques.length > 0 ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {antiques.map((antique, index) => <div key={antique.id} className="animate-fade-in-up" style={{
              animationDelay: `${index * 100}ms`
            }}>
                    <AntiqueCard id={antique.id} title={antique.title} description={antique.description} price={Number(antique.price)} imageUrl={antique.image_url} />
                  </div>)}
              </div> : <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                    <span className="font-display text-2xl text-muted-foreground">A&J</span>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    Aucun article disponible
                  </h3>
                  <p className="text-muted-foreground">
                    Revenez bientôt pour découvrir notre nouvelle collection.
                  </p>
                </div>
              </div>}
          </div>
        </section>
      </Layout>
    </>;
};
export default Index;