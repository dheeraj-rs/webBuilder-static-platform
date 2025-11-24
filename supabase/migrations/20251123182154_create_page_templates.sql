/*
  # Create Page Templates and Snippets Tables

  1. New Tables
    - `page_templates`
      - `id` (uuid, primary key)
      - `page_type` (text) - home, about, services, contact
      - `template_name` (text) - descriptive name of the template
      - `html_snippet` (text) - HTML code
      - `css_snippet` (text) - CSS code
      - `js_snippet` (text) - JavaScript code
      - `description` (text) - explains purpose and integration
      - `created_at` (timestamp)
    
    - `user_selections`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - references auth.users
      - `page_type` (text)
      - `template_id` (uuid) - references page_templates
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on both tables
    - Public read access for page_templates
    - Authenticated users can manage their own selections
  
  3. Sample Data
    - Insert starter templates for home, about, services, and contact pages
*/

CREATE TABLE IF NOT EXISTS page_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text NOT NULL,
  template_name text NOT NULL,
  html_snippet text NOT NULL,
  css_snippet text NOT NULL DEFAULT '',
  js_snippet text NOT NULL DEFAULT '',
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  page_type text NOT NULL,
  template_id uuid REFERENCES page_templates(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, page_type)
);

ALTER TABLE page_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_selections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view page templates"
  ON page_templates FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can view own selections"
  ON user_selections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own selections"
  ON user_selections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own selections"
  ON user_selections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own selections"
  ON user_selections FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

INSERT INTO page_templates (page_type, template_name, html_snippet, css_snippet, js_snippet, description) VALUES
('home', 'Modern Hero', 
'<div class="hero-section">
  <nav class="navbar">
    <div class="logo">YourBrand</div>
    <ul class="nav-links">
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>
  <div class="hero-content">
    <h1>Welcome to Our Amazing Platform</h1>
    <p>Build beautiful websites with ease</p>
    <button class="cta-button">Get Started</button>
  </div>
</div>',
'.hero-section { min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.navbar { display: flex; justify-content: space-between; padding: 2rem; align-items: center; }
.logo { font-size: 1.5rem; font-weight: bold; }
.nav-links { display: flex; list-style: none; gap: 2rem; }
.nav-links a { color: white; text-decoration: none; transition: opacity 0.3s; }
.nav-links a:hover { opacity: 0.8; }
.hero-content { text-align: center; padding: 8rem 2rem; }
.hero-content h1 { font-size: 3rem; margin-bottom: 1rem; }
.hero-content p { font-size: 1.5rem; margin-bottom: 2rem; opacity: 0.9; }
.cta-button { padding: 1rem 2rem; font-size: 1.1rem; background: white; color: #667eea; border: none; border-radius: 50px; cursor: pointer; transition: transform 0.3s; }
.cta-button:hover { transform: scale(1.05); }',
'document.querySelector(".cta-button").addEventListener("click", function() { alert("Welcome! Let''s get started."); });',
'A modern hero section with gradient background, navigation bar, and call-to-action button. Integration: Place at the top of your home page for maximum impact.'),

('home', 'Minimalist Landing',
'<div class="minimal-hero">
  <header class="minimal-nav">
    <span class="brand">MINIMAL</span>
    <nav class="nav-menu">
      <a href="#home">Home</a>
      <a href="#about">About</a>
      <a href="#services">Services</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>
  <main class="minimal-content">
    <h1 class="minimal-title">Simple. Clean. Effective.</h1>
    <p class="minimal-subtitle">Your journey starts here</p>
    <div class="minimal-actions">
      <button class="btn-primary">Explore</button>
      <button class="btn-secondary">Learn More</button>
    </div>
  </main>
</div>',
'.minimal-hero { min-height: 100vh; background: #ffffff; color: #1a1a1a; padding: 2rem; }
.minimal-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6rem; }
.brand { font-size: 1.8rem; font-weight: 300; letter-spacing: 0.2em; }
.nav-menu { display: flex; gap: 2.5rem; }
.nav-menu a { color: #1a1a1a; text-decoration: none; font-weight: 300; transition: opacity 0.3s; }
.nav-menu a:hover { opacity: 0.6; }
.minimal-content { text-align: center; max-width: 800px; margin: 0 auto; padding: 4rem 2rem; }
.minimal-title { font-size: 4rem; font-weight: 200; margin-bottom: 1rem; line-height: 1.2; }
.minimal-subtitle { font-size: 1.3rem; color: #666; margin-bottom: 3rem; font-weight: 300; }
.minimal-actions { display: flex; gap: 1rem; justify-content: center; }
.btn-primary, .btn-secondary { padding: 1rem 2.5rem; font-size: 1rem; border: 2px solid #1a1a1a; cursor: pointer; transition: all 0.3s; font-weight: 400; }
.btn-primary { background: #1a1a1a; color: white; }
.btn-primary:hover { background: transparent; color: #1a1a1a; }
.btn-secondary { background: transparent; color: #1a1a1a; }
.btn-secondary:hover { background: #1a1a1a; color: white; }',
'console.log("Minimalist design loaded");',
'A clean, minimalist landing page with focus on typography and whitespace. Integration: Perfect for professional portfolios or product showcases.'),

('about', 'Team Showcase',
'<div class="about-section">
  <div class="about-header">
    <h2>About Our Team</h2>
    <p>Meet the people making it happen</p>
  </div>
  <div class="team-grid">
    <div class="team-member">
      <div class="member-avatar">JD</div>
      <h3>John Doe</h3>
      <p class="role">CEO & Founder</p>
      <p class="bio">Passionate about innovation and technology</p>
    </div>
    <div class="team-member">
      <div class="member-avatar">JS</div>
      <h3>Jane Smith</h3>
      <p class="role">Lead Designer</p>
      <p class="bio">Creating beautiful user experiences</p>
    </div>
    <div class="team-member">
      <div class="member-avatar">MB</div>
      <h3>Mike Brown</h3>
      <p class="role">Tech Lead</p>
      <p class="bio">Building scalable solutions</p>
    </div>
  </div>
</div>',
'.about-section { padding: 4rem 2rem; background: #f8f9fa; min-height: 100vh; }
.about-header { text-align: center; margin-bottom: 4rem; }
.about-header h2 { font-size: 2.5rem; margin-bottom: 1rem; color: #2c3e50; }
.about-header p { font-size: 1.2rem; color: #7f8c8d; }
.team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
.team-member { background: white; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s; }
.team-member:hover { transform: translateY(-5px); }
.member-avatar { width: 100px; height: 100px; margin: 0 auto 1rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; font-weight: bold; }
.team-member h3 { font-size: 1.5rem; margin-bottom: 0.5rem; color: #2c3e50; }
.role { color: #667eea; font-weight: 600; margin-bottom: 1rem; }
.bio { color: #7f8c8d; line-height: 1.6; }',
'document.querySelectorAll(".team-member").forEach(member => { member.addEventListener("click", () => { member.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)"; setTimeout(() => { member.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)"; }, 300); }); });',
'Team showcase with avatar placeholders and grid layout. Integration: Use in about page to highlight your team members with expandable profiles.'),

('about', 'Company Story',
'<div class="story-section">
  <div class="story-container">
    <div class="story-content">
      <span class="story-tag">Our Story</span>
      <h2>Building the Future Together</h2>
      <p class="story-text">Founded in 2020, we set out with a simple mission: to make technology accessible to everyone. What started as a small team of passionate developers has grown into a thriving community of innovators.</p>
      <div class="story-stats">
        <div class="stat">
          <div class="stat-number">50K+</div>
          <div class="stat-label">Happy Users</div>
        </div>
        <div class="stat">
          <div class="stat-number">100+</div>
          <div class="stat-label">Projects</div>
        </div>
        <div class="stat">
          <div class="stat-number">24/7</div>
          <div class="stat-label">Support</div>
        </div>
      </div>
    </div>
    <div class="story-visual">
      <div class="visual-placeholder">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="#667eea" opacity="0.2"/>
          <circle cx="100" cy="100" r="50" fill="#764ba2" opacity="0.4"/>
          <circle cx="100" cy="100" r="25" fill="#667eea"/>
        </svg>
      </div>
    </div>
  </div>
</div>',
'.story-section { padding: 6rem 2rem; background: white; min-height: 100vh; }
.story-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.story-tag { display: inline-block; padding: 0.5rem 1rem; background: #f0f4ff; color: #667eea; border-radius: 20px; font-size: 0.9rem; font-weight: 600; margin-bottom: 1rem; }
.story-content h2 { font-size: 2.8rem; margin-bottom: 1.5rem; color: #2c3e50; line-height: 1.2; }
.story-text { font-size: 1.1rem; color: #5a6c7d; line-height: 1.8; margin-bottom: 3rem; }
.story-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.stat { text-align: center; }
.stat-number { font-size: 2.5rem; font-weight: bold; color: #667eea; margin-bottom: 0.5rem; }
.stat-label { color: #7f8c8d; font-size: 0.9rem; }
.story-visual { display: flex; justify-content: center; align-items: center; }
.visual-placeholder { width: 100%; max-width: 400px; }
.visual-placeholder svg { width: 100%; height: auto; }
@media (max-width: 768px) { .story-container { grid-template-columns: 1fr; } }',
'const statNumbers = document.querySelectorAll(".stat-number"); statNumbers.forEach(stat => { const finalNumber = stat.textContent; stat.textContent = "0"; let current = 0; const increment = parseInt(finalNumber) / 50; const timer = setInterval(() => { current += increment; if (current >= parseInt(finalNumber)) { stat.textContent = finalNumber; clearInterval(timer); } else { stat.textContent = Math.floor(current) + (finalNumber.includes("+") ? "+" : ""); } }, 30); });',
'Company story section with animated statistics and visual elements. Integration: Place in about page to share your company journey and achievements.'),

('services', 'Service Cards',
'<div class="services-section">
  <div class="services-header">
    <h2>Our Services</h2>
    <p>Everything you need to succeed</p>
  </div>
  <div class="services-grid">
    <div class="service-card" data-service="design">
      <div class="service-icon">🎨</div>
      <h3>Web Design</h3>
      <p>Beautiful, responsive designs that capture your brand essence</p>
      <ul class="service-features">
        <li>Custom layouts</li>
        <li>Mobile-first approach</li>
        <li>Brand integration</li>
      </ul>
      <button class="service-btn">Learn More</button>
    </div>
    <div class="service-card" data-service="development">
      <div class="service-icon">💻</div>
      <h3>Development</h3>
      <p>Robust, scalable solutions built with modern technologies</p>
      <ul class="service-features">
        <li>Full-stack development</li>
        <li>API integration</li>
        <li>Performance optimization</li>
      </ul>
      <button class="service-btn">Learn More</button>
    </div>
    <div class="service-card" data-service="marketing">
      <div class="service-icon">📈</div>
      <h3>Digital Marketing</h3>
      <p>Grow your audience and boost conversions</p>
      <ul class="service-features">
        <li>SEO optimization</li>
        <li>Content strategy</li>
        <li>Analytics tracking</li>
      </ul>
      <button class="service-btn">Learn More</button>
    </div>
  </div>
</div>',
'.services-section { padding: 4rem 2rem; background: #ffffff; min-height: 100vh; }
.services-header { text-align: center; margin-bottom: 4rem; }
.services-header h2 { font-size: 2.5rem; margin-bottom: 1rem; color: #2c3e50; }
.services-header p { font-size: 1.2rem; color: #7f8c8d; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
.service-card { background: white; padding: 2.5rem; border-radius: 16px; border: 2px solid #e9ecef; transition: all 0.3s; }
.service-card:hover { border-color: #667eea; transform: translateY(-8px); box-shadow: 0 12px 24px rgba(102, 126, 234, 0.15); }
.service-icon { font-size: 3rem; margin-bottom: 1.5rem; }
.service-card h3 { font-size: 1.8rem; margin-bottom: 1rem; color: #2c3e50; }
.service-card > p { color: #5a6c7d; line-height: 1.6; margin-bottom: 1.5rem; }
.service-features { list-style: none; padding: 0; margin: 1.5rem 0; }
.service-features li { padding: 0.5rem 0; color: #5a6c7d; position: relative; padding-left: 1.5rem; }
.service-features li:before { content: "✓"; position: absolute; left: 0; color: #667eea; font-weight: bold; }
.service-btn { width: 100%; padding: 1rem; background: #667eea; color: white; border: none; border-radius: 8px; font-size: 1rem; cursor: pointer; transition: background 0.3s; }
.service-btn:hover { background: #5568d3; }',
'document.querySelectorAll(".service-btn").forEach(btn => { btn.addEventListener("click", function(e) { const card = e.target.closest(".service-card"); const service = card.getAttribute("data-service"); alert("Learn more about our " + service + " services!"); }); });',
'Service cards with hover effects and feature lists. Integration: Use in services page to showcase your offerings with interactive cards.'),

('services', 'Pricing Tables',
'<div class="pricing-section">
  <div class="pricing-header">
    <h2>Choose Your Plan</h2>
    <p>Flexible pricing for every need</p>
  </div>
  <div class="pricing-grid">
    <div class="pricing-card">
      <div class="plan-name">Starter</div>
      <div class="plan-price"><span class="currency">$</span>29<span class="period">/mo</span></div>
      <ul class="plan-features">
        <li>5 Projects</li>
        <li>10GB Storage</li>
        <li>Email Support</li>
        <li>Basic Analytics</li>
      </ul>
      <button class="plan-button">Get Started</button>
    </div>
    <div class="pricing-card featured">
      <div class="plan-badge">Most Popular</div>
      <div class="plan-name">Professional</div>
      <div class="plan-price"><span class="currency">$</span>79<span class="period">/mo</span></div>
      <ul class="plan-features">
        <li>Unlimited Projects</li>
        <li>100GB Storage</li>
        <li>Priority Support</li>
        <li>Advanced Analytics</li>
        <li>Custom Domain</li>
      </ul>
      <button class="plan-button">Get Started</button>
    </div>
    <div class="pricing-card">
      <div class="plan-name">Enterprise</div>
      <div class="plan-price"><span class="currency">$</span>199<span class="period">/mo</span></div>
      <ul class="plan-features">
        <li>Unlimited Everything</li>
        <li>1TB Storage</li>
        <li>24/7 Phone Support</li>
        <li>Custom Analytics</li>
        <li>Dedicated Manager</li>
      </ul>
      <button class="plan-button">Contact Sales</button>
    </div>
  </div>
</div>',
'.pricing-section { padding: 4rem 2rem; background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%); min-height: 100vh; }
.pricing-header { text-align: center; margin-bottom: 4rem; }
.pricing-header h2 { font-size: 2.5rem; margin-bottom: 1rem; color: #2c3e50; }
.pricing-header p { font-size: 1.2rem; color: #7f8c8d; }
.pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; max-width: 1200px; margin: 0 auto; }
.pricing-card { background: white; padding: 2.5rem; border-radius: 16px; border: 2px solid #e9ecef; text-align: center; position: relative; transition: transform 0.3s; }
.pricing-card:hover { transform: scale(1.05); }
.pricing-card.featured { border-color: #667eea; box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2); }
.plan-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: #667eea; color: white; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
.plan-name { font-size: 1.5rem; font-weight: 600; color: #2c3e50; margin-bottom: 1rem; }
.plan-price { font-size: 3rem; font-weight: bold; color: #667eea; margin-bottom: 2rem; }
.currency { font-size: 1.5rem; vertical-align: super; }
.period { font-size: 1.2rem; color: #7f8c8d; font-weight: normal; }
.plan-features { list-style: none; padding: 0; margin: 2rem 0; }
.plan-features li { padding: 0.75rem 0; color: #5a6c7d; border-bottom: 1px solid #f0f0f0; }
.plan-features li:last-child { border-bottom: none; }
.plan-button { width: 100%; padding: 1rem; background: #667eea; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.3s; }
.plan-button:hover { background: #5568d3; }
.featured .plan-button { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }',
'document.querySelectorAll(".plan-button").forEach(btn => { btn.addEventListener("click", function(e) { const card = e.target.closest(".pricing-card"); const planName = card.querySelector(".plan-name").textContent; alert("Selected plan: " + planName); }); });',
'Pricing table with featured plan highlight and hover animations. Integration: Use in services page to display pricing tiers with clear feature comparisons.'),

('contact', 'Contact Form',
'<div class="contact-section">
  <div class="contact-container">
    <div class="contact-info">
      <h2>Get in Touch</h2>
      <p class="contact-intro">Have a question or want to work together? We''d love to hear from you.</p>
      <div class="contact-details">
        <div class="detail-item">
          <div class="detail-icon">📧</div>
          <div>
            <div class="detail-label">Email</div>
            <div class="detail-value">hello@company.com</div>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-icon">📞</div>
          <div>
            <div class="detail-label">Phone</div>
            <div class="detail-value">+1 (555) 123-4567</div>
          </div>
        </div>
        <div class="detail-item">
          <div class="detail-icon">📍</div>
          <div>
            <div class="detail-label">Office</div>
            <div class="detail-value">123 Business St, Suite 100</div>
          </div>
        </div>
      </div>
    </div>
    <div class="contact-form-wrapper">
      <form class="contact-form" id="contactForm">
        <div class="form-group">
          <label>Name</label>
          <input type="text" name="name" required placeholder="Your name">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" required placeholder="your@email.com">
        </div>
        <div class="form-group">
          <label>Subject</label>
          <input type="text" name="subject" required placeholder="How can we help?">
        </div>
        <div class="form-group">
          <label>Message</label>
          <textarea name="message" required rows="5" placeholder="Tell us more..."></textarea>
        </div>
        <button type="submit" class="submit-btn">Send Message</button>
      </form>
    </div>
  </div>
</div>',
'.contact-section { padding: 4rem 2rem; background: #f8f9fa; min-height: 100vh; }
.contact-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.5fr; gap: 4rem; }
.contact-info h2 { font-size: 2.5rem; margin-bottom: 1rem; color: #2c3e50; }
.contact-intro { font-size: 1.1rem; color: #5a6c7d; line-height: 1.6; margin-bottom: 3rem; }
.contact-details { display: flex; flex-direction: column; gap: 2rem; }
.detail-item { display: flex; gap: 1rem; align-items: flex-start; }
.detail-icon { font-size: 2rem; }
.detail-label { font-size: 0.9rem; color: #7f8c8d; margin-bottom: 0.25rem; }
.detail-value { font-size: 1.1rem; color: #2c3e50; font-weight: 500; }
.contact-form-wrapper { background: white; padding: 2.5rem; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
.form-group { margin-bottom: 1.5rem; }
.form-group label { display: block; margin-bottom: 0.5rem; color: #2c3e50; font-weight: 500; }
.form-group input, .form-group textarea { width: 100%; padding: 0.875rem; border: 2px solid #e9ecef; border-radius: 8px; font-size: 1rem; transition: border-color 0.3s; }
.form-group input:focus, .form-group textarea:focus { outline: none; border-color: #667eea; }
.submit-btn { width: 100%; padding: 1rem; background: #667eea; color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.3s; }
.submit-btn:hover { background: #5568d3; }
@media (max-width: 768px) { .contact-container { grid-template-columns: 1fr; } }',
'document.getElementById("contactForm").addEventListener("submit", function(e) { e.preventDefault(); const formData = new FormData(e.target); const data = Object.fromEntries(formData); alert("Thanks for reaching out, " + data.name + "! We''ll get back to you soon."); e.target.reset(); });',
'Contact form with contact information sidebar and form validation. Integration: Use in contact page to collect inquiries with proper field validation.'),

('contact', 'Location Map',
'<div class="map-section">
  <div class="map-header">
    <h2>Visit Us</h2>
    <p>Find us at our office or drop us a message</p>
  </div>
  <div class="map-container">
    <div class="map-placeholder">
      <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="#e9ecef"/>
        <circle cx="200" cy="150" r="40" fill="#667eea"/>
        <path d="M200 120 L200 150 L180 170" stroke="white" stroke-width="3" fill="none"/>
        <text x="200" y="220" text-anchor="middle" fill="#2c3e50" font-size="16" font-weight="bold">Our Office</text>
        <text x="200" y="240" text-anchor="middle" fill="#7f8c8d" font-size="12">123 Business Street</text>
      </svg>
    </div>
    <div class="location-info">
      <div class="info-card">
        <h3>Office Hours</h3>
        <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
        <p>Saturday: 10:00 AM - 4:00 PM</p>
        <p>Sunday: Closed</p>
      </div>
      <div class="info-card">
        <h3>Get Directions</h3>
        <p>We''re located in the heart of downtown, easily accessible by public transport.</p>
        <button class="directions-btn">Open in Maps</button>
      </div>
      <div class="info-card">
        <h3>Parking</h3>
        <p>Free parking available in the building garage. Visitor spots on Level 2.</p>
      </div>
    </div>
  </div>
</div>',
'.map-section { padding: 4rem 2rem; background: white; min-height: 100vh; }
.map-header { text-align: center; margin-bottom: 3rem; }
.map-header h2 { font-size: 2.5rem; margin-bottom: 1rem; color: #2c3e50; }
.map-header p { font-size: 1.2rem; color: #7f8c8d; }
.map-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; }
.map-placeholder { background: #f8f9fa; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.map-placeholder svg { width: 100%; height: auto; display: block; }
.location-info { display: flex; flex-direction: column; gap: 1.5rem; }
.info-card { background: #f8f9fa; padding: 1.5rem; border-radius: 12px; border-left: 4px solid #667eea; }
.info-card h3 { font-size: 1.3rem; margin-bottom: 1rem; color: #2c3e50; }
.info-card p { color: #5a6c7d; line-height: 1.6; margin-bottom: 0.5rem; }
.directions-btn { margin-top: 1rem; padding: 0.75rem 1.5rem; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; transition: background 0.3s; }
.directions-btn:hover { background: #5568d3; }
@media (max-width: 768px) { .map-container { grid-template-columns: 1fr; } }',
'document.querySelector(".directions-btn").addEventListener("click", function() { window.open("https://maps.google.com", "_blank"); });',
'Location map section with office hours and parking information. Integration: Use in contact page to help visitors find your physical location.');
