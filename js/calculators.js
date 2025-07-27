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
        this.setupAvailabilityCalculator();
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
    setupAvailabilityCalculator() {
        const form = document.getElementById('availability-form');
        const resultBox = document.getElementById('availability-result');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const uptimePercentage = parseFloat(document.getElementById('uptime-percentage-input').value);

            if (isNaN(uptimePercentage) || uptimePercentage < 0 || uptimePercentage > 100) {
                resultBox.innerHTML = `<p>Please enter a valid percentage between 0 and 100.</p>`;
                return;
            }

            const downtimePercentage = 100 - uptimePercentage;
            const downtimeRatio = downtimePercentage / 100;

            const secondsIn = {
                day: 24 * 60 * 60,
                week: 7 * 24 * 60 * 60,
                month: 30.44 * 24 * 60 * 60, // Average month
                year: 365.25 * 24 * 60 * 60, // Average year
            };

            const downtime = {
                day: this.formatDowntime(secondsIn.day * downtimeRatio),
                week: this.formatDowntime(secondsIn.week * downtimeRatio),
                month: this.formatDowntime(secondsIn.month * downtimeRatio),
                year: this.formatDowntime(secondsIn.year * downtimeRatio),
            };

            resultBox.innerHTML = `
                <p>An uptime of <strong>${uptimePercentage}%</strong> allows for the following maximum downtime:</p>
                <ul class="result-list">
                    <li><strong>Per Day:</strong> ${downtime.day}</li>
                    <li><strong>Per Week:</strong> ${downtime.week}</li>
                    <li><strong>Per Month:</strong> ${downtime.month}</li>
                    <li><strong>Per Year:</strong> ${downtime.year}</li>
                </ul>
            `;
        });
    }

    formatDowntime(totalSeconds) {
        if (totalSeconds < 1) return `${totalSeconds.toFixed(3)} seconds`;
        if (totalSeconds < 60) return `${totalSeconds.toFixed(2)} seconds`;

        const days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        let result = [];
        if (days > 0) result.push(`${days} day${days > 1 ? 's' : ''}`);
        if (hours > 0) result.push(`${hours} hour${hours > 1 ? 's' : ''}`);
        if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
        if (seconds > 0) result.push(`${Math.round(seconds)} second${Math.round(seconds) !== 1 ? 's' : ''}`);

        return result.length > 0 ? result.join(', ') : 'less than a second';
    }
}

document.addEventListener('DOMContentLoaded', () => new CalculatorApp().init());

