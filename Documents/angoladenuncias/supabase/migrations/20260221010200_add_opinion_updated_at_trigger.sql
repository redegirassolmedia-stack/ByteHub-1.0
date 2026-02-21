-- Add missing updated_at trigger for opinion_articles
CREATE TRIGGER update_opinion_articles_updated_at
  BEFORE UPDATE ON public.opinion_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
