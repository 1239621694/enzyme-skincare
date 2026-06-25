-- RLS Policies for Enzyme Skincare
-- Run these in Supabase SQL Editor after migration

-- Products: public read, admin write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products public read" ON products FOR SELECT USING (true);
CREATE POLICY "Products admin write" ON products FOR ALL USING (auth.role() = 'service_role');

-- Blog: public read
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blog public read" ON blog_posts FOR SELECT USING (is_published = true);

-- Case Studies: public read
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Cases public read" ON case_studies FOR SELECT USING (true);

-- Reviews: public read approved, authenticated insert
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews public read" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Reviews authenticated insert" ON reviews FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Contact Messages: authenticated insert only
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contact insert" ON contact_messages FOR INSERT WITH CHECK (true);

-- Consultations: authenticated insert
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Consultation insert" ON consultations FOR INSERT WITH CHECK (true);

-- Subscribers: authenticated insert
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subscriber insert" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Subscriber unique" ON subscribers FOR SELECT USING (auth.role() = 'service_role');

-- Orders: authenticated read own
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders read own" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Orders admin" ON orders FOR ALL USING (auth.role() = 'service_role');

-- Order Items: inherit from orders
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order items read own" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);