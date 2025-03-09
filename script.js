// Initialize variables
const passwordInput = document.getElementById('password');
const strengthBar = document.getElementById('strengthBar');
const strengthLabel = document.getElementById('strengthLabel');
const tipText = document.getElementById('tipText');
const toggleVisibility = document.getElementById('toggleVisibility');
const generatePasswordBtn = document.getElementById('generatePassword');
const copyPasswordBtn = document.getElementById('copyPassword');
const configureRulesBtn = document.getElementById('configureRules');
const strengthChartCtx = document.getElementById('strengthChart').getContext('2d');

// Configuration
const securityTips = [
    "Use a unique password for each account",
    "Enable two-factor authentication",
    "Change passwords every 90 days",
    "Avoid using personal information",
    "Use a password manager"
];

const passwordRules = {
    minLength: 8,
    maxLength: 32,
    requireUpper: true,
    requireLower: true,
    requireNumber: true,
    requireSpecial: true
};

let strengthHistory = [];
let currentTipIndex = 0;

// Initialize Chart.js
const strengthChart = new Chart(strengthChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Password Strength',
            data: [],
            borderColor: '#1565c0',
            backgroundColor: 'rgba(21, 101, 192, 0.2)',
            borderWidth: 2,
            pointRadius: 5,
            pointBackgroundColor: '#1565c0'
        }]
    },
    options: {
        scales: {
            y: {
                min: 0,
                max: 100
            }
        },
        responsive: true,
        maintainAspectRatio: false
    }
});

// Event Listeners
passwordInput.addEventListener('input', updateStrength);
toggleVisibility.addEventListener('click', togglePasswordVisibility);
generatePasswordBtn.addEventListener('click', generatePassword);
copyPasswordBtn.addEventListener('click', copyToClipboard);
configureRulesBtn.addEventListener('click', configureRules);

// Initialize security tips
showNextTip();
setInterval(showNextTip, 10000);

function updateStrength() {
    const password = passwordInput.value;
    const { strength, score, criteria } = assessPasswordStrength(password);
    
    // Update strength meter
    strengthBar.style.width = `${score}%`;
    strengthLabel.textContent = `Strength: ${score}% (${strength.replace('-', ' ')})`;
    
    // Update strength level styling
    strengthBar.parentElement.className = `strength-meter ${strength}`;
    strengthLabel.className = `strength-label ${strength}`;
    
    // Update criteria indicators
    updateCriteriaIndicators(criteria);
    
    // Update strength history
    updateStrengthHistory(score);
}

function assessPasswordStrength(password) {
    const criteria = {
        length: password.length >= passwordRules.minLength,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };

    let score = 0;
    score += criteria.length ? 20 : 0;
    score += criteria.upper ? 20 : 0;
    score += criteria.lower ? 20 : 0;
    score += criteria.number ? 20 : 0;
    score += criteria.special ? 20 : 0;

    // Additional scoring
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    if (new Set(password).size >= password.length * 0.75) score += 10;

    // Determine strength level
    let strength;
    if (score < 40) strength = 'weak';
    else if (score < 70) strength = 'moderate';
    else if (score < 90) strength = 'strong';
    else strength = 'very-strong';

    return { strength, score: Math.min(score, 100), criteria };
}

function updateCriteriaIndicators(criteria) {
    document.getElementById('lengthCriterion').style.color = criteria.length ? '#2e7d32' : '#666';
    document.getElementById('upperCriterion').style.color = criteria.upper ? '#2e7d32' : '#666';
    document.getElementById('lowerCriterion').style.color = criteria.lower ? '#2e7d32' : '#666';
    document.getElementById('numberCriterion').style.color = criteria.number ? '#2e7d32' : '#666';
    document.getElementById('specialCriterion').style.color = criteria.special ? '#2e7d32' : '#666';
}

function updateStrengthHistory(score) {
    strengthHistory.push(score);
    if (strengthHistory.length > 10) strengthHistory.shift();
    
    // Update chart
    strengthChart.data.labels = Array.from({length: strengthHistory.length}, (_, i) => i + 1);
    strengthChart.data.datasets[0].data = strengthHistory;
    strengthChart.update();
}

function togglePasswordVisibility() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    toggleVisibility.textContent = type === 'password' ? 'Show' : 'Hide';
}

function generatePassword() {
    const length = Math.floor(Math.random() * (16 - 12 + 1)) + 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    passwordInput.value = password;
    updateStrength();
}

function copyToClipboard() {
    const password = passwordInput.value;
    if (password) {
        navigator.clipboard.writeText(password)
            .then(() => alert('Password copied to clipboard!'))
            .catch(() => alert('Failed to copy password'));
    }
}

function configureRules() {
    // Implementation for rule configuration
    alert('Rule configuration coming soon!');
}

function showNextTip() {
    tipText.textContent = securityTips[currentTipIndex];
    currentTipIndex = (currentTipIndex + 1) % securityTips.length;
}
