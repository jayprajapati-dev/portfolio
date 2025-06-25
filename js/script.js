// Sample project data - you can replace this with your actual GitHub projects
const projects = [
    {
        title: "Planner Pro",
        description: "A task management application built with HTML, CSS, and JavaScript.",
        github: "https://github.com/jayprajapati-dev/planner-pro",
        category: "web"
    }
];

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or use system preference
    function getPreferredTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        
        // Use system preference if available
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            return 'light';
        }
        
        return 'dark'; // Default to dark theme
    }
    
    // Apply theme
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
        localStorage.setItem('theme', theme);
    }
    
    // Apply initial theme
    const preferredTheme = getPreferredTheme();
    applyTheme(preferredTheme);
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
    
    // Watch for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                applyTheme(e.matches ? 'light' : 'dark');
            }
        });
    }
}

// Resume Button
function initResumeButton() {
    const resumeBtn = document.getElementById('resumeBtn');
    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Resume is currently not available. Please check back later!');
    });
}

// GitHub Stats
async function fetchGitHubStats() {
    const username = 'jayprajapati-dev';
    const statsContainer = document.querySelector('.stats-container');
    
    // Show loading state
    const statElements = document.querySelectorAll('.stats-value');
    statElements.forEach(el => {
        el.textContent = 'Loading...';
    });

    try {
        // Fetch user data
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        
        // Update followers and repositories immediately
        updateStatValue('followers', data.followers || 'N/A');
        updateStatValue('repositories', data.public_repos || 'N/A');
        
        // Fetch repositories for languages
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await reposResponse.json();
        const languages = new Set();
        
        repos.forEach(repo => {
            if (repo.language) {
                languages.add(repo.language);
            }
        });
        
        updateStatValue('languages', languages.size || 'N/A');
        
        // Fetch contributions
        const contributionsResponse = await fetch(`https://api.github.com/users/${username}/events`);
        const events = await contributionsResponse.json();
        const contributions = events.filter(event => event.type === 'PushEvent').length;
        
        updateStatValue('contributions', contributions || 'N/A');
        
        // Ensure stats container is visible
        statsContainer.style.display = 'grid';
        statsContainer.style.opacity = '1';
        statsContainer.style.visibility = 'visible';
        
    } catch (error) {
        console.error('Error fetching GitHub stats:', error);
        // Show error state
        statElements.forEach(el => {
            el.textContent = 'N/A';
        });
    }
}

// Helper function to update stat values with animation
function updateStatValue(id, value) {
    const element = document.getElementById(id);
    if (element) {
        // Remove any existing animation
        element.style.animation = 'none';
        element.offsetHeight; // Trigger reflow
        
        // Set the value
        element.textContent = value;
        
        // Add fade-in animation
        element.style.animation = 'fadeIn 0.5s ease forwards';
    }
}

// Skills Progress Animation
function initSkillsProgress() {
    const progressBars = document.querySelectorAll('.progress');
    
    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        ScrollTrigger.create({
            trigger: bar,
            start: 'top 80%',
            onEnter: () => {
                bar.style.width = `${progress}%`;
            }
        });
    });
}

// GSAP Animations
function initAnimations() {
    // Hero section animation
    gsap.from('.hero-content', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    });

    // Skills section animation
    gsap.from('.skill-item', {
        scrollTrigger: {
            trigger: '.skills',
            start: 'top 80%'
        },
        duration: 0.5,
        y: 30,
        opacity: 0,
        stagger: 0.1
    });

    // GitHub stats animation - Modified to be less intrusive
    gsap.from('.stats-card', {
        scrollTrigger: {
            trigger: '.github-stats',
            start: 'top 80%'
        },
        duration: 0.3,
        y: 10,
        opacity: 0.8,
        stagger: 0.1,
        ease: 'power1.out'
    });
}

// Contact form handling
function initContactForm() {
    const form = document.querySelector('.contact-form');
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.textContent;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic validation
        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const message = form.querySelector('#message').value.trim();

        if (!name || !email || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Set loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Opening Email...';

        // Create mailto link
        const mailtoLink = `mailto:prajapatijay17112007@gmail.com?subject=New Contact Form Message from ${name}&body=Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
        
        // Open email client
        window.location.href = mailtoLink;

        // Reset form and button after a short delay
        setTimeout(() => {
            form.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            alert('Email client opened! Please send your message.');
        }, 1000);
    });
}

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuBackdrop = document.querySelector('.mobile-menu-backdrop');
    const navLinkItems = document.querySelectorAll('.nav-links a');
    
    // Function to open/close mobile menu
    function toggleMobileMenu() {
        const isOpen = navLinks.classList.contains('active');
        
        if (isOpen) {
            // Close menu
            closeMenu();
        } else {
            // Open menu
            openMenu();
        }
    }
    
    // Open menu function
    function openMenu() {
        navLinks.classList.add('active');
        document.body.classList.add('menu-open');
        mobileMenuToggle.querySelector('i').className = 'fas fa-times';
    }
    
    // Close menu function
    function closeMenu() {
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
    }
    
    // Toggle menu on button click
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
    }
    
    // Close menu when clicking on backdrop
    if (menuBackdrop) {
        menuBackdrop.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMenu();
        });
    }
    
    // Close menu when clicking on nav links
    if (navLinkItems && navLinkItems.length > 0) {
        navLinkItems.forEach(link => {
            link.addEventListener('click', (e) => {
                // Allow hash links to work normally
                if (!link.getAttribute('href').startsWith('#')) {
                    // For non-hash links, navigate normally
                    return;
                }
                
                // For hash links, prevent default navigation
                e.preventDefault();
                
                // Get the target element
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                // Close the menu
                closeMenu();
                
                // Scroll to the target element with smooth behavior
                if (targetElement) {
                    setTimeout(() => {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 300); // Small delay to allow menu animation to complete
                }
            });
        });
    }
    
    // Close menu on window resize if it becomes desktop view
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !navLinks.contains(e.target) && 
            e.target !== mobileMenuToggle && 
            !mobileMenuToggle.contains(e.target)) {
            closeMenu();
        }
    });
}

// Initialize project filters and create project cards
function initProjectFilters() {
    const searchInput = document.querySelector('.search-box input');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.querySelector('.projects-grid');
    const projectsSection = document.querySelector('.projects');

    // Show projects section immediately
    projectsSection.style.display = 'block';
    projectsSection.style.opacity = '1';
    projectsSection.style.transform = 'translateY(0)';

    // Create project cards
    createProjectCards();

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();

        projectCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Create project cards with GitHub data
async function createProjectCards() {
    const projectsGrid = document.querySelector('.projects-grid');
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading';
    loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading projects...';
    projectsGrid.innerHTML = '';
    projectsGrid.appendChild(loadingDiv);

    try {
        const response = await fetch('https://api.github.com/users/jayprajapati-dev/repos');
        const projects = await response.json();
        
        // Sort projects by stars in descending order
        projects.sort((a, b) => b.stargazers_count - a.stargazers_count);
        
        // Filter out forked repositories
        const originalProjects = projects.filter(project => !project.fork);
        
        // Clear loading message
        projectsGrid.innerHTML = '';
        
        // Create project cards
        originalProjects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            card.innerHTML = `
                <h3>${project.name}</h3>
                <div class="project-links">
                    <a href="${project.html_url}" class="github-link" target="_blank">
                        <i class="fas fa-external-link-alt"></i>
                        View
                    </a>
                </div>
            `;
            
            projectsGrid.appendChild(card);
        });

        // Add show more button if there are more than 4 projects
        if (originalProjects.length > 4) {
            const showMoreBtn = document.createElement('button');
            showMoreBtn.className = 'show-more-btn';
            showMoreBtn.innerHTML = 'Show More <i class="fas fa-chevron-down"></i>';
            
            showMoreBtn.addEventListener('click', () => {
                const hiddenCards = document.querySelectorAll('.project-card:nth-child(n+5)');
                hiddenCards.forEach(card => {
                    card.classList.remove('hidden');
                });
                showMoreBtn.remove();
            });
            
            projectsGrid.parentElement.appendChild(showMoreBtn);
        }

    } catch (error) {
        console.error('Error fetching projects:', error);
        projectsGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                Failed to load projects. Please try again later.
            </div>
        `;
    }
}

// Update copyright year
function updateYear() {
    document.getElementById('year').textContent = new Date().getFullYear();
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll event listener for header transparency
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
    if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(10, 25, 47, 0.98)';
        } else {
        header.style.backgroundColor = 'rgba(10, 25, 47, 0.95)';
        }
    } else {
        if (window.scrollY > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
        }
    }
});

// CLI Interface
const cliCommands = {
    help: () => {
        return [
            'Available commands:',
            '  help      - Show this help message',
            '  about     - Learn more about me',
            '  skills    - List my technical skills',
            '  projects  - View my projects',
            '  contact   - Get my contact information',
            '  clear     - Clear the terminal',
            '  theme     - Toggle light/dark theme',
            '  social    - View my social media links',
            '  education - View my education details',
            '  time      - Show current time',
            '  weather   - Show weather (demo)',
            '  ascii     - Show ASCII art'
        ];
    },
    about: () => {
        return [
            'About Jay Prajapati:',
            'I am a passionate Web Developer and Digital Marketing Expert',
            'Currently pursuing Diploma in Information Technology',
            'Expertise in:',
            '• Full-stack web development',
            '• Python and Java programming',
            '• Digital marketing strategies',
            '• UI/UX design',
            '',
            'Type "skills" to see my technical expertise in detail.'
        ];
    },
    skills: () => {
        return [
            'Technical Skills:',
            '',
            'Programming:',
            '• Python - Advanced',
            '• Java   - Intermediate',
            '• C      - Intermediate',
            '',
            'Web Development:',
            '• HTML/CSS    - Advanced',
            '• JavaScript  - Intermediate',
            '• Bootstrap   - Advanced',
            '• GSAP        - Intermediate',
            '',
            'Digital Marketing:',
            '• SEO Optimization',
            '• Content Strategy',
            '• Social Media Marketing'
        ];
    },
    projects: () => {
        return [
            'Featured Projects:',
            '',
            '1. Portfolio Website',
            '   • Modern, responsive design',
            '   • Dark/light theme support',
            '   • Interactive CLI interface',
            '',
            '2. SSIP Project Winner',
            '   • Innovative tech solution',
            '   • Award-winning project',
            '',
            'More projects on GitHub!'
        ];
    },
    education: () => {
        const startDate = new Date('2023-06-01'); // Assuming June 2023 start
        const endDate = new Date('2026-05-31');   // Assuming May 2026 end
        const now = new Date();
        
        // Calculate semester based on date
        let semesterInfo;
        if (now > endDate) {
            semesterInfo = '• Completed (2023 - 2026)';
        } else {
            // Each semester is roughly 6 months
            const monthsElapsed = (now - startDate) / (1000 * 60 * 60 * 24 * 30);
            const currentSem = Math.min(6, Math.ceil(monthsElapsed / 6));
            semesterInfo = `• 2023 - 2026\n• Current Semester: ${currentSem} of 6`;
        }

        return [
            'Education:',
            '',
            'Diploma in Information Technology',
            '• Gujarat Technological University',
            semesterInfo,
            '',
            'Achievements:',
            '• SSIP Palanpur 2024 Winner',
            '• Python Certification'
        ];
    },
    contact: () => {
        return [
            'Contact Information:',
            '',
            'Professional:',
            '• Email: [Your Email]',
            '• LinkedIn: linkedin.com/in/jayprajapati171120',
            '',
            'Social:',
            '• GitHub: github.com/jayprajapati-dev',
            '• Instagram: @prajapati_jay_1711',
            '',
            'Type "social" for all social links'
        ];
    },
    social: () => {
        return [
            'Social Media Links:',
            '',
            '🔗 LinkedIn:  linkedin.com/in/jayprajapati171120',
            '🔗 GitHub:    github.com/jayprajapati-dev',
            '🔗 Instagram: instagram.com/prajapati_jay_1711',
            '',
            'Feel free to connect!'
        ];
    },
    clear: () => {
        document.getElementById('cliOutput').innerHTML = '';
        return ['Terminal cleared.'];
    },
    theme: () => {
        document.documentElement.setAttribute('data-theme', 
            document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
        );
        return ['Theme toggled! 🎨'];
    },
    time: () => {
        const now = new Date();
        return [`Current time: ${now.toLocaleString()}`];
    },
    weather: () => {
        return [
            'Current Weather (Demo):',
            '📍 Gujarat, India',
            '🌡️ Temperature: 28°C',
            '☀️ Condition: Sunny',
            '💨 Wind: 12 km/h'
        ];
    },
    ascii: () => {
        const arts = [
            // Cool JP logo
            [
                '     ╔═══╗╔═══╗',
                '     ║╔═╗║║╔═╗║',
                '     ║║─║║║╚═╝║',
                '     ║╚═╝║║╔══╝',
                '╔═══╗║╔═╗║║║   ',
                '╚═══╝╚╝─╚╝╚╝   ',
                '< Jay Prajapati >'
            ],
            // Modern tech style
            [
                '  ┌─────────────┐ ',
                '  │ JAY         │▒',
                '  │ PRAJAPATI   │▒',
                '  │ DEV         │▒',
                '  └─────────────┘▒',
                '   ▒▒▒▒▒▒▒▒▒▒▒▒▒▒'
            ],
            // Terminal style
            [
                '╭──────────────────╮',
                '│ $ whoami         │',
                '│ > Jay Prajapati  │',
                '│ $ role          │',
                '│ > Web Developer  │',
                '│ $ status        │',
                '│ > Coding...     │',
                '╰──────────────────╯'
            ],
            // Minimalist badge
            [
                '  ╭───────╮  ',
                ' /    J    \\ ',
                '│     P     │',
                ' \\   DEV   / ',
                '  ╰───────╯  '
            ],
            // Code brackets
            [
                ' {',
                '   "name": "Jay",',
                '   "role": "Developer",',
                '   "skills": ["Web", "Python", "Java"],',
                '   "status": "Available for projects"',
                ' }'
            ]
        ];

        // Pick a random art
        const randomArt = arts[Math.floor(Math.random() * arts.length)];
        
        // Add some decorative elements
        const width = Math.max(...randomArt.map(line => line.length));
        const separator = '─'.repeat(width);
        
        return [
            '',
            ...randomArt,
            '',
            separator,
            'Type "ascii" again for a different design!'
        ];
    },
};

function initCLI() {
    const cliInput = document.getElementById('cliInput');
    const cliOutput = document.getElementById('cliOutput');
    let commandHistory = [];
    let historyIndex = -1;

    function addToOutput(text, isCommand = false, isError = false) {
        const line = document.createElement('div');
        line.className = `cli-line${isError ? ' error' : ''}${isCommand ? ' command' : ''}`;
        line.textContent = isCommand ? `$ ${text}` : text;
        cliOutput.appendChild(line);
        cliOutput.scrollTop = cliOutput.scrollHeight;
    }

    function processCommand(cmd) {
        const command = cmd.toLowerCase().trim();
        
        if (command === '') return;
        
        // Add to history
        commandHistory.unshift(command);
        historyIndex = -1;
        
        // Show command
        addToOutput(cmd, true);
        
        // Process command
        if (cliCommands[command]) {
            const output = cliCommands[command]();
            output.forEach(line => addToOutput(line));
        } else {
            addToOutput(`Command not found: ${cmd}. Type 'help' for available commands.`, false, true);
        }
    }

    // Command history navigation
    cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                cliInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                cliInput.value = commandHistory[historyIndex];
            } else if (historyIndex === 0) {
                historyIndex = -1;
                cliInput.value = '';
            }
        }
    });

    // Command execution
    cliInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const command = cliInput.value;
            processCommand(command);
            cliInput.value = '';
        }
    });

    // Auto-focus input on terminal click
    document.querySelector('.cli-interface').addEventListener('click', () => {
        cliInput.focus();
    });

    // Initial welcome message
    [
        '🚀 Welcome to Jay\'s Portfolio Terminal!',
        '🔍 Type "help" to see available commands.',
        '💡 Try the new "ascii" command for some art!'
    ].forEach(line => addToOutput(line));
}

// Initialize CLI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initCLI();
});

// Live Code Editor
document.addEventListener('DOMContentLoaded', () => {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const textareas = document.querySelectorAll('.editor-textarea');
    const previewFrame = document.getElementById('previewFrame');

    // Default templates
    const defaultTemplates = {
        html: `<div class="container">
    <h1>Hello World!</h1>
    <p>Start coding here...</p>
</div>`,
        css: `/* Add your CSS here */
.container {
    padding: 20px;
    text-align: center;
}

h1 {
    color: #00ff9d;
}`,
        js: `// Add your JavaScript here
console.log('Hello from JavaScript!');`
    };

    // Set default values
    Object.keys(defaultTemplates).forEach(lang => {
        document.getElementById(`${lang}Editor`).value = defaultTemplates[lang];
    });

    // Tab switching functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // Update active tab
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding textarea
            textareas.forEach(textarea => {
                textarea.classList.remove('active');
                if (textarea.id === `${tab}Editor`) {
                    textarea.classList.add('active');
                }
            });

            // Show preview frame
            previewFrame.classList.remove('active');
            if (tab === 'html' || tab === 'css' || tab === 'js') {
                previewFrame.classList.add('active');
            }
        });
    });

    // Run button functionality
    const runBtn = document.querySelector('.run-btn');
    const resetBtn = document.querySelector('.reset-btn');

    // Run code based on active tab
    function runCode() {
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
        const code = document.getElementById(`${activeTab}Editor`).value;

        if (activeTab === 'html' || activeTab === 'css' || activeTab === 'js') {
            updatePreview();
        }
    }

    // Reset code to default template
    function resetCode() {
        const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
        document.getElementById(`${activeTab}Editor`).value = defaultTemplates[activeTab];
        runCode();
    }

    // Update HTML preview
    function updatePreview() {
        const html = document.getElementById('htmlEditor').value;
        const css = document.getElementById('cssEditor').value;
        const js = document.getElementById('jsEditor').value;

        const content = `
            <!DOCTYPE html>
            <html>
                <head>
                    <style>${css}</style>
                </head>
                <body>
                    ${html}
                    <script>${js}</script>
                </body>
            </html>
        `;

        const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
        doc.open();
        doc.write(content);
        doc.close();
    }

    runBtn.addEventListener('click', runCode);
    resetBtn.addEventListener('click', resetCode);

    // Auto-run on code change
    let timeout;
    textareas.forEach(textarea => {
        textarea.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(runCode, 1000);
        });
    });

    // Initial preview
    runCode();
});

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createProjectCards();
    updateYear();
    initMobileMenu();
    initContactForm();
    initThemeToggle();
    initResumeButton();
    // Fetch GitHub stats immediately
    setTimeout(fetchGitHubStats, 100); // Small delay to ensure DOM is ready
    initSkillsProgress();
    initAnimations();
    initProjectFilters();
});

// Performance Optimizations
document.addEventListener('DOMContentLoaded', () => {
    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    // Observe elements for lazy loading
    document.querySelectorAll('.skill-item, .project-card, .stats-card').forEach(el => {
        observer.observe(el);
    });

    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimize scroll event listener
    const handleScroll = debounce(() => {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 10);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Trigger the scroll handler initially to set the correct state
    handleScroll();

    // Optimize theme toggle is now handled by initThemeToggle()

    // Mobile menu is now handled by initMobileMenu()

    // Optimize project search
    const projectSearch = document.getElementById('projectSearch');
    if (projectSearch) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectSearch.addEventListener('input', debounce((e) => {
            const searchTerm = e.target.value.toLowerCase();
            projectCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                card.style.display = title.includes(searchTerm) || description.includes(searchTerm) ? 'block' : 'none';
            });
        }, 300));
    }

    // Optimize form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                // Your existing form submission code
                submitBtn.textContent = 'Message Sent!';
                contactForm.reset();
            } catch (error) {
                submitBtn.textContent = 'Error. Try Again.';
            } finally {
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Message';
                }, 3000);
            }
        });
    }

    // Load GitHub stats
    loadGitHubStats();
});