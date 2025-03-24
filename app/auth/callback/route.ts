import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: Request) {
  // Extract search parameters and origin from the request URL
  const { searchParams, origin } = new URL(request.url)
  
  // Get the authorization code and the 'next' redirect path
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"
  
  if (!code) {
    return NextResponse.redirect(`${origin}/signin?error=no_code`)
  }
  
  // Create a response that we can modify
  const response = NextResponse.redirect(`${origin}${next}`)
  
  // Create a Supabase client specifically for this request/response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.headers.get('cookie')?.split('; ').find(
            (c) => c.startsWith(`${name}=`)
          )?.split('=')[1]
        },
        set(name, value, options) {
          // This is needed for the auth code exchange to work properly
          response.headers.append('Set-Cookie', 
            `${name}=${value}; Path=/; ${options.httpOnly ? "HttpOnly;" : ""} ${options.secure ? "Secure;" : ""} ${options.sameSite ? `SameSite=${options.sameSite};` : ""}`
          )
        },
        remove(name) {
          response.headers.append('Set-Cookie', `${name}=; Max-Age=0; Path=/;`)
        },
      },
    }
  )
  
  try {
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(error.message)}`)
    }
    
    // Return the modified response with the session cookies
    return response
  } catch (error: any) {
    return NextResponse.redirect(`${origin}/signin?error=${encodeURIComponent(error.message)}`)
  }
}