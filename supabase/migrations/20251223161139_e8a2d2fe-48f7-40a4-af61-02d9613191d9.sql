-- Create storage bucket for antique images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('antique-images', 'antique-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Allow authenticated users to upload images
CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'antique-images' 
  AND auth.role() = 'authenticated'
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated admins to update images
CREATE POLICY "Admins can update images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'antique-images' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow authenticated admins to delete images
CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'antique-images' 
  AND public.has_role(auth.uid(), 'admin')
);

-- Allow public read access to images
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'antique-images');