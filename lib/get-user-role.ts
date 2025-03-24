import "server-only"

import { createClient } from "../utils/server"

export async function getUser() {
  // Create a Supabase client for server-side operations
  const supabase = createClient()

  // Retrieve the current session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Return the user information if a session exists, otherwise null
  return session ? session.user : null
}