import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const TABLES = {
  users: 'users',
  testServices: 'testServices',
  servicePrices: 'servicePrices',
  testBookings: 'testBookings',
  testKits: 'testKits',
  testSamples: 'testSamples',
  testResults: 'testResults',
  payments: 'payments',
  blogs: 'blogs',
  tags: 'tags',
  blogTags: 'blogTags',
  feedback: 'feedback',
  sampleInstructions: 'sampleInstructions',
  logistics: 'logistics',
  otpCodes: 'otpCodes',
} as const;
