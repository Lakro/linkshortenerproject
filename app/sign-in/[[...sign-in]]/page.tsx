import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <SignIn 
        appearance={{
          baseTheme: dark,
          variables: {
            colorPrimary: "hsl(var(--primary))",
            colorBackground: "hsl(var(--background))",
            colorInputBackground: "hsl(var(--input))",
            colorInputText: "hsl(var(--foreground))",
            colorText: "hsl(var(--foreground))",
            colorTextSecondary: "hsl(var(--muted-foreground))",
            borderRadius: "var(--radius)",
          },
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl border border-border bg-card"
          }
        }}
      />
    </div>
  )
}
