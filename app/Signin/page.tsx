"use client"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "../../utils/client"
import { Button } from "@/components/ui/button"
import { LoaderCircle, Github } from "lucide-react"

export default function SignInPage() {
   const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
   const [errorMessage, setErrorMessage] = useState<string | null>(null)
   const supabase = createClient()
   const searchParams = useSearchParams()
   const next = searchParams.get("next")

   useEffect(() => {
     // Check for an existing session on component mount
     async function checkSession() {
       const { data: { session } } = await supabase.auth.getSession()
       
       if (session) {
         console.log("Existing session found:", session)
         const userId = session.user?.id
         
         if (userId) {
           localStorage.setItem("user_id", userId)
           console.log("User ID stored:", userId)
         }
       }
     }

     checkSession()
   }, [])

   async function signInWithGoogle() {
     setIsGoogleLoading(true)
     setErrorMessage(null)

     try {
       const { data, error } = await supabase.auth.signInWithOAuth({
         provider: "google",
         options: {
           redirectTo: `${window.location.origin}/auth/callback${
             next ? `?next=${encodeURIComponent(next)}` : ""
           }`,
         },
       })

       if (error) {
         console.error("OAuth Sign-in Error:", error)
         throw error
       }
     } catch (error) {
       console.error("Sign-in Catch Block Error:", error)
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