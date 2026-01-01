import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_PHONE = 3; // Max 3 OTP requests per phone per minute
const MAX_REQUESTS_PER_IP = 10; // Max 10 OTP requests per IP per minute

function getRateLimitKey(phone: string, ip: string): { phoneKey: string; ipKey: string } {
  return {
    phoneKey: `phone_${phone}`,
    ipKey: `ip_${ip}`,
  };
}

function checkRateLimit(key: string, maxRequests: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

function validatePhoneNumber(phone: string): boolean {
  // International phone number format: optional + followed by 10-15 digits
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
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

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('cf-connecting-ip') || 
                     'unknown';

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (action === 'send') {
      const { phone, otp }: SendOTPRequest = await req.json();
      
      // Validate phone number format
      if (!phone || !validatePhoneNumber(phone)) {
        console.log('Invalid phone number format:', phone);
        return new Response(
          JSON.stringify({ error: 'Invalid phone number format. Use international format (e.g., +919876543210)' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const cleanPhone = phone.replace(/\s/g, '');
      const { phoneKey, ipKey } = getRateLimitKey(cleanPhone, clientIP);

      // Check rate limits
      const phoneRateLimit = checkRateLimit(phoneKey, MAX_REQUESTS_PER_PHONE);
      if (!phoneRateLimit.allowed) {
        console.log('Rate limit exceeded for phone:', cleanPhone);
        return new Response(
          JSON.stringify({ 
            error: 'Too many OTP requests. Please wait 1 minute before trying again.',
            retryAfter: 60 
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const ipRateLimit = checkRateLimit(ipKey, MAX_REQUESTS_PER_IP);
      if (!ipRateLimit.allowed) {
        console.log('Rate limit exceeded for IP:', clientIP);
        return new Response(
          JSON.stringify({ 
            error: 'Too many requests from this device. Please wait 1 minute before trying again.',
            retryAfter: 60 
          }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate 6-digit OTP if not provided
      const generatedOTP = otp || Math.floor(100000 + Math.random() * 900000).toString();
      
      console.log(`Sending OTP to ${cleanPhone.substring(0, 6)}*** (IP: ${clientIP.substring(0, 8)}***)`);
      
      // Send OTP via 2Factor.in
      const response = await fetch(
        `https://2factor.in/API/V1/${apiKey}/SMS/${cleanPhone}/${generatedOTP}/AUTHMSG`,
        { method: 'GET' }
      );

      const data = await response.json();
      console.log('2Factor send response status:', data.Status);

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
      
      // Basic input validation
      if (!sessionId || typeof sessionId !== 'string' || sessionId.length > 100) {
        return new Response(
          JSON.stringify({ error: 'Invalid session ID' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!otp || !/^\d{6}$/.test(otp)) {
        return new Response(
          JSON.stringify({ error: 'Invalid OTP format. Must be 6 digits.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify OTP via 2Factor.in
      const response = await fetch(
        `https://2factor.in/API/V1/${apiKey}/SMS/VERIFY/${sessionId}/${otp}`,
        { method: 'GET' }
      );

      const data = await response.json();
      console.log('2Factor verify response status:', data.Status);

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
    console.error('Error in send-otp function:', error.message);
    return new Response(
      JSON.stringify({ error: 'An error occurred. Please try again.' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};

serve(handler);
