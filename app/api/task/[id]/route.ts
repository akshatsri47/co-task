import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../utils/client"; // Adjust path as needed

// PATCH: Update a task (title, iscomplete, etc.)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Parse the JSON body for fields to update
    const updatedFields = await req.json();

    // Create Supabase client
    const supabase = createClient();

    // Update the task record
    const { data, error } = await supabase
      .from("tasks")
      .update(updatedFields)
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a task
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Create Supabase client
    const supabase = createClient();

    // Delete the task record
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
