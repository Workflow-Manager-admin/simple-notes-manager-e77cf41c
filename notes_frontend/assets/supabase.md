# Supabase Integration for Simple Notes Frontend

This React frontend uses Supabase (https://supabase.com/) for all note CRUD operations.

## Environment Variables

- `REACT_APP_SUPABASE_URL` — The Supabase project URL.
- `REACT_APP_SUPABASE_KEY` — The Supabase anon public API key.

These MUST be set in your `.env` file for both `start` and `build` to run correctly.

## Usage

The application expects a single table called `notes` defined as:

| Column     | Type           | Required | Notes                   |
|------------|----------------|----------|-------------------------|
| id         | uuid           | Yes      | Primary key, auto-gen   |
| title      | text           | No       | Note title              |
| content    | text           | No       | Note body content       |
| updated_at | timestamptz    | Yes      | Last updated timestamp  |

- The Supabase client is initialized using `supabaseClient.js` in the src folder.
- All CRUD calls use the `notes` table.

## Security

The frontend expects Row-Level Security (RLS) to be set according to your needs (open for demo/testing, or restricted for auth users).

## Changing Tables:

To change the structure, update your Supabase project and update queries accordingly.

---
For more guidance, see [Supabase Docs](https://supabase.com/docs/guides/with-react).
