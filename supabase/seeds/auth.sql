set
	session_replication_role = replica;

--
-- PostgreSQL database dump
--
-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.6
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

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
insert into
	"auth"."users" (
		"instance_id",
		"id",
		"aud",
		"role",
		"email",
		"encrypted_password",
		"email_confirmed_at",
		"invited_at",
		"confirmation_token",
		"confirmation_sent_at",
		"recovery_token",
		"recovery_sent_at",
		"email_change_token_new",
		"email_change",
		"email_change_sent_at",
		"last_sign_in_at",
		"raw_app_meta_data",
		"raw_user_meta_data",
		"is_super_admin",
		"created_at",
		"updated_at",
		"phone",
		"phone_confirmed_at",
		"phone_change",
		"phone_change_token",
		"phone_change_sent_at",
		"email_change_token_current",
		"email_change_confirm_status",
		"banned_until",
		"reauthentication_token",
		"reauthentication_sent_at",
		"is_sso_user",
		"deleted_at",
		"is_anonymous"
	)
values
	(
		'00000000-0000-0000-0000-000000000000',
		'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e',
		'authenticated',
		'authenticated',
		'michael.snook@gmail.com',
		'$2a$10$ssa4ZMhy5PpGkoXwFNQcWOXxRSY9/gSZc3OS1M.BCXbBljlgpmHsa',
		'2021-10-03 18:47:43.491207+00',
		null,
		'',
		null,
		'',
		'2021-10-13 16:58:27.947718+00',
		'',
		'',
		null,
		'2025-08-17 19:24:07.289477+00',
		'{"provider": "email"}',
		'null',
		false,
		'2021-10-03 18:47:43.48567+00',
		'2025-08-20 16:22:38.376527+00',
		null,
		null,
		'',
		'',
		null,
		'',
		0,
		null,
		'',
		null,
		false,
		null,
		false
	);

--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
insert into
	"auth"."identities" (
		"provider_id",
		"user_id",
		"identity_data",
		"provider",
		"last_sign_in_at",
		"created_at",
		"updated_at",
		"id"
	)
values
	(
		'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e',
		'ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e',
		'{"sub": "ce73a8ab-9a4e-4ff6-a290-24b3c3c4c04e", "email": "michael.snook@gmail.com"}',
		'email',
		'2022-11-25 00:00:00+00',
		'2022-11-25 00:00:00+00',
		'2022-11-25 00:00:00+00',
		'80f9e132-4916-4adf-8256-1ebe59b7c843'
	);

--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--
--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--
select
	pg_catalog.setval ('"auth"."refresh_tokens_id_seq"', 828, true);

--
-- PostgreSQL database dump complete
--
reset all;