
  create policy "Authenticated users access to insert and update 1ffg0oo_0"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'images'::text));



  create policy "Authenticated users access to insert and update 1ffg0oo_1"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'images'::text));



  create policy "Authenticated users access to insert and update 1ffg0oo_2"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'images'::text));



  create policy "Give anon users access to images in folder 1ffg0oo_0"
  on "storage"."objects"
  as permissive
  for select
  to anon
using ((bucket_id = 'images'::text));



