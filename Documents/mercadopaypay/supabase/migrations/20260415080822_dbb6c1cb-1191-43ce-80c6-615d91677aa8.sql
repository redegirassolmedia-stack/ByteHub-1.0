-- Replace the broad SELECT policy with a more restrictive one
DROP POLICY "Listing images are publicly accessible" ON storage.objects;
CREATE POLICY "Listing images accessible by path" ON storage.objects FOR SELECT USING (bucket_id = 'listings');