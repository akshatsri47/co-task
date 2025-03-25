import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../utils/client"; // Adjust the path as needed

// GET: Fetch tasks by user_id
export async function GET(req: NextRequest) {
  try {
    // Create Supabase client
    const supabase = createClient();
    
    // Get the user ID from query parameters
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    // If no user_id is provided, return an error
    if (!user_id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    // Fetch tasks for this user
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// POST: Create a new task
export async function POST(req: NextRequest) {
    try {
      // Parse the JSON body
      const body = await req.json();
      const { title, iscomplete, user_id } = body;
  
      // Log the incoming request data for debugging
      console.log("POST /api/task request body:", body);
  
      // Validate required fields (title and user_id)
      if (!title || !user_id) {
        console.error("Missing 'title' or 'user_id' in request body");
        return NextResponse.json(
          { error: "Title and user_id are required" },
          { status: 400 }
        );
      }
  
      // Create Supabase client
      const supabase = createClient();
      
      // Insert a new task record
      const { data, error } = await supabase
        .from("tasks")
        .insert([
          { 
            title, 
            iscompleted: typeof iscomplete === "boolean" ? iscomplete : false,
            user_id 
          }
        ]);
  
      // Log the results from Supabase
      console.log("Supabase insert result:", { data, error });
  
      // If Supabase returned an error, log and return a 400
      if (error) {
        console.error("Supabase insert error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      
      // Return success response
      return NextResponse.json({ data }, { status: 201 });
  
    } catch (error: any) {
      // Log any unexpected errors
      console.error("POST /api/task catch error:", error);
      return NextResponse.json(
        { error: `Failed to create task: ${error.message || error}` },
        { status: 500 }
      );
    }
  }
