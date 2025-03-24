"use client"
 
import { useUser } from "@/hooks/use-user"
 
export default function ClientPage() {
  const { loading, error, user } = useUser()
 
  return (
    <div className="space-y-4">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <>
          <h1 className="text-lg font-medium">User: {user?.email || "N/A"}</h1>
          
        </>
      )}
      <p className="text-muted-foreground">(I am a client component.)</p>
    </div>
  )
}