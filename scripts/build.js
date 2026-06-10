/**
 * Injects SUPABASE_URL and SUPABASE_ANON_KEY into index.template.html
 * and writes the result to index.html.
 *
 * Local dev: reads from .env via dotenv
 * GitHub Actions: reads from repository secrets set as env vars
 */
const fs   = require('fs');
const path = require('path');

try { require('dotenv').config(); } catch(e) { /* CI — vars already in env */ }

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('\nERROR: SUPABASE_URL and SUPABASE_ANON_KEY must be set.');
  console.error('  Local: copy .env.example -> .env and fill in your values.');
  console.error('  CI:    add them as GitHub repository secrets.\n');
  process.exit(1);
}

const src  = path.join(__dirname, '..', 'index.template.html');
const dest = path.join(__dirname, '..', 'index.html');
let html   = fs.readFileSync(src, 'utf8');
html = html.replace('%%SUPABASE_URL%%', url).replace('%%SUPABASE_ANON_KEY%%', key);
fs.writeFileSync(dest, html, 'utf8');
console.log('index.html built successfully.');