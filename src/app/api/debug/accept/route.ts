import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { requestId } = body;

    console.log(`[DEBUG] Testing accept for request: ${requestId}`);
    console.log(`[DEBUG] Current user: ${user.id}`);

    // Step 1: Get request
    const { data: request, error: requestError } = await supabase
      .from('project_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (requestError) {
      return NextResponse.json({ 
        step: "fetch_request", 
        error: requestError.message,
        code: requestError.code 
      }, { status: 500 });
    }

    console.log(`[DEBUG] Request found:`, request);

    // Step 2: Test workspace insert (dry run - will fail but shows error)
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert({
        request_id: request.id,
        client_id: request.client_id,
        freelancer_id: request.freelancer_id,
        name: request.form_data?.project_name || 'New Project',
        project_type: request.form_data?.project_type,
        status: 'active',
        pipeline_stage: 'In Progress',
        form_data: request.form_data
      })
      .select()
      .single();

    if (workspaceError) {
      return NextResponse.json({ 
        step: "create_workspace", 
        error: workspaceError.message,
        code: workspaceError.code,
        hint: workspaceError.hint,
        details: workspaceError.details
      }, { status: 500 });
    }

    console.log(`[DEBUG] Workspace created:`, workspace.id);

    // Step 3: Update request
    const { error: updateError } = await supabase
      .from('project_requests')
      .update({ 
        status: 'accepted',
        responded_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (updateError) {
      return NextResponse.json({ 
        step: "update_request", 
        error: updateError.message 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      workspaceId: workspace.id,
      message: "Request accepted successfully!"
    });

  } catch (error: any) {
    console.error("[DEBUG] Unexpected error:", error);
    return NextResponse.json({ 
      step: "unknown", 
      error: error.message || "Unknown error" 
    }, { status: 500 });
  }
}
