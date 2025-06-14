document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const landingSection = document.getElementById('landing');
    const manualSection = document.getElementById('manual');
    const startButton = document.getElementById('startButton');
    const toggleModeButton = document.getElementById('toggleMode');
    const prevButton = document.getElementById('prevStep');
    const nextButton = document.getElementById('nextStep');
    const steps = document.querySelectorAll('.step');

    // State
    let currentStep = 1;
    let isReassemblyMode = false;

    // Initialize
    updateStepVisibility();
    updateNavigationButtons();

    // Event Listeners
    startButton.addEventListener('click', () => {
        landingSection.classList.remove('active');
        landingSection.classList.add('hidden');
        manualSection.classList.remove('hidden');
        manualSection.classList.add('active');
    });

    toggleModeButton.addEventListener('click', () => {
        isReassemblyMode = !isReassemblyMode;
        toggleModeButton.textContent = isReassemblyMode ?
            'Switch to Unboxing Mode' :
            'Switch to Reassembly Mode';

        // Reverse the order of steps in reassembly mode
        const stepsContainer = document.querySelector('.steps-container');
        const stepsArray = Array.from(steps);
        stepsArray.reverse().forEach(step => {
            stepsContainer.appendChild(step);
        });

        // Update step numbers
        steps.forEach((step, index) => {
            step.dataset.step = isReassemblyMode ?
                (steps.length - index).toString() :
                (index + 1).toString();
        });

        // Reset to first step
        currentStep = 1;
        updateStepVisibility();
        updateNavigationButtons();
    });

    prevButton.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepVisibility();
            updateNavigationButtons();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentStep < steps.length) {
            currentStep++;
            updateStepVisibility();
            updateNavigationButtons();
        }
    });

    // Helper Functions
    function updateStepVisibility() {
        steps.forEach(step => {
            const stepNumber = parseInt(step.dataset.step);
            if (stepNumber === currentStep) {
                step.style.display = 'block';
                // Add fade-in animation
                step.style.opacity = '0';
                setTimeout(() => {
                    step.style.opacity = '1';
                }, 50);
            } else {
                step.style.display = 'none';
            }
        });
    }

    function updateNavigationButtons() {
        prevButton.disabled = currentStep === 1;
        nextButton.disabled = currentStep === steps.length;
    }
}); 