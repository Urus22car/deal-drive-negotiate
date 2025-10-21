import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendOTPRequest {
  phone: string;
  otp?: string;
}

interface VerifyOTPRequest {
  sessionId: string;
  otp: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('TWOFACTOR_API_KEY');
    if (!apiKey) {
      throw new Error('2Factor API key not configured');
    }

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (action === 'send') {
      const { phone, otp }: SendOTPRequest = await req.json();
      
      // Generate 6-digit OTP if not provided
      const generatedOTP = otp || Math.floor(100000 + Math.random() * 900000).toString();
      
      // Send OTP via 2Factor.in
      const response = await fetch(
        `https://2factor.in/API/V1/${apiKey}/SMS/${phone}/${generatedOTP}/AUTHMSG`,
        { method: 'GET' }
      );

      const data = await response.json();
      console.log('2Factor send response:', data);

      if (data.Status === 'Success') {
        return new Response(
          JSON.stringify({ 
            success: true, 
            sessionId: data.Details,
            message: 'OTP sent successfully' 
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } else {
        throw new Error(data.Details || 'Failed to send OTP');
      }
    } 
    
    else if (action === 'verify') {
      const { sessionId, otp }: VerifyOTPRequest = await req.json();
      
      // Verify OTP via 2Factor.in
      const response = await fetch(
        `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${sessionId}/${otp}`,
        { method: 'GET' }
      );

      const data = await response.json();
      console.log('2Factor verify response:', data);

      if (data.Status === 'Success' && data.Details === 'OTP Matched') {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'OTP verified successfully' 
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } else {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Invalid OTP' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use ?action=send or ?action=verify' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: any) {
    console.error('Error in send-otp function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

serve(handler);
