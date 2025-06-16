document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const loginSection = document.getElementById('login');
    const landingSection = document.getElementById('landing');
    const manualSection = document.getElementById('manual');
    const startButton = document.getElementById('startButton');
    const unlockButton = document.getElementById('unlockButton');
    const nicknameInput = document.getElementById('nicknameInput');
    const errorMessage = document.querySelector('.error-message');
    const prevButton = document.getElementById('prevStep');
    const nextButton = document.getElementById('nextStep');
    const steps = document.querySelectorAll('.step');
    const musicPlayer = document.getElementById('musicPlayer');
    const signButtons = document.querySelectorAll('.sign-button');

    // State
    let currentStep = 1;
    let isMusicPlaying = false;
    let audio = null;
    const checkedItems = new Set();

    // Initialize
    updateStepVisibility();
    updateNavigationButtons();
    initializeAudio();

    // Event Listeners
    unlockButton.addEventListener('click', () => {
        const nickname = nicknameInput.value.trim().toLowerCase();
        if (nickname === 'signorita') {
            // Add magical transition effect
            const storybook = document.querySelector('.storybook-page');
            storybook.style.animation = 'magicalDisappear 1s ease-out forwards';

            setTimeout(() => {
                loginSection.classList.remove('active');
                loginSection.classList.add('hidden');
                landingSection.classList.remove('hidden');
                landingSection.classList.add('active');
                playConfetti();

                // Add magical entrance for landing page
                const landingTitle = landingSection.querySelector('h1');
                const welcomeText = landingSection.querySelector('.welcome-text');
                const startBtn = landingSection.querySelector('.primary-button');

                landingTitle.style.animation = 'magicalAppear 1s ease-out forwards';
                welcomeText.style.animation = 'magicalAppear 1s ease-out 0.3s forwards';
                startBtn.style.animation = 'magicalAppear 1s ease-out 0.6s forwards';
            }, 1000);
        } else {
            errorMessage.classList.remove('hidden');
            nicknameInput.classList.add('error');
            playErrorSound();
            setTimeout(() => {
                errorMessage.classList.add('hidden');
                nicknameInput.classList.remove('error');
            }, 3000);
        }
    });

    nicknameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            unlockButton.click();
        }
    });

    startButton.addEventListener('click', () => {
        // Add fade out animation to landing section
        landingSection.style.animation = 'fadeOut 0.5s ease-out forwards';

        setTimeout(() => {
            landingSection.classList.remove('active');
            landingSection.classList.add('hidden');

            // Show manual section with fade in animation
            manualSection.classList.remove('hidden');
            manualSection.classList.add('active');
            manualSection.style.animation = 'fadeIn 0.5s ease-out forwards';

            // Scroll to the top of the manual section
            manualSection.scrollIntoView({ behavior: 'smooth' });

            // Focus on the first step
            const firstStep = document.querySelector('.step[data-step="1"]');
            if (firstStep) {
                firstStep.style.animation = 'focusIn 0.5s ease-out forwards';
            }

            playConfetti();
        }, 500);
    });

    prevButton.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepVisibility();
            updateNavigationButtons();
            playTransitionSound();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentStep < steps.length) {
            currentStep++;
            updateStepVisibility();
            updateNavigationButtons();
            playTransitionSound();
        }
    });

    musicPlayer.addEventListener('click', () => {
        if (isMusicPlaying) {
            audio.pause();
            musicPlayer.classList.remove('playing');
        } else {
            audio.play();
            musicPlayer.classList.add('playing');
        }
        isMusicPlaying = !isMusicPlaying;
    });

    signButtons.forEach(button => {
        button.addEventListener('click', () => {
            const checkNumber = button.getAttribute('data-check');
            if (!checkedItems.has(checkNumber)) {
                checkedItems.add(checkNumber);
                button.classList.add('signed');
                button.textContent = 'Signed with Love ❤️';
                playHeartSound();

                // If this is the last item (10th), show a special message
                if (checkNumber === '10') {
                    setTimeout(() => {
                        const finalMessage = document.createElement('div');
                        finalMessage.className = 'final-message';
                        finalMessage.innerHTML = `
                            <h3>Thank you for reading all 10 things I love about you ❤️</h3>
                            <p>Each one is a piece of my heart that I'm sharing with you...</p>
                        `;
                        document.querySelector('.step[data-step="14"]').appendChild(finalMessage);
                        finalMessage.style.animation = 'fadeIn 1s ease-out forwards';

                        // Show the next button after showing the final message
                        const nextButton = document.getElementById('nextStep');
                        nextButton.style.display = 'block';
                        nextButton.disabled = false;
                    }, 1000);
                } else {
                    // Automatically proceed to next step after a short delay
                    setTimeout(() => {
                        if (currentStep < steps.length) {
                            currentStep++;
                            updateStepVisibility();
                            updateNavigationButtons();
                            playTransitionSound();
                        }
                    }, 1500);
                }
            }
        });
    });

    // Helper Functions
    function updateStepVisibility() {
        steps.forEach(step => {
            const stepNumber = parseInt(step.dataset.step);
            if (stepNumber === currentStep) {
                step.style.display = 'block';
                step.style.opacity = '0';
                step.classList.add('active');
                setTimeout(() => {
                    step.style.opacity = '1';
                }, 50);

                // If this is a "10 Things" step, check if it's already been read
                const signButton = step.querySelector('.sign-button');
                if (signButton) {
                    const checkNumber = signButton.getAttribute('data-check');
                    if (checkedItems.has(checkNumber)) {
                        signButton.classList.add('signed');
                        signButton.textContent = 'Signed with Love ❤️';
                    }
                }
            } else {
                step.style.display = 'none';
                step.classList.remove('active');
            }
        });
    }

    function updateNavigationButtons() {
        const prevButton = document.getElementById('prevStep');
        const nextButton = document.getElementById('nextStep');

        prevButton.disabled = currentStep === 1;

        // Hide next button for steps 5-13 (10 Things I Love About You slides)
        // But show it for step 14 (the last slide)
        if (currentStep >= 5 && currentStep <= 13) {
            nextButton.style.display = 'none';
        } else {
            nextButton.style.display = 'block';
            nextButton.disabled = currentStep === steps.length;
        }
    }

    function initializeAudio() {
        audio = new Audio('romantic-wedding-background-music-337990.mp3');
        audio.loop = true;
        audio.volume = 0.5;

        // Try to play music immediately
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                isMusicPlaying = true;
                musicPlayer.classList.add('playing');
            }).catch(error => {
                console.log('Auto-play prevented:', error);
                // Show a message to the user
                const musicMessage = document.createElement('div');
                musicMessage.className = 'music-message';
                musicMessage.innerHTML = 'Click the music note to start the background music ❤️';
                document.body.appendChild(musicMessage);

                setTimeout(() => {
                    musicMessage.remove();
                }, 5000);
            });
        }
    }

    function playConfetti() {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        document.body.appendChild(container);

        const colors = [
            'var(--color-accent)',
            'var(--color-dusty-rose)',
            'var(--color-gentle-purple)',
            'var(--color-muted-gold)',
            'var(--color-rich-red)'
        ];

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            container.appendChild(confetti);
        }

        setTimeout(() => {
            container.remove();
        }, 3000);
    }

    function playTransitionSound() {
        const transitionSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
        transitionSound.volume = 0.2;
        transitionSound.play();
    }

    function playErrorSound() {
        const errorSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
        errorSound.volume = 0.2;
        errorSound.play();
    }

    function playHeartSound() {
        const heartSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
        heartSound.volume = 0.2;
        heartSound.play();
    }

    // Final buttons functionality
    const restartButton = document.getElementById('restartButton');
    const closeButton = document.getElementById('closeButton');

    if (restartButton) {
        restartButton.addEventListener('click', () => {
            currentStep = 1;
            updateStepVisibility();
            updateNavigationButtons();
            playConfetti();
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            const manualSection = document.getElementById('manual');
            manualSection.style.animation = 'fadeOut 0.5s ease-out forwards';
            setTimeout(() => {
                manualSection.classList.remove('active');
                manualSection.classList.add('hidden');
                playConfetti();
            }, 500);
        });
    }

    // Add floating elements
    function createFloatingElements() {
        const elements = ['🎁', '🎈', '🎀', '💝', '💖', '💕', '💗', '💓'];
        const container = document.querySelector('.container');

        elements.forEach((emoji, index) => {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.textContent = emoji;
            element.style.left = `${Math.random() * 100}%`;
            element.style.top = `${Math.random() * 100}%`;
            element.style.animationDelay = `${index * 2}s`;
            container.appendChild(element);
        });
    }

    // Add sparkle effect
    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1500);
    }

    // Enhanced confetti effect
    function createEnhancedConfetti() {
        const colors = ['#e8b4b4', '#d4a5a5', '#ffd1dc', '#dc8b9b', '#e6e6fa'];
        const container = document.querySelector('.container');

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }

    // Add mouse sparkle effect
    document.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.1) {
            createSparkle(e.clientX, e.clientY);
        }
    });

    // Enhanced step transitions
    function showStep(stepNumber) {
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => {
            step.classList.remove('active');
        });

        const currentStep = document.querySelector(`[data-step="${stepNumber}"]`);
        if (currentStep) {
            currentStep.classList.add('active');
            createEnhancedConfetti();
        }
    }

    // Enhanced music player
    let isPlaying = false;

    musicPlayer.addEventListener('click', () => {
        isPlaying = !isPlaying;
        musicPlayer.classList.toggle('playing');
        if (isPlaying) {
            playSound('background-music');
        } else {
            stopSound('background-music');
        }
    });

    // Initialize floating elements
    document.addEventListener('DOMContentLoaded', () => {
        createFloatingElements();
        showStep(1);
    });

    // Enhanced final message
    function showFinalMessage() {
        const finalStep = document.querySelector('[data-step="24"]');
        if (finalStep) {
            const message = finalStep.querySelector('.instruction');
            message.classList.add('final-message');
            createEnhancedConfetti();
        }
    }

    // Update the existing event listeners
    document.getElementById('nextStep').addEventListener('click', () => {
        const currentStep = document.querySelector('.step.active');
        const nextStep = currentStep.nextElementSibling;

        if (nextStep) {
            currentStep.classList.remove('active');
            nextStep.classList.add('active');
            createEnhancedConfetti();

            if (nextStep.dataset.step === '24') {
                showFinalMessage();
            }
        }
    });

    document.getElementById('prevStep').addEventListener('click', () => {
        const currentStep = document.querySelector('.step.active');
        const prevStep = currentStep.previousElementSibling;

        if (prevStep) {
            currentStep.classList.remove('active');
            prevStep.classList.add('active');
        }
    });
}); 