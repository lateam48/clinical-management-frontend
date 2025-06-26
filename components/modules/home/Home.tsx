import {
    HomeHero,
    HomeNav,
    HomeOffers,
    HomeStats,
    HomeTestimonials,
    HomeHowItWorks,
    HomeCta,
    HomeFooter,
} from "@/components/modules/home"

export function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <HomeNav />
            <HomeHero />
            <HomeStats />
            <HomeOffers />
            <HomeTestimonials />
            <HomeHowItWorks />
            <HomeCta />
            <HomeFooter />
        </div>
    )
}