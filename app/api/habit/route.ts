import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../utils/client";

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body
    const { title, streak, user_id } = await req.json();
    
    // Create Supabase client
    const supabase = createClient();
    
    // Insert data into Supabase with user_id
    const { data, error } = await supabase
      .from('habit')
      .insert([{ 
        title, 
        streak, 
        user_id  // Add user_id to the insert
      }]);
      
    // Handle error case
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
    
    // Return success response
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Create Supabase client
    const supabase = createClient();
    
    // Get the user ID from query parameters
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');

    // If no user_id is provided, return an error
    if (!user_id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    // Fetch habits for specific user
    const { data, error } = await supabase
      .from('habit')
      .select('*')
      .eq('user_id', user_id);  // Filter habits by user_id
    
    // Handle error case
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
    
    // Return success response
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch habits" }, { status: 500 });
  }
}
