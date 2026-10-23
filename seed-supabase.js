const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

let url = process.env.SUPABASE_URL;
let sec = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Load from .env if not in environment
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        let val = trimmed.slice(idx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (key === 'SUPABASE_URL') url = val;
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') sec = val;
      }
    }
  }
} catch (e) {}

if (!url || !sec) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be defined in .env');
  process.exit(1);
}

const client = createClient(url, sec);

// Bcrypt hash for 'password123' (cost 10)
const defaultHash = '$2b$10$K3PGwi8OoB1XuhmRVs7un.lbK07zNwAw1iOzsvl/igmTwx1nvogPC';

const accounts = [
  {
    id: '246470316116',
    email: 'ysukhadia49@gmail.com',
    name: 'Yug Sukhadia',
    role: 'STUDENT',
    department: 'Information Technology',
    phone: '+91 98251 00000',
    password_hash: defaultHash
  },
  {
    id: '246470316113',
    email: 'student@tapi.edu',
    name: 'Parshva Shah',
    role: 'STUDENT',
    department: 'Information Technology',
    phone: '+91 98251 44321',
    password_hash: defaultHash
  },
  {
    id: 'FAC-IT-042',
    email: 'faculty@tapi.edu',
    name: 'Prof. S. R. Patel',
    role: 'FACULTY',
    department: 'Information Technology',
    phone: '+91 94280 12345',
    password_hash: defaultHash
  },
  {
    id: 'ADM-HQ-001',
    email: 'admin@tapi.edu',
    name: 'Dr. A. K. Joshi',
    role: 'ADMIN',
    department: 'Central Administration',
    phone: '+91 98241 99887',
    password_hash: defaultHash
  },
  {
    id: 'STN-OP-004',
    email: 'stationery@tapi.edu',
    name: 'Ramesh Bhai Patel',
    role: 'STATIONERY_OPERATOR',
    department: 'Campus Support Services',
    phone: '+91 97230 65432',
    password_hash: defaultHash
  }
];

async function seed() {
  await client.from('users').delete().eq('email', 'attacker@tapi.edu');
  const { data, error } = await client.from('users').upsert(accounts, { onConflict: 'email' }).select();
  if (error) {
    console.error('Seed error:', error.message);
  } else {
    console.log('Successfully seeded', data.length, 'accounts with valid bcrypt hashes into Supabase.');
  }
}

seed();
