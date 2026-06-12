import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase env vars missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

(async () => {
  const testUid = 'test-uid-' + Math.random().toString(36).substring(2, 10);
  console.log('Using UID:', testUid);

  // 1. Insert a new profile
  const { data: insertData, error: insertError } = await supabase
    .from('users')
    .insert([
      {
        uid: testUid,
        username: 'TestUser',
        points: 0,
        streak: 0,
        total_attempts: 0,
        referrals: 0,
        daily_entries: 0,
        accuracy: 0,
        last_active: new Date().toISOString(),
        referral_code: 'TEST' + Math.floor(Math.random() * 1000),
      },
    ])
    .select()
    .single();

  if (insertError) {
    console.error('Insert error:', insertError.message);
    return;
  }
  console.log('Inserted profile:', insertData);

  // 2. Update points and attempts
  const updates = { points: 10, total_attempts: 2, accuracy: 50 };
  const { data: updateData, error: updateError } = await supabase
    .from('users')
    .update(updates)
    .eq('uid', testUid)
    .select()
    .single();

  if (updateError) {
    console.error('Update error:', updateError.message);
    return;
  }
  console.log('Updated profile:', updateData);

  // 3. Fetch back to verify
  const { data: fetchData, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('uid', testUid)
    .single();

  if (fetchError) {
    console.error('Fetch error:', fetchError.message);
    return;
  }
  console.log('Fetched final profile:', fetchData);
})();
