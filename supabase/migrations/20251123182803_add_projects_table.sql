/*
  # Add User Projects Management Table

  1. New Tables
    - `user_projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - references auth.users
      - `name` (text) - project name
      - `description` (text) - project description
      - `home_template_id` (uuid) - selected home page template
      - `about_template_id` (uuid) - selected about page template
      - `services_template_id` (uuid) - selected services page template
      - `contact_template_id` (uuid) - selected contact page template
      - `home_custom_html` (text) - customized HTML
      - `home_custom_css` (text) - customized CSS
      - `home_custom_js` (text) - customized JS
      - Similar custom fields for other pages
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on user_projects
    - Users can only access their own projects
    - Users can create, read, update, delete their own projects
  
  3. Indexes
    - Index on user_id for faster queries
*/

CREATE TABLE IF NOT EXISTS user_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  
  home_template_id uuid REFERENCES page_templates(id),
  about_template_id uuid REFERENCES page_templates(id),
  services_template_id uuid REFERENCES page_templates(id),
  contact_template_id uuid REFERENCES page_templates(id),
  
  home_custom_html text DEFAULT '',
  home_custom_css text DEFAULT '',
  home_custom_js text DEFAULT '',
  
  about_custom_html text DEFAULT '',
  about_custom_css text DEFAULT '',
  about_custom_js text DEFAULT '',
  
  services_custom_html text DEFAULT '',
  services_custom_css text DEFAULT '',
  services_custom_js text DEFAULT '',
  
  contact_custom_html text DEFAULT '',
  contact_custom_css text DEFAULT '',
  contact_custom_js text DEFAULT '',
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_projects_user_id ON user_projects(user_id);

ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON user_projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects"
  ON user_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON user_projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON user_projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
