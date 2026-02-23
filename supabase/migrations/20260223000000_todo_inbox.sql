create table if not exists
	"public"."todo_inbox" (
		"id" "uuid" default "gen_random_uuid" () not null,
		"user_id" "uuid" default "auth"."uid" () not null,
		"raw_text" "text" not null,
		"source" "text" not null default 'typed',
		"created_at" timestamp with time zone default "now" () not null,
		constraint "todo_inbox_pkey" primary key ("id"),
		constraint "todo_inbox_user_id_fkey" foreign key ("user_id") references "auth"."users" ("id")
	);

alter table "public"."todo_inbox" enable row level security;

create policy "Users can manage their own inbox items"
	on "public"."todo_inbox"
	using ("auth"."uid" () = "user_id")
	with check ("auth"."uid" () = "user_id");
