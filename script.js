document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Loading Screen --- */
    const loader = document.getElementById('loader');

    // Simulate initial loading time for dramatic effect, then hide
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500); // Wait for transition
    }, 2500);

    /* --- 2. Custom Cursor --- */
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    // Only apply on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';

            // Add a slight delay to the follower
            setTimeout(() => {
                follower.style.left = e.clientX + 'px';
                follower.style.top = e.clientY + 'px';
            }, 50);
        });

        // Hover Effects for clickable elements
        const clickables = document.querySelectorAll('a, button, .glass-card, .tilt-card, .logo, input, textarea');

        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
                follower.style.borderColor = 'var(--neon-purple)';
                follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
                follower.style.borderColor = 'var(--neon-blue)';
                follower.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        });
    } else {
        // Hide custom cursors on mobile
        cursor.style.display = 'none';
        follower.style.display = 'none';
    }

    /* --- 3. Typing Effect --- */
    const roles = ["Aspiring Data Scientist"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriter');
    let typeSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Faster deletion
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before typing new word
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 3000); // Start typing after loader finishes

    /* --- 4. Navigation & Mobile Menu --- */
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link Highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Add a threshold so it highlights slightly before hitting the exact top
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href') === `#${current}`) {
                a.classList.add('active');
            }
        });
    });

    // Mobile Hamburger Toggle
    hamburger.addEventListener('click', () => {
        // Toggle Nav
        navLinks.classList.toggle('nav-active');

        // Animate Links
        navLinksItems.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Hamburger Icon Animation
        hamburger.classList.toggle('toggle');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('nav-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on link click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                hamburger.click(); // Trigger click to reverse animations and close
            }
        });
    });

    /* --- 5. Intersection Observer for Scroll Animations --- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.observe-section').forEach(section => {
        sectionObserver.observe(section);
    });

    /* --- 6. 3D Tilt Effect for Project Cards --- */
    const tiltCards = document.querySelectorAll('.tilt-card');

    // Only apply if not on touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element.
                const y = e.clientY - rect.top;  // y position within the element.

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Calculate rotation (max rotation is 15deg)
                const rotateX = ((y - centerY) / centerY) * -15;
                const rotateY = ((x - centerX) / centerX) * 15;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

                // Adjust glass shine effect dynamically
                const beforeEl = card.style;
                // Since pseudo elements can't be modified directly via JS inline, we'd normally use custom properties.
                // For simplicity, we just tilt.
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
                card.style.transition = 'transform 0.5s ease';
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none'; // Remove transition for smooth instantaneous tracking
            });
        });
    }

    /* --- 7. Contact Form Validation --- */
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        let valid = true;
        let errorMsg = '';

        if (name.length < 2) {
            valid = false;
            errorMsg = 'Identifier too short.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            valid = false;
            errorMsg = 'Invalid Comms Address format.';
        } else if (message.length < 10) {
            valid = false;
            errorMsg = 'Transmission Payload too light. Minimum 10 characters.';
        }

        formMessage.classList.remove('hidden');

        if (!valid) {
            formMessage.textContent = errorMsg;
            formMessage.className = 'error';
        } else {
            // Simulate sending transmission
            formMessage.textContent = 'Transmitting...';
            formMessage.className = 'success';

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing';

            setTimeout(() => {
                formMessage.textContent = 'Transmission Successful. Signal Recieved.';
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Transmission <i class="fas fa-paper-plane"></i>';

                setTimeout(() => {
                    formMessage.classList.add('hidden');
                }, 5000);
            }, 2000);
        }
    });

});

/* --- 8. Certificate Modal Logic --- */
function openCertModal(imageSrc) {
    const modal = document.getElementById('certModal');
    const modalImg = document.getElementById('certModalImg');
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modalImg.src = imageSrc;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeCertModal() {
    const modal = document.getElementById('certModal');
    modal.style.display = "none";
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Close modal on escape key
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        closeCertModal();
    }
});
