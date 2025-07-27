// Calculators Page Module
import { ThemeManager } from './theme-manager.js';
import { LoadingManager } from './loading-manager.js';

class CalculatorApp {
    constructor() {
        this.themeManager = new ThemeManager();
        this.loadingManager = new LoadingManager();
    }

    init() {
        this.themeManager.init();
        this.setupTabs();
        this.setupWorkloadCalculator();
        this.setupThroughputCalculator();
        this.loadingManager.hideLoadingScreen();
    }

    setupTabs() {
        const tabLinks = document.querySelectorAll('.tab-link');
        const tabContents = document.querySelectorAll('.tab-content');

        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                const tabId = link.dataset.tab;

                // Update active tab link
                tabLinks.forEach(item => item.classList.remove('active'));
                link.classList.add('active');

                // Update active tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    setupWorkloadCalculator() {
        const form = document.getElementById('workload-form');
        const resultBox = document.getElementById('workload-result');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const throughput = parseFloat(document.getElementById('throughput-input').value);
            const responseTimeMs = parseFloat(document.getElementById('response-time-input').value);

            if (isNaN(throughput) || isNaN(responseTimeMs)) {
                resultBox.innerHTML = `<p>Please enter valid numbers.</p>`;
                return;
            }

            const responseTimeSec = responseTimeMs / 1000;
            const concurrentUsers = throughput * responseTimeSec;

            resultBox.innerHTML = `
                <p><strong>Estimated Concurrent Users (L):</strong> ${concurrentUsers.toFixed(2)}</p>
            `;
        });
    }

    setupThroughputCalculator() {
        const form = document.getElementById('throughput-form');
        const resultBox = document.getElementById('throughput-result');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const totalRequests = parseFloat(document.getElementById('total-requests-input').value);
            const timePeriod = parseFloat(document.getElementById('time-period-input').value);

            if (isNaN(totalRequests) || isNaN(timePeriod) || timePeriod === 0) {
                resultBox.innerHTML = `<p>Please enter valid numbers, and ensure time period is not zero.</p>`;
                return;
            }

            const throughput = totalRequests / timePeriod;

            resultBox.innerHTML = `
                <p><strong>Calculated Throughput (λ):</strong> ${throughput.toFixed(2)} requests/sec</p>
            `;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new CalculatorApp().init());

