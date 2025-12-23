-- Add position column for drag-and-drop sorting
ALTER TABLE public.antiques ADD COLUMN position INTEGER DEFAULT 0;

-- Set initial positions based on creation date
WITH numbered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as row_num
  FROM public.antiques
)
UPDATE public.antiques 
SET position = numbered.row_num 
FROM numbered 
WHERE antiques.id = numbered.id;

-- Create index for faster sorting
CREATE INDEX idx_antiques_position ON public.antiques(position);