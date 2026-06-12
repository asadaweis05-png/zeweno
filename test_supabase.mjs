import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase env vars missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Authenticate ----------------------------------------------------------
const testEmail = process.env.TEST_EMAIL;
const testPassword = process.env.TEST_PASSWORD;
if (!testEmail || !testPassword) {
  console.error('Test credentials missing in .env');
  process.exit(1);
}

(async () => {
  // Try sign‑up (ignore "already exists" error)
  await supabase.auth.signUp({ email: testEmail, password: testPassword });
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });
  if (signInError) {
    console.error('Sign‑in error:', signInError.message);
    process.exit(1);
  }
  const user = signInData.user;
  console.log('🔐 Authenticated as UID:', user.id);

  // ---------------------------------------------------
  // The rest of the script now runs inside this async block.


  // ---- Insert & test logic below ----
  // Using the authenticated UID (user.id) for all operations

  // 1️⃣ Insert a new profile
  const { data: insertData, error: insertError } = await supabase
    .from('users')
    .insert([
      {
        uid: user.id,
        username: 'TestUser',
        points: 0,
        streak: 0,
        total_attempts: 0,
        referrals: 0,
        daily_entries: 0,
        accuracy: 0,
        last_active: new Date().toISOString(),
        referral_code: 'TMP' + Math.floor(Math.random() * 1000),
      },
    ])
    .select()
    .single();

  if (insertError) {
    console.error('❌ Insert error:', insertError.message);
    return;
  }
  console.log('✅ Inserted profile:', insertData);

  // 2️⃣ Update some fields
  const updates = { points: 42, total_attempts: 7, accuracy: 85 };
  const { data: updateData, error: updateError } = await supabase
    .from('users')
    .update(updates)
    .eq('uid', user.id)
    .select()
    .single();

  if (updateError) {
    console.error('❌ Update error:', updateError.message);
    return;
  }
  console.log('✅ Updated profile:', updateData);

  // 3️⃣ Fetch to verify
  const { data: fetchData, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('uid', user.id)
    .single();

  if (fetchError) {
    console.error('❌ Fetch error:', fetchError.message);
    return;
  }
  console.log('✅ Fetched final profile:', fetchData);

  // Simple validation
  const isValid =
    fetchData.points === updates.points &&
    fetchData.total_attempts === updates.total_attempts &&
    fetchData.accuracy === updates.accuracy;
  console.log('✅ Validation result:', isValid ? 'PASS' : 'FAIL');

  // 4️⃣ Clean up – delete test row
  const { error: deleteError } = await supabase.from('users').delete().eq('uid', user.id);
  if (deleteError) {
    console.error('⚠️ Cleanup delete error:', deleteError.message);
  } else {
    console.log('🧹 Cleaned up test profile');
  }
})(); // end of auth wrapper
