// Performance Page Application Module
import { ConfigManager } from './config-manager.js';
import { SEOManager } from './seo-manager.js';
import { ThemeManager } from './theme-manager.js';
import { LoadingManager } from './loading-manager.js';
import { HeaderManager } from './header-manager.js';
import { FooterManager } from './footer-manager.js';
import { PerfPageManager } from './perf-page-manager.js';

class PerfApp {
    constructor() {
        this.configManager = new ConfigManager();
        this.seoManager = new SEOManager();
        this.themeManager = new ThemeManager();
        this.loadingManager = new LoadingManager();
        this.headerManager = new HeaderManager();
        this.footerManager = new FooterManager();
        this.perfPageManager = new PerfPageManager();
    }

    async init() {
        try {
            this.themeManager.init();
            const config = await this.configManager.loadConfig();
            if (!config || !config.performance_page) {
                console.error("Performance page configuration is missing.");
                this.loadingManager.hideLoadingScreen(false);
                return;
            }

            this.seoManager.updateSEOTags(config, 'performance_page');
            this.headerManager.updateHeaderSection(config, 'performance_page');
            this.perfPageManager.updatePageContent(config.performance_page);
            this.footerManager.updateFooterSection(config); // Reuses main footer config
            this.loadingManager.hideLoadingScreen();
        } catch (error) {
            console.error('Error initializing performance page:', error);
            this.loadingManager.hideLoadingScreen(false);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new PerfApp().init());

