create table if not exists "public"."projects" (
	"id" "uuid" default "extensions"."uuid_generate_v4" () not null,
	"title" "text" not null,
	"description" "text",
	"url" "text",
	"image" character varying,
	"github" "text",
	"tags" "text" [],
	"sort_order" integer default 0 not null,
	"published" boolean default true not null,
	"created_at" timestamp with time zone default "now" () not null,
	"updated_at" timestamp with time zone default "now" ()
);

alter table "public"."projects" owner to "postgres";

alter table only "public"."projects"
add constraint "projects_pkey" primary key ("id");

create or replace trigger "handle_projects_updated_at" before
update on "public"."projects" for each row
execute function "extensions"."moddatetime" ('updated_at');

-- Public read access (no auth required)
alter table "public"."projects" enable row level security;

create policy "Allow public read access" on "public"."projects" for
select
	using (true);

create policy "Allow authenticated users to manage projects" on "public"."projects" using (("auth"."role" () = 'authenticated'::"text"))
with
	check (("auth"."role" () = 'authenticated'::"text"));

grant all on table "public"."projects" to "anon";

grant all on table "public"."projects" to "authenticated";

grant all on table "public"."projects" to "service_role";
