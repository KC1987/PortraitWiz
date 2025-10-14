import Link from "next/link"
import ImageGen from "@/components/main/image-gen/image-gen"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-6 md:py-10">
        <div className="text-center max-w-4xl mx-auto">
          {/*<div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">*/}
          {/*  /!*<Sparkles className="w-4 h-4" />*!/*/}
          {/*  /!*<span>AI-Powered Professional Portraits</span>*!/*/}
          {/*</div>*/}

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Transform Your Photos into{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Professional Portraits
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload up to 4 reference images and we will create stunning, professional-quality portraits in seconds. Perfect for LinkedIn, resumes, and other profiles.
          </p>

          {/*<div className="flex flex-col sm:flex-row gap-4 justify-center">*/}
          {/*  <Button size="lg" asChild>*/}
          {/*    <Link href="#generator">Start Creating</Link>*/}
          {/*  </Button>*/}
          {/*  <Button size="lg" variant="outline" asChild>*/}
          {/*    <Link href="/pricing">View Pricing</Link>*/}
          {/*  </Button>*/}
          {/*</div>*/}
        </div>

        {/*/!* Feature Cards *!/*/}
        {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">*/}
        {/*  <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">*/}
        {/*    <CardContent className="pt-6">*/}
        {/*      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">*/}
        {/*        <Zap className="w-6 h-6 text-primary" />*/}
        {/*      </div>*/}
        {/*      <h3 className="font-semibold text-lg mb-2">Lightning Fast</h3>*/}
        {/*      <p className="text-sm text-muted-foreground">*/}
        {/*        Generate professional portraits in seconds, not hours. Instant delivery to your device.*/}
        {/*      </p>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}

        {/*  <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">*/}
        {/*    <CardContent className="pt-6">*/}
        {/*      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">*/}
        {/*        <Shield className="w-6 h-6 text-primary" />*/}
        {/*      </div>*/}
        {/*      <h3 className="font-semibold text-lg mb-2">Privacy First</h3>*/}
        {/*      <p className="text-sm text-muted-foreground">*/}
        {/*        Your images are processed securely and never stored. Complete privacy guaranteed.*/}
        {/*      </p>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}

        {/*  <Card className="border-primary/20 hover:shadow-lg transition-shadow duration-300">*/}
        {/*    <CardContent className="pt-6">*/}
        {/*      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">*/}
        {/*        <CheckCircle2 className="w-6 h-6 text-primary" />*/}
        {/*      </div>*/}
        {/*      <h3 className="font-semibold text-lg mb-2">HD Quality</h3>*/}
        {/*      <p className="text-sm text-muted-foreground">*/}
        {/*        Studio-quality professional portraits with premium backgrounds and lighting.*/}
        {/*      </p>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}
        {/*</div>*/}
      </section>

      {/* Generator Section */}
      <section id="generator" className="container mx-auto px-4 pb-16 md:pb-24">
        <ImageGen />
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-20">
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
          <CardContent className="py-12 px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Choose a plan that works for you. No subscriptions, pay only for what you need.
            </p>
            <Button size="lg" asChild>
              <Link href="/pricing">View Pricing Plans</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
