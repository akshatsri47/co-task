import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../utils/client";

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body
    const { title, streak } = await req.json();
    
    // Create Supabase client
    const supabase = createClient();
    
    // Insert data into Supabase
    const { data, error } = await supabase
      .from('habit')
      .insert([{ title, streak }]);
      
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
      
      // Fetch all habits
      const { data, error } = await supabase
        .from('habit')
        .select('*');
      
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