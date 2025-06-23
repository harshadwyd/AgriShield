export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');
  
  if (!userId) {
    return new Response(JSON.stringify({ error: 'User ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { supabase } = await import('../lib/supabase');
    
    // Get user's detections
    const { data: detections, error } = await supabase
      .from('detections')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      detections,
      count: detections?.length || 0 
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch detections',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}