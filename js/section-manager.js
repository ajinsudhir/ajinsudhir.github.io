// Section Manager Module
export class SectionManager {
    constructor(configManager) {
        this.configManager = configManager;
    }

    // Toggle section visibility based on feature flags
    toggleSection(sectionClass, isEnabled) {
        const section = document.querySelector(`.${sectionClass}`);
        if (section) {
            if (isEnabled) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        }
    }

    // Update page content from config with feature flags
    updatePageContent(config) {
        // Ensure features object exists with defaults
        const features = {
            about: true,
            projects: true,
            experience: true,
            skills: true,
            github_projects: true,
            blog: true,
            performance_modelling: true,
            navigation_links: true,
            ...config.features
        };
        
        // Handle sections based on feature flags
        this.toggleSection('about', features.about);
        this.toggleSection('projects', features.projects);
        this.toggleSection('experience', features.experience);
        this.toggleSection('skills', features.skills);
        this.toggleSection('projects-on-github', features.github_projects);
        this.toggleSection('navigation-links', features.navigation_links);
        this.toggleSection('blog', features.blog);
        this.toggleSection('performance-modelling', features.performance_modelling);
        
        // Update sections that are enabled and have content
        if (features.about) {
            this.updateAboutSection(config);
        }
        
        if (features.projects) {
            this.updateProjectsSection(config);
        }
        if (features.navigation_links) {
            this.updateNavigationLinksSection(config);
        }
        
        if (features.experience) {
            this.updateExperienceSection(config);
        }
        
        if (features.skills) {
            this.updateSkillsSection(config);
        }
        
        if (features.blog) {
            this.updateBlogSection(config);
        }
        if (features.performance_modelling) {
            this.updatePerformanceSection(config);
        }
        
        // Update "Projects on GitHub" section title from config if available
        if (features.github_projects && config.github_projects?.title) {
            const githubProjectsTitle = document.querySelector('.projects-on-github h2');
            if (githubProjectsTitle) {
                githubProjectsTitle.textContent = config.github_projects.title;
            }
        }
    }

    // Update about section
    updateAboutSection(config) {
        const aboutSection = document.querySelector('.about');
        if (config.about?.paragraphs?.length) {
            aboutSection.innerHTML = config.about.paragraphs.map(p => `<p>${p}</p>`).join('');
        } else {
            aboutSection.innerHTML = '<p>Welcome to my portfolio!</p>';
        }
    }

    // Update projects section dynamically
    updateProjectsSection(config) {
        const projectsSection = document.querySelector('.projects');
        const titleElement = projectsSection.querySelector('h2');
        
        if (titleElement) {
            titleElement.textContent = this.configManager.getSectionTitle('projects');
        }
        
        // Clear existing project items
        const existingProjectItems = projectsSection.querySelectorAll('.project-item');
        existingProjectItems.forEach(item => item.remove());
        
        // Create document fragment
        const fragment = document.createDocumentFragment();
        
        // Add all project items to fragment
        if (config.projects?.items?.length) {
            config.projects.items.forEach(project => {
                const projectItem = this.createProjectItem(project);
                fragment.appendChild(projectItem);
            });
        } else {
            // Show placeholder for empty projects
            const emptyState = document.createElement('div');
            emptyState.className = 'project-item';
            emptyState.innerHTML = `
                <div class="project-content">
                    <h3>Your Projects Will Appear Here</h3>
                    <p class="date">Coming Soon</p>
                    <ul>
                        <li>Add your projects to the config.json file</li>
                        <li>Include project descriptions and images</li>
                        <li>Showcase your best work</li>
                    </ul>
                </div>
            `;
            fragment.appendChild(emptyState);
        }
        
        // Append all projects at once for better performance
        projectsSection.appendChild(fragment);
    }

    // Create individual project item
    createProjectItem(project) {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        
        const descriptionHtml = Array.isArray(project.description) 
            ? project.description.map(desc => `<li>${desc}</li>`).join('')
            : `<li>${project.description}</li>`;
        
        projectItem.innerHTML = `
            <div class="project-header">
                <div class="project-header-content">
                    <h3>${project.name}</h3>
                    ${project.date ? `<p class="date">${project.date}</p>` : ''}
                </div>
                <div class="project-accordion-toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                </div>
            </div>
            <div class="project-content">
                <div class="project-content-desktop">
                    <h3>${project.name}</h3>
                    ${project.date ? `<p class="date">${project.date}</p>` : ''}
                </div>
                <ul>
                    ${descriptionHtml}
                </ul>
                ${project.link ? `
                <div class="project-links">
                    <a href="${typeof project.link === 'object' ? project.link.url : project.link}" target="_blank" rel="noopener noreferrer" aria-label="View ${project.name} project">
                        ${typeof project.link === 'object' ? (project.link.title || 'View Project') : 'View Project'}
                    </a>
                </div>
                ` : ''}
            </div>
            ${project.picture ? `
            <div class="project-image">
                <img src="${project.picture}" alt="${project.name} project screenshot" loading="lazy">
            </div>
            ` : ''}
        `;
        
        // Add click event listener for accordion functionality on mobile
        const header = projectItem.querySelector('.project-header');
        header.addEventListener('click', () => {
            this.toggleProjectAccordion(projectItem);
        });
        
        return projectItem;
    }

    // Update experience section dynamically
    updateExperienceSection(config) {
        const experienceSection = document.querySelector('.experience');
        const titleElement = experienceSection.querySelector('h2');
        
        if (titleElement) {
            titleElement.textContent = this.configManager.getSectionTitle('experience');
        }
        
        // Clear existing experience items
        const existingItems = experienceSection.querySelectorAll('.experience-item');
        existingItems.forEach(item => item.remove());
        
        // Create document fragment
        const fragment = document.createDocumentFragment();
        
        // Add all experience items to fragment
        if (config.experience?.jobs?.length) {
            config.experience.jobs.forEach(job => {
                const experienceItem = this.createExperienceItem(job);
                fragment.appendChild(experienceItem);
            });
        } else {
            // Show placeholder for empty experience
            const emptyState = document.createElement('div');
            emptyState.className = 'experience-item';
            emptyState.innerHTML = `
                <div class="experience-content">
                    <h3>Your Experience Will Appear Here</h3>
                    <p class="date">Ready to showcase your career</p>
                    <ul>
                        <li>Add your work experience to the config.json file</li>
                        <li>Include company logos and job descriptions</li>
                        <li>Highlight your achievements and responsibilities</li>
                    </ul>
                </div>
            `;
            fragment.appendChild(emptyState);
        }
        
        // Append all experience items at once
        experienceSection.appendChild(fragment);
    }

    // Create individual experience item
    createExperienceItem(job) {
        const experienceItem = document.createElement('div');
        experienceItem.className = 'experience-item';
        
        const responsibilitiesHtml = Array.isArray(job.responsibilities)
            ? job.responsibilities.map(resp => `<li>${resp}</li>`).join('')
            : `<li>${job.responsibilities}</li>`;
        
        let logoHtml = '';
        if (job.logo || job.logo_dark) {
            logoHtml = `
                <div class="company-logo">
                    ${job.logo ? `<img src="${job.logo}" alt="${job.company} logo" class="light-mode-logo" loading="lazy">` : ''}
                    ${job.logo_dark ? `<img src="${job.logo_dark}" alt="${job.company} logo" class="dark-mode-logo" loading="lazy">` : ''}
                </div>
            `;
        }
        
        experienceItem.innerHTML = `
            <div class="experience-header">
                <div class="experience-header-content">
                    <h3>${job.company} | ${job.role}</h3>
                    ${job.date ? `<p class="date">${job.date}</p>` : ''}
                </div>
                ${logoHtml}
                <div class="accordion-toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                </div>
            </div>
            <div class="experience-content">
                <ul>
                    ${responsibilitiesHtml}
                </ul>
            </div>
        `;
        
        // Add click event listener for accordion functionality
        const header = experienceItem.querySelector('.experience-header');
        header.addEventListener('click', () => {
            this.toggleExperienceAccordion(experienceItem);
        });
        
        return experienceItem;
    }

    // Toggle experience accordion
    toggleExperienceAccordion(experienceItem) {
        experienceItem.classList.toggle('expanded');
    }

    // Toggle project accordion
    toggleProjectAccordion(projectItem) {
        projectItem.classList.toggle('expanded');
    }

    // Update skills section dynamically
    updateSkillsSection(config) {
        const skillsSection = document.querySelector('.skills');
        const titleElement = skillsSection.querySelector('h2');
        
        if (titleElement) {
            titleElement.textContent = this.configManager.getSectionTitle('skills');
        }
        
        const skillsGrid = skillsSection.querySelector('.skills-grid');
        const fragment = document.createDocumentFragment();
        
        // Clear existing skills
        skillsGrid.innerHTML = '';
        
        // Create skill categories
        if (config.skills?.categories?.length) {
            config.skills.categories.forEach(category => {
                const categoryDiv = this.createSkillCategory(category);
                fragment.appendChild(categoryDiv);
            });
        } else {
            // Show placeholder for empty skills
            const emptyState = document.createElement('div');
            emptyState.className = 'skill-category';
            emptyState.innerHTML = `
                <h3>Your Skills Will Appear Here</h3>
                <ul>
                    <li>Add your technical skills to the config.json file</li>
                    <li>Organize them into categories</li>
                    <li>Include certifications with links</li>
                    <li>Showcase your expertise</li>
                </ul>
            `;
            fragment.appendChild(emptyState);
        }
        
        // Append all skill categories at once
        skillsGrid.appendChild(fragment);
    }

    // Create individual skill category
    createSkillCategory(category) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';
        
        const itemsHtml = Array.isArray(category.items)
            ? category.items.map(item => {
                // Check if item is an object with name and url properties (certification link)
                if (typeof item === 'object' && item.name && item.url) {
                    return `<li><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.name}</a></li>`;
                } else {
                    return `<li>${item}</li>`;
                }
            }).join('')
            : `<li>${category.items}</li>`;
        
        categoryDiv.innerHTML = `
            <h3>${category.name}</h3>
            <ul>
                ${itemsHtml}
            </ul>
        `;
        
        return categoryDiv;
    }
    // Update blog section dynamically
    updateBlogSection(config) {
        const blogSection = document.querySelector('.blog');
        if (!blogSection) return;

        const titleElement = blogSection.querySelector('h2');
        if (titleElement) {
            titleElement.textContent = this.configManager.getSectionTitle('blog');
        }

        const container = blogSection.querySelector('.blog-posts-container');
        if (!container) return;

        // Clear existing content
        container.innerHTML = '';

        const fragment = document.createDocumentFragment();

        if (config.blog?.posts?.length) {
            config.blog.posts.forEach(post => {
                const postItem = this.createBlogPostItem(post);
                fragment.appendChild(postItem);
            });
        } else {
            // Show placeholder for empty blog
            const emptyState = document.createElement('div');
            emptyState.className = 'blog-post-item';
            emptyState.innerHTML = `
                <h3>My Thoughts Will Appear Here</h3>
                <p class="date">Coming Soon</p>
                <p class="excerpt">I'm getting ready to share my articles and tutorials. Add posts to the 'blog' section in your config.json to get started!</p>
            `;
            fragment.appendChild(emptyState);
        }

        container.appendChild(fragment);
    }

    // Create individual blog post item
    createBlogPostItem(post) {
        const postItem = document.createElement('a');
        postItem.className = 'blog-post-item';
        postItem.href = post.link || '#';
        postItem.target = '_blank';
        postItem.rel = 'noopener noreferrer';
        postItem.setAttribute('aria-label', `Read more about ${post.title}`);

        postItem.innerHTML = `
            <h3>${post.title}</h3>
            ${post.date ? `<p class="date">${post.date}</p>` : ''}
            ${post.excerpt ? `<p class="excerpt">${post.excerpt}</p>` : ''}
        `;

        return postItem;
    }
    // Update performance modelling section dynamically
    updatePerformanceSection(config) {
        const section = document.querySelector('.performance-modelling');
        if (!section || !config.performance_modelling) return;

        const titleElement = section.querySelector('h2');
        if (titleElement) {
            titleElement.textContent = config.performance_modelling.title || 'Performance Workload Modelling';
        }

        const descriptionElement = section.querySelector('.section-description');
        if (descriptionElement && config.performance_modelling.description) {
            descriptionElement.textContent = config.performance_modelling.description;
        }

        const container = section.querySelector('.performance-scenarios-container');
        if (!container) return;

        container.innerHTML = '';
        const fragment = document.createDocumentFragment();

        if (config.performance_modelling.scenarios?.length) {
            config.performance_modelling.scenarios.forEach((scenario, index) => {
                fragment.appendChild(this.createPerformanceScenarioItem(scenario, index));
            });
        } else {
            const emptyState = document.createElement('div');
            emptyState.className = 'performance-scenario-item';
            emptyState.innerHTML = `
                <h3>Modelling Scenarios Will Appear Here</h3>
                <p>Add performance workload scenarios to your config.json to showcase your expertise in this area.</p>
            `;
            fragment.appendChild(emptyState);
        }

        container.appendChild(fragment);
        this.renderPerformanceCharts(config);
    }

    // Create individual performance scenario item
    createPerformanceScenarioItem(scenario, index) {
        const item = document.createElement('div');
        item.className = 'performance-scenario-item';

        const metricsHtml = `
            <div class="metric-item"><span class="label">Concurrent Users</span><span class="value">${scenario.users || 'N/A'}</span></div>
            <div class="metric-item"><span class="label">Throughput</span><span class="value">${scenario.throughput || 'N/A'}</span></div>
            <div class="metric-item"><span class="label">Avg. Response Time</span><span class="value">${scenario.avg_response_time || 'N/A'}</span></div>
            <div class="metric-item"><span class="label">Peak Response Time</span><span class="value">${scenario.peak_response_time || 'N/A'}</span></div>
        `;

        const keyMetricsHtml = scenario.key_metrics?.length
            ? `<h4 class="key-metrics-title">Key Operations Modelled</h4><ul>${scenario.key_metrics.map(metric => `<li>${metric}</li>`).join('')}</ul>`
            : '';

        const chartHtml = scenario.chart_data ? `<div class="performance-chart-container" id="performance-chart-${index}"></div>` : '';

        item.innerHTML = `
            <h3>${scenario.name}</h3>
            <div class="performance-metrics-grid">${metricsHtml}</div>
            ${keyMetricsHtml}
            ${chartHtml}
        `;

        return item;
    }

    // Render charts after the section is added to the DOM
    renderPerformanceCharts(config) {
        if (typeof frappe === 'undefined' || !config.performance_modelling?.scenarios) {
            return;
        }

        const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-color').trim();

        config.performance_modelling.scenarios.forEach((scenario, index) => {
            if (scenario.chart_data) {
                const chartElement = document.getElementById(`performance-chart-${index}`);
                if (chartElement) {
                    new frappe.Chart(chartElement, {
                        title: scenario.chart_data.title,
                        data: scenario.chart_data,
                        type: scenario.chart_data.type || 'bar',
                        height: 250,
                        colors: [accentColor, '#743ee2', '#f0652e'],
                        tooltipOptions: { formatTooltipY: d => d + ' ms' },
                        axisOptions: { xIsSeries: true }
                    });
                }
            }
        });
    }
    // Update navigation links section
    updateNavigationLinksSection(config) {
        const section = document.querySelector('.navigation-links');
        if (!section || !config.navigation_links) return;

        const titleEl = section.querySelector('h2');
        if (titleEl) {
            titleEl.textContent = config.navigation_links.title || '';
        }

        const containerEl = section.querySelector('.nav-links-container');
        if (!containerEl) return;

        containerEl.innerHTML = '';
        const fragment = document.createDocumentFragment();

        if (config.navigation_links.items?.length) {
            config.navigation_links.items.forEach(item => {
                const itemEl = document.createElement('a');
                itemEl.className = 'nav-link-card';
                itemEl.href = item.url;
                itemEl.innerHTML = `
                    <h3>${item.title} →</h3>
                    <p>${item.description}</p>
                `;
                fragment.appendChild(itemEl);
            });
        }

        containerEl.appendChild(fragment);
    }
}
