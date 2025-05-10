document.addEventListener('DOMContentLoaded', () => {
    // --- Globals & DOM Elements ---
    let allProjectsData = []; // To store fetched projects
    const featuredProjectsGrid = document.getElementById('featured-projects-grid');
    const allProjectsGrid = document.getElementById('all-projects-grid');
    const latestBlogList = document.getElementById('latest-blog-list');
    const techFilter = document.getElementById('tech-filter');

    // Modal elements
    const projectModal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const modalTechTags = document.getElementById('modal-tech-tags');
    const modalLiveLink = document.getElementById('modal-live-link');
    const modalRepoLink = document.getElementById('modal-repo-link');
    const closeModalButton = document.querySelector('.modal .close-button');


    // --- Navigation ---
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            // Optional: Change hamburger to X
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu if a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                navToggle.classList.remove('active');
            }
        });
    });


    // --- Dynamic Year for Footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Fetch Data Functions ---
    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Could not fetch data:", error);
            return []; // Return empty array on error
        }
    }

    // --- Project Rendering ---
    function createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <img src="${project.thumb || 'images/placeholder.jpg'}" alt="${project.title}" loading="lazy">
            <div class="project-card-content">
                <h3>${project.title}</h3>
                <p>${project.description.substring(0, 100)}...</p>
                <div class="tech-tags">
                    ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
                </div>
                <div class="project-card-actions">
                    <button class="btn btn-secondary view-details-btn" data-project-id="${project.id}">View Details</button>
                    ${project.liveLink && project.liveLink !== "#" ? `<a href="${project.liveLink}" class="btn" target="_blank">Live Demo</a>` : ''}
                </div>
            </div>
        `;
        // Add event listener for the "View Details" button
        card.querySelector('.view-details-btn').addEventListener('click', () => openProjectModal(project.id));
        return card;
    }

    function displayProjects(projects, container, limit = 0) {
        if (!container) return;
        container.innerHTML = ''; // Clear loading message or previous projects
        const projectsToDisplay = limit > 0 ? projects.slice(0, limit) : projects;

        if (projectsToDisplay.length === 0) {
            container.innerHTML = '<p>No projects to display.</p>';
            return;
        }
        projectsToDisplay.forEach(project => {
            container.appendChild(createProjectCard(project));
        });
    }

    // --- Blog Post Rendering ---
    function createBlogPostItem(post) {
        const item = document.createElement('article');
        item.className = 'blog-post-item';
        // Note: For a full blog, clicking would lead to a full post page or load content dynamically
        item.innerHTML = `
            <div class="blog-post-content">
                <h3><a href="blog.html#${post.slug || post.id}">${post.title}</a></h3>
                <p class="date">Published: ${new Date(post.date).toLocaleDateString()}</p>
                <p>${post.snippet}</p>
                <a href="blog.html#${post.slug || post.id}" class="btn btn-secondary">Read More</a>
            </div>
        `;
        return item;
    }

    function displayBlogPosts(posts, container, limit = 0) {
        if (!container) return;
        container.innerHTML = ''; // Clear loading message
        const postsToDisplay = limit > 0 ? posts.slice(0, limit) : posts;

        if (postsToDisplay.length === 0) {
            container.innerHTML = '<p>No blog posts to display yet.</p>';
            return;
        }
        postsToDisplay.forEach(post => {
            container.appendChild(createBlogPostItem(post));
        });
    }


    // --- Project Modal Logic ---
    function openProjectModal(projectId) {
        const project = allProjectsData.find(p => p.id === projectId);
        if (!project || !projectModal) return;

        modalTitle.textContent = project.title;
        modalImage.src = project.image || 'images/placeholder.jpg';
        modalImage.alt = project.title;
        modalDescription.textContent = project.description;
        
        modalTechTags.innerHTML = project.technologies.map(tech => `<span>${tech}</span>`).join('');
        
        if (project.liveLink && project.liveLink !== "#") {
            modalLiveLink.href = project.liveLink;
            modalLiveLink.style.display = 'inline-block';
        } else {
            modalLiveLink.style.display = 'none';
        }

        if (project.repoLink && project.repoLink !== "#") {
            modalRepoLink.href = project.repoLink;
            modalRepoLink.style.display = 'inline-block';
        } else {
            modalRepoLink.style.display = 'none';
        }
        
        projectModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeProjectModal() {
        if (!projectModal) return;
        projectModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeProjectModal);
    }
    if (projectModal) {
        projectModal.addEventListener('click', (event) => {
            if (event.target === projectModal) { // Clicked on the background
                closeProjectModal();
            }
        });
    }
    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && projectModal && projectModal.style.display === 'block') {
            closeProjectModal();
        }
    });


    // --- Filtering Logic ---
    function populateTechFilter(projects) {
        if (!techFilter) return;
        const allTechs = new Set();
        projects.forEach(project => {
            project.technologies.forEach(tech => allTechs.add(tech));
        });

        allTechs.forEach(tech => {
            const option = document.createElement('option');
            option.value = tech;
            option.textContent = tech;
            techFilter.appendChild(option);
        });
    }

    function filterProjects() {
        if (!techFilter || !allProjectsGrid) return;
        const selectedTech = techFilter.value;
        const filteredProjects = (selectedTech === 'all')
            ? allProjectsData
            : allProjectsData.filter(project => project.technologies.includes(selectedTech));
        
        displayProjects(filteredProjects, allProjectsGrid);
    }

    if (techFilter) {
        techFilter.addEventListener('change', filterProjects);
    }

    // --- Initialization ---
    async function init() {
        // Fetch Projects
        allProjectsData = await fetchData('data/projects.json');
        if (allProjectsData.length > 0) {
            if (featuredProjectsGrid) { // For Home page
                displayProjects(allProjectsData, featuredProjectsGrid, 3); // Display first 3
            }
            if (allProjectsGrid) { // For Projects page
                displayProjects(allProjectsData, allProjectsGrid);
                populateTechFilter(allProjectsData);
            }
        } else {
            if (featuredProjectsGrid) featuredProjectsGrid.innerHTML = "<p>Could not load projects.</p>";
            if (allProjectsGrid) allProjectsGrid.innerHTML = "<p>Could not load projects.</p>";
        }

        // Fetch Blog Posts
        const blogPostsData = await fetchData('data/blog.json');
        if (blogPostsData.length > 0) {
            if (latestBlogList) { // For Home page
                displayBlogPosts(blogPostsData, latestBlogList, 2); // Display first 2
            }
            // On blog.html, you'd have a different container and display all posts
            const fullBlogListContainer = document.getElementById('full-blog-list'); // Example ID for blog.html
            if (fullBlogListContainer) {
                 displayBlogPosts(blogPostsData, fullBlogListContainer);
                 // You might also want to handle routing to individual posts here or on a separate script
            }
        } else {
             if (latestBlogList) latestBlogList.innerHTML = "<p>Could not load blog posts.</p>";
        }
    }

    init(); // Run the initialization function
});
