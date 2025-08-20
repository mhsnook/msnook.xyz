set
	statement_timeout = 0;

set
	lock_timeout = 0;

set
	idle_in_transaction_session_timeout = 0;

set
	client_encoding = 'UTF8';

set
	standard_conforming_strings = on;

select
	pg_catalog.set_config ('search_path', '', false);

set
	check_function_bodies = false;

set
	xmloption = content;

set
	client_min_messages = warning;

set
	row_security = off;

alter schema "public" owner to "postgres";

comment on schema "public" is 'standard public schema';

create extension if not exists "moddatetime"
with
	schema "extensions";

create extension if not exists "pg_stat_statements"
with
	schema "extensions";

create extension if not exists "pgcrypto"
with
	schema "extensions";

create extension if not exists "pgjwt"
with
	schema "extensions";

create extension if not exists "uuid-ossp"
with
	schema "extensions";

create
or replace function "public"."handle_updated_at" () returns "trigger" language "plpgsql" as $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

alter function "public"."handle_updated_at" () owner to "postgres";

set
	default_tablespace = '';

set
	default_table_access_method = "heap";

create table if not exists
	"public"."media" (
		"id" "uuid" default "extensions"."uuid_generate_v4" () not null,
		"bucket" character varying,
		"filename" character varying not null,
		"url" character varying,
		"alt_text" "text",
		"height" integer,
		"width" integer,
		"file_size_kb" integer,
		"file_modified_at" timestamp with time zone,
		"created_at" timestamp with time zone default "now" (),
		"updated_at" timestamp with time zone default "now" ()
	);

alter table "public"."media" owner to "postgres";

create table if not exists
	"public"."media_meta" (
		"id" "uuid" default "gen_random_uuid" () not null,
		"path" "text" not null,
		"description" "text",
		"tags" "text" [],
		"center_box" "jsonb",
		"created_at" timestamp with time zone default "now" () not null,
		"updated_at" timestamp with time zone
	);

alter table "public"."media_meta" owner to "postgres";

comment on table "public"."media_meta" is 'Metadata for files in the images storage bucket.';

comment on column "public"."media_meta"."path" is 'The full path to the file in the storage bucket.';

comment on column "public"."media_meta"."center_box" is 'Relative coordinates for the focal point of the image: {x, y, width, height}.';

create table if not exists
	"public"."posts" (
		"content" "text",
		"created_at" timestamp with time zone default "now" (),
		"excerpt" "text",
		"image" character varying,
		"published" boolean default false not null,
		"slug" character varying default "extensions"."uuid_generate_v4" () not null,
		"title" "text",
		"updated_at" timestamp with time zone,
		"id" "uuid" default "extensions"."uuid_generate_v4" () not null,
		"author_id" "uuid" default "auth"."uid" () not null,
		"published_at" "date"
	);

alter table "public"."posts" owner to "postgres";

alter table only "public"."media_meta"
add constraint "media_meta_path_key" unique ("path");

alter table only "public"."media_meta"
add constraint "media_meta_pkey" primary key ("id");

alter table only "public"."media"
add constraint "media_pkey" primary key ("id");

alter table only "public"."media"
add constraint "media_url_key" unique ("url");

alter table only "public"."posts"
add constraint "posts_pkey1" primary key ("id");

alter table only "public"."posts"
add constraint "posts_slug_key" unique ("slug");

create
or replace trigger "handle_updated_at" before
update on "public"."posts" for each row
execute function "extensions"."moddatetime" ('updated_at');

create
or replace trigger "on_media_meta_updated" before
update on "public"."media_meta" for each row
execute function "public"."handle_updated_at" ();

alter table only "public"."posts"
add constraint "posts_author_id_fkey" foreign key ("author_id") references "auth"."users" ("id");

create policy "Allow authenticated users to manage media_meta" on "public"."media_meta" using (("auth"."role" () = 'authenticated'::"text"))
with
	check (("auth"."role" () = 'authenticated'::"text"));

create policy "Allow public read access" on "public"."media_meta" for
select
	using (true);

create policy "Enable all actions for user with matching author_id" on "public"."posts" using (("auth"."uid" () = "author_id"))
with
	check (("auth"."uid" () = "author_id"));

create policy "Enable all users to view published posts" on "public"."posts" for
select
	using (("published" = true));

create policy "Enable drafts access to all logged in users" on "public"."posts" for
select
	using (("auth"."role" () = 'authenticated'::"text"));

create policy "Enable insert for authenticated users only" on "public"."posts" for insert
with
	check (("auth"."role" () = 'authenticated'::"text"));

alter table "public"."media" enable row level security;

alter table "public"."media_meta" enable row level security;

alter table "public"."posts" enable row level security;

alter publication "supabase_realtime" owner to "postgres";

revoke USAGE on schema "public"
from
	PUBLIC;

grant all on schema "public" to PUBLIC;

grant USAGE on schema "public" to "anon";

grant USAGE on schema "public" to "authenticated";

grant USAGE on schema "public" to "service_role";

grant all on function "public"."handle_updated_at" () to "anon";

grant all on function "public"."handle_updated_at" () to "authenticated";

grant all on function "public"."handle_updated_at" () to "service_role";

grant all on table "public"."media" to "anon";

grant all on table "public"."media" to "authenticated";

grant all on table "public"."media" to "service_role";

grant all on table "public"."media_meta" to "anon";

grant all on table "public"."media_meta" to "authenticated";

grant all on table "public"."media_meta" to "service_role";

grant all on table "public"."posts" to "anon";

grant all on table "public"."posts" to "authenticated";

grant all on table "public"."posts" to "service_role";

alter default privileges for role "postgres" in schema "public"
grant all on sequences to "postgres";

alter default privileges for role "postgres" in schema "public"
grant all on sequences to "anon";

alter default privileges for role "postgres" in schema "public"
grant all on sequences to "authenticated";

alter default privileges for role "postgres" in schema "public"
grant all on sequences to "service_role";

alter default privileges for role "postgres" in schema "public"
grant all on functions to "postgres";

alter default privileges for role "postgres" in schema "public"
grant all on functions to "anon";

alter default privileges for role "postgres" in schema "public"
grant all on functions to "authenticated";

alter default privileges for role "postgres" in schema "public"
grant all on functions to "service_role";

alter default privileges for role "postgres" in schema "public"
grant all on tables to "postgres";

alter default privileges for role "postgres" in schema "public"
grant all on tables to "anon";

alter default privileges for role "postgres" in schema "public"
grant all on tables to "authenticated";

alter default privileges for role "postgres" in schema "public"
grant all on tables to "service_role";

reset all;