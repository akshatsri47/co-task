"use client"
 
import { useRouter } from "next/navigation"
 
import { createClient } from "../../utils/client"
import { Button } from "@/components/ui/button"
 
export function SignOutButton() {
  const supabase = createClient()
  const router = useRouter()
 
  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/signin")
    router.refresh()
  }
 
  return (
    <Button className="w-full" onClick={handleLogout}>
      Sign out
    </Button>
  )
}