-- Insert sample projects
INSERT INTO projects (title, description, long_description, technologies, github_url, live_url, featured, order_index) VALUES
('E-Commerce API', 'Scalable REST API for e-commerce platform with microservices architecture', 'Built a comprehensive e-commerce API using Node.js and Express, featuring user authentication, product management, order processing, and payment integration. Implemented microservices architecture with Docker containers and deployed on AWS with auto-scaling capabilities.', ARRAY['Node.js', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'AWS'], 'https://github.com/devjoseh/ecommerce-api', NULL, true, 1),
('Real-time Chat System', 'WebSocket-based chat application with Redis pub/sub', 'Developed a real-time messaging system supporting multiple chat rooms, private messaging, and file sharing. Used Socket.io for WebSocket connections, Redis for pub/sub messaging, and MongoDB for message persistence. Supports 10k+ concurrent users.', ARRAY['Node.js', 'Socket.io', 'Redis', 'MongoDB', 'React'], 'https://github.com/devjoseh/chat-system', 'https://chat.devjoseh.dev', true, 2),
('Data Analytics Pipeline', 'ETL pipeline processing millions of records daily', 'Created a robust data processing pipeline using Python and Apache Airflow. Processes customer behavior data from multiple sources, transforms it using Pandas and NumPy, and loads it into a data warehouse. Includes automated reporting and anomaly detection.', ARRAY['Python', 'Apache Airflow', 'PostgreSQL', 'Pandas', 'Docker'], 'https://github.com/devjoseh/analytics-pipeline', NULL, true, 3),
('Authentication Service', 'OAuth2 and JWT-based authentication microservice', 'Built a secure authentication service supporting OAuth2, JWT tokens, and multi-factor authentication. Includes rate limiting, session management, and integration with popular social providers. Used by multiple client applications.', ARRAY['Node.js', 'JWT', 'OAuth2', 'PostgreSQL', 'Redis'], 'https://github.com/devjoseh/auth-service', NULL, false, 4);

-- Insert skills
INSERT INTO skills (name, category, proficiency, icon_name) VALUES
('Node.js', 'Backend', 95, 'nodejs'),
('Python', 'Backend', 90, 'python'),
('PostgreSQL', 'Database', 88, 'postgresql'),
('MongoDB', 'Database', 85, 'mongodb'),
('Redis', 'Database', 82, 'redis'),
('Docker', 'DevOps', 87, 'docker'),
('AWS', 'Cloud', 83, 'aws'),
('Kubernetes', 'DevOps', 78, 'kubernetes'),
('GraphQL', 'API', 80, 'graphql'),
('REST APIs', 'API', 92, 'api'),
('Microservices', 'Architecture', 85, 'microservices'),
('Git', 'Tools', 90, 'git');

-- Insert experience data
INSERT INTO experiences (company, position, description, start_date, end_date, is_current, location, technologies, image_url) VALUES
('TechCorp Solutions', 'Senior Backend Developer', 'Led development of scalable microservices architecture serving 1M+ users. Designed and implemented RESTful APIs, optimized database queries reducing response time by 40%, and mentored junior developers. Collaborated with DevOps team to implement CI/CD pipelines and containerization strategies.', '2022-03-01', NULL, true, 'Remote', ARRAY['Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Kubernetes'], '/placeholder.svg?height=80&width=80'),
('StartupXYZ', 'Backend Developer', 'Developed core backend services for a fintech startup. Built secure payment processing systems, implemented real-time notifications, and created comprehensive API documentation. Worked in an agile environment with rapid iteration cycles.', '2020-06-01', '2022-02-28', false, 'San Francisco, CA', ARRAY['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery'], '/placeholder.svg?height=80&width=80'),
('DataFlow Inc', 'Junior Backend Developer', 'Started career building data processing pipelines and ETL systems. Gained experience with large-scale data handling, database optimization, and automated testing. Contributed to open-source projects and participated in code reviews.', '2019-01-01', '2020-05-31', false, 'Austin, TX', ARRAY['Python', 'Apache Airflow', 'MongoDB', 'Docker'], '/placeholder.svg?height=80&width=80');

-- Insert default profile settings
INSERT INTO profile_settings (profile_name, profile_bio, background_type, background_value) 
VALUES ('DevJoseH', 'Desenvolvedor Backend | Criador de Soluções Escaláveis', 'gradient', 'from-purple-900 via-gray-900 to-purple-900')
ON CONFLICT DO NOTHING;

-- Insert sample links
INSERT INTO links (title, url, description, icon_name, background_color, order_index) VALUES
('Portfolio Principal', 'https://devjoseh.dev', 'Conheça meus projetos e experiência', 'globe', '#8b5cf6', 1),
('GitHub', 'https://github.com/devjoseh', 'Veja meus repositórios e código', 'github', '#333333', 2),
('LinkedIn', 'https://linkedin.com/in/devjoseh', 'Conecte-se comigo profissionalmente', 'linkedin', '#0077b5', 3),
('YouTube', 'https://youtube.com/@devjoseh', 'Tutoriais e conteúdo sobre programação', 'youtube', '#ff0000', 4),
('Instagram', 'https://instagram.com/devjoseh', 'Acompanhe minha jornada', 'instagram', '#e4405f', 5),
('EducaAvalia', 'https://educaavalia.com', 'Meu projeto de avaliação escolar inclusiva', 'graduation-cap', '#10b981', 6),
('Email', 'mailto:contato@devjoseh.dev', 'Entre em contato direto', 'mail', '#6366f1', 7),
('Calendly', 'https://calendly.com/devjoseh', 'Agende uma conversa comigo', 'calendar', '#006bff', 8);

-- Insert sample hackathons
INSERT INTO hackathons (title, date, placement, placement_type, description, photos, order_index) VALUES
('NASA Space Apps Challenge 2024', 'Outubro 2024', '1º Lugar', 'winner', 
'Participei do NASA Space Apps Challenge 2024, uma competição global que desafia participantes a resolver problemas reais usando dados da NASA. Nossa equipe desenvolveu uma solução inovadora para monitoramento de mudanças climáticas usando dados de satélite.',
'[{"id": "1", "url": "/placeholder.svg?height=400&width=600", "alt": "Equipe trabalhando no projeto"}, {"id": "2", "url": "/placeholder.svg?height=400&width=600", "alt": "Apresentação da solução"}]', 1),
('Hackathon FIAP 2024', 'Setembro 2024', 'Finalista', 'finalist',
'No Hackathon FIAP 2024, nossa equipe desenvolveu uma plataforma de educação inclusiva que utiliza IA para adaptar conteúdo educacional para diferentes necessidades de aprendizagem.',
'[{"id": "1", "url": "/placeholder.svg?height=400&width=600", "alt": "Desenvolvimento da plataforma"}, {"id": "2", "url": "/placeholder.svg?height=400&width=600", "alt": "Pitch para os jurados"}]', 2),
('Mega Hack 5.0', 'Julho 2024', 'Top 10', 'participant',
'Participei do Mega Hack 5.0, um dos maiores hackathons do Brasil, com foco em soluções para o futuro do trabalho. Nossa equipe criou uma plataforma de matching entre freelancers e empresas.',
'[{"id": "1", "url": "/placeholder.svg?height=400&width=600", "alt": "Brainstorming da equipe"}, {"id": "2", "url": "/placeholder.svg?height=400&width=600", "alt": "Desenvolvimento do MVP"}]', 3);