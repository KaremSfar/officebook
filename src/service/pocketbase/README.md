# PocketBase Setup

This folder replaces the Supabase setup with PocketBase.

## Structure
- `pb_migrations/`: Contains the JavaScript migrations to initialize the schema.
- `pb_data/`: (Created on run) Contains the SQLite database and uploaded files.

## How to run

1. Download the PocketBase executable for your OS from [pocketbase.io](https://pocketbase.io/docs/terminologies/#executable).
2. Place the `pocketbase` executable in this directory.
3. Run the server:
   ```bash
   ./pocketbase serve
   ```
4. Access the Admin UI at: [http://127.0.0.1:8090/_/](http://127.0.0.1:8090/_/)

## Schema Mapping
- Supabase `profiles` -> PocketBase `users` (system collection)
- Supabase `attendance` -> PocketBase `attendance` (base collection)
- Supabase `avatars` bucket -> PocketBase `users.avatar` field (built-in file support)
