"use client"
 
import { useState } from "react"
import { useSearchParams } from "next/navigation"
 
import { createClient } from "../../utils/client"
import { Button } from "@/components/ui/button"
import { LoaderCircle, LogIn, LogOut, LucideProps, Github } from "lucide-react"
 
export default function SignInPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const supabase = createClient()
 
  const searchParams = useSearchParams()
 
  const next = searchParams.get("next")
 
  async function signInWithGoogle() {
    setIsGoogleLoading(true)
    setErrorMessage(null)
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback${
            next ? `?next=${encodeURIComponent(next)}` : ""
          }`,
        },
      })
 
      if (error) {
        throw error
      }
    } catch (error) {
      setErrorMessage("There was an error logging in with Google. Please try again.")
      setIsGoogleLoading(false)
    }
  }
 
  return (
    <div>
      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-500">
          {errorMessage}
        </div>
      )}
      
      <Button
        type="button"
        variant="outline"
        onClick={signInWithGoogle}
        disabled={isGoogleLoading}
      >
      {isGoogleLoading ? (
  <LoaderCircle className="mr-2 size-4 animate-spin" />
) : (
  <Github className="mr-2 size-6" />
)}{" "}
Sign in with Google
      </Button>
    </div>
  )
}