-- Per-category public visibility switch for blog posts.
-- A category with no row here (or public = true) stays visible; flip
-- public to false to hide every post in that category from anon view.
create table "public"."category_visibility" (
	"category" text primary key,
	"public" boolean not null default true
);

alter table "public"."category_visibility" enable row level security;

create policy "Allow public read access" on "public"."category_visibility" for
select
	using (true);

create policy "Allow authenticated users to manage category_visibility" on "public"."category_visibility" using (("auth"."role" () = 'authenticated'::"text"))
with
	check (("auth"."role" () = 'authenticated'::"text"));

grant all on table "public"."category_visibility" to "anon";
grant all on table "public"."category_visibility" to "authenticated";
grant all on table "public"."category_visibility" to "service_role";

-- Amend the published-posts policy so hidden categories drop out of
-- every anon query (and therefore the public posts list and sidebar).
drop policy "Enable all users to view published posts" on "public"."posts";

create policy "Enable all users to view published posts" on "public"."posts" for
select
	using (
		("published" = true)
		and not exists (
			select
				1
			from
				"public"."category_visibility" "cv"
			where
				"cv"."category" = "posts"."category"
				and "cv"."public" = false
		)
	);

insert into
	"public"."category_visibility" ("category", "public")
values
	('Politics', true),
	('Tech', true),
	('Personal', true);
