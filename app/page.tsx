import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { SignUpButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Link2, BarChart3, Shield, Zap } from 'lucide-react'

export default async function Home() {
  const { userId } = await auth()
  
  // If user is logged in, redirect to dashboard
  if (userId) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <section className="flex flex-1 items-center justify-center px-4 py-12 md:py-20">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Fast, Secure, and Reliable</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Shorten Links.
            <br />
            <span className="text-primary">Track Everything.</span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Create short, memorable links in seconds. Track clicks, manage your URLs, and get insights—all in one powerful platform.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <SignUpButton mode="modal">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started for Free
              </Button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/50 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <div className="mb-4 text-5xl">🔗</div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Everything you need to manage links
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Powerful features designed to make link management simple and effective.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1: Quick Link Shortening */}
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Quick Link Shortening</CardTitle>
                <CardDescription>
                  Transform long URLs into short, shareable links instantly with just a few clicks.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2: Analytics & Tracking */}
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Analytics & Tracking</CardTitle>
                <CardDescription>
                  Track clicks, monitor performance, and gain valuable insights into how your links are performing.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3: Secure & Reliable */}
            <Card>
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Your links are protected with enterprise-grade security and backed by reliable infrastructure.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl">
          <Card className="border-2 shadow-lg">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-3xl font-bold tracking-tight md:text-4xl">
                Ready to get started?
              </CardTitle>
              <CardDescription className="text-lg mt-4">
                Join thousands of users who trust our platform to manage their links.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8">
              <SignUpButton mode="modal">
                <Button size="lg">
                  Create Your Account
                </Button>
              </SignUpButton>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
