import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../utils/client";


export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      // Parse the JSON body containing fields to update (e.g., title, streak)
      const updatedData = await req.json();
      
      // Create Supabase client
      const supabase = createClient();
      
      // Update the habit record with the provided data where id equals habitId
      const { data, error } = await supabase
        .from("habit")
        .update(updatedData)
        .eq("id", params.id)
        .single();
        
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      
      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      console.error("PATCH habit error:", error);
      return NextResponse.json(
        { error: "Failed to update habit" },
        { status: 500 }
      );
    }
  }
  
  // DELETE: Delete a habit record
  export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      // Create Supabase client
      const supabase = createClient();
      
      // Delete the habit record where id equals habitId
      const { data, error } = await supabase
        .from("habit")
        .delete()
        .eq("id", params.id)
        .single();
        
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      
      return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
      console.error("DELETE habit error:", error);
      return NextResponse.json(
        { error: "Failed to delete habit" },
        { status: 500 }
      );
    }
  }