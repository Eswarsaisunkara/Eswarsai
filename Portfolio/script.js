$(document).ready(function() {

    // =========================================================================
    // 1. Typing Effect for Tagline in Hero Section
    // =========================================================================
    const roles = ["Web Developer", "UI/UX Designer", "Problem Solver", "Innovator"];
    let roleIndex = 0;
    let charIndex = 0;
    const typingSpeed = 100;
    const erasingSpeed = 50;
    const newRoleDelay = 1500;
    const $typingTextElement = $('.typing-text');

    function type() {
        if (roleIndex < roles.length) {
            if (charIndex < roles[roleIndex].length) {
                $typingTextElement.text($typingTextElement.text() + roles[roleIndex].charAt(charIndex));
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(erase, newRoleDelay);
            }
        }
    }

    function erase() {
        if (charIndex > 0) {
            $typingTextElement.text(roles[roleIndex].substring(0, charIndex - 1));
            charIndex--;
            setTimeout(erase, erasingSpeed);
        } else {
            roleIndex++;
            if (roleIndex >= roles.length) {
                roleIndex = 0; // Loop back to the beginning
            }
            setTimeout(type, typingSpeed);
        }
    }
    type(); // Start the effect

    // =========================================================================
    // 2. Smooth Scrolling for Navigation & Buttons
    // =========================================================================
    $('.main-nav ul li a, .footer-nav ul li a, .btn[href^="#"]').on('click', function(e) {
        const href = $(this).attr('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href;
            if ($(targetId).length) {
                const headerHeight = $('.site-header').outerHeight();
                const scrollTopPosition = $(targetId).offset().top - headerHeight;
                $('html, body').animate({
                    scrollTop: scrollTopPosition
                }, 800);
            }
            if ($('.nav-toggle').is(':visible')) {
                $('.nav-list').removeClass('show');
            }
        }
    });

    // =========================================================================
    // 3. Mobile Navigation Toggle
    // =========================================================================
    $('.nav-toggle').on('click', function() {
        $('.nav-list').toggleClass('show');
    });

    // =========================================================================
    // 4. On-Scroll Reveal Animations
    // =========================================================================
    const $revealItems = $('.reveal-item');
    function checkReveal() {
        const windowHeight = $(window).height();
        const scrollTop = $(window).scrollTop();
        $revealItems.each(function() {
            const $this = $(this);
            if ($this.offset().top < (scrollTop + windowHeight - 100) && !$this.hasClass('revealed')) {
                $this.addClass('revealed');
            }
        });
    }
    $(window).on('scroll load', checkReveal);

    // =========================================================================
    // 5. Back to Top Button & Active Nav Link Highlighting
    // =========================================================================
    const $backToTopBtn = $('#backToTopBtn');
    const scrollThreshold = 300;
    $(window).on('scroll', function() {
        // Back to Top button visibility
        if ($(this).scrollTop() > scrollThreshold) {
            $backToTopBtn.addClass('show');
        } else {
            $backToTopBtn.removeClass('show');
        }

        // Active Nav Link Highlighting
        const headerHeight = $('.site-header').outerHeight();
        const currentScrollPos = $(window).scrollTop();
        $('section').each(function() {
            const $this = $(this);
            const sectionTop = $this.offset().top - headerHeight - 1;
            const sectionBottom = sectionTop + $this.outerHeight();
            const sectionId = $this.attr('id');

            if (currentScrollPos >= sectionTop && currentScrollPos < sectionBottom) {
                $('.main-nav .nav-link').removeClass('active');
                $('.main-nav a[data-target="' + sectionId + '"]').addClass('active');
            }
        });
        if (currentScrollPos === 0) { // Highlight Home at the top
            $('.main-nav .nav-link').removeClass('active');
            $('.main-nav a[data-target="hero"]').addClass('active');
        }
    });

    $backToTopBtn.on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });

    // =========================================================================
    // 6. Certificates Carousel Functionality
    // =========================================================================
    const $carousel = $('.certificate-carousel');
    const $items = $carousel.find('.certificate-item');
    const $prevBtn = $('.carousel-control.prev');
    const $nextBtn = $('.carousel-control.next');
    let currentIndex = 0;
    let isDown = false, startX, scrollLeft;

    function getItemsPerView() {
        return ($(window).width() >= 1024) ? 3 : ($(window).width() >= 768) ? 2 : 1;
    }

    function updateCarousel() {
        const itemWidth = $items.outerWidth(true);
        const maxScroll = $carousel[0].scrollWidth - $carousel[0].clientWidth;
        let newScrollLeft = currentIndex * itemWidth;
        newScrollLeft = Math.min(newScrollLeft, maxScroll);

        $carousel.animate({ scrollLeft: newScrollLeft }, 500);

        $prevBtn.toggle(newScrollLeft > 0);
        $nextBtn.toggle(newScrollLeft < maxScroll - 1);
    }

    $prevBtn.on('click', () => {
        currentIndex = Math.max(0, currentIndex - getItemsPerView());
        updateCarousel();
    });

    $nextBtn.on('click', () => {
        const totalItems = $items.length;
        const itemsPerView = getItemsPerView();
        const maxIndex = Math.max(0, totalItems - itemsPerView);
        currentIndex = Math.min(maxIndex, currentIndex + itemsPerView);
        updateCarousel();
    });

    // Drag/Swipe functionality
    $carousel.on('mousedown touchstart', (e) => {
        isDown = true;
        startX = (e.pageX || e.originalEvent.touches[0].pageX) - $carousel.offset().left;
        scrollLeft = $carousel.scrollLeft();
    }).on('mouseleave mouseup touchend', () => {
        isDown = false;
        // Snap to nearest item after drag
        const itemWidth = $items.outerWidth(true);
        currentIndex = Math.round($carousel.scrollLeft() / itemWidth);
        updateCarousel();
    }).on('mousemove touchmove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = (e.pageX || e.originalEvent.touches[0].pageX) - $carousel.offset().left;
        const walk = (x - startX) * 1.5;
        $carousel.scrollLeft(scrollLeft - walk);
    });
    
    $(window).on('load resize', updateCarousel);

    // =========================================================================
    // 7. Contact Form (EmailJS Integration)
    // =========================================================================
    (function() {
        // IMPORTANT: Replace with your actual EmailJS Public Key
        emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");
    })();

    $('#contactForm').on('submit', function(event) {
        event.preventDefault();
        const $formStatus = $('#formStatus');
        $formStatus.removeClass('success error').hide().text('Sending...');

        // IMPORTANT: Replace with your Service ID and Template ID
        emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", this)
            .then(() => {
                $formStatus.addClass('success').text('Message Sent Successfully!').fadeIn();
                $('#contactForm')[0].reset();
            }, (error) => {
                console.error("EmailJS Error:", error);
                $formStatus.addClass('error').text('Failed to send. Please try again.').fadeIn();
            });
    });

    // =========================================================================
    // 8. Contact Form Floating Labels (Not needed with the CSS :valid selector)
    // The CSS handles this automatically with the :focus and :valid pseudo-classes.
    // This JS part can be omitted for a cleaner, CSS-only solution.
    // However, if you need more complex logic (like handling autofill), this can be extended.
    // The provided CSS is robust enough for modern browsers.
    // =========================================================================

});