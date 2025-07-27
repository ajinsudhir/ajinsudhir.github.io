// Performance Page Manager Module
export class PerfPageManager {
    updatePageContent(config) {
        this.updateIntroSection(config.intro);
        this.updateConceptsSection(config.concepts);
        this.updateToolsSection(config.tools);
        this.updateCaseStudiesSection(config.case_studies);
    }

    updateIntroSection(introConfig) {
        const section = document.querySelector('.perf-intro');
        if (!section || !introConfig) return;

        const titleEl = section.querySelector('h2');
        const contentEl = section.querySelector('.content');

        if (titleEl) titleEl.textContent = introConfig.title || '';
        if (contentEl) {
            contentEl.innerHTML = introConfig.paragraphs.map(p => `<p>${p}</p>`).join('');
        }
    }

    updateConceptsSection(conceptsConfig) {
        const section = document.querySelector('.perf-concepts');
        if (!section || !conceptsConfig) return;

        const titleEl = section.querySelector('h2');
        if (titleEl) titleEl.textContent = conceptsConfig.title || '';

        const gridEl = section.querySelector('.concepts-grid');
        if (!gridEl) return;

        gridEl.innerHTML = '';
        const fragment = document.createDocumentFragment();

        conceptsConfig.items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'concept-item';
            itemEl.innerHTML = `
                <h3>${item.name}</h3>
                <p>${item.description}</p>
            `;
            fragment.appendChild(itemEl);
        });

        gridEl.appendChild(fragment);
    }

    updateToolsSection(toolsConfig) {
        const section = document.querySelector('.perf-tools');
        if (!section || !toolsConfig) return;

        const titleEl = section.querySelector('h2');
        if (titleEl) titleEl.textContent = toolsConfig.title || '';

        const gridEl = section.querySelector('.skills-grid');
        if (!gridEl) return;

        gridEl.innerHTML = '';
        const fragment = document.createDocumentFragment();

        toolsConfig.categories.forEach(category => {
            const categoryDiv = this.createToolCategory(category);
            fragment.appendChild(categoryDiv);
        });

        gridEl.appendChild(fragment);
    }

    createToolCategory(category) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category'; // Reuse style

        const itemsHtml = category.items.map(item => `<li>${item}</li>`).join('');

        categoryDiv.innerHTML = `
            <h3>${category.name}</h3>
            <ul>
                ${itemsHtml}
            </ul>
        `;

        return categoryDiv;
    }
    updateCaseStudiesSection(caseStudiesConfig) {
        const section = document.querySelector('.perf-case-studies');
        if (!section || !caseStudiesConfig) return;

        const titleEl = section.querySelector('h2');
        if (titleEl) titleEl.textContent = caseStudiesConfig.title || '';

        const containerEl = section.querySelector('.case-studies-container');
        if (!containerEl) return;

        containerEl.innerHTML = '';
        const fragment = document.createDocumentFragment();

        caseStudiesConfig.items.forEach(item => {
            const itemEl = this.createCaseStudyItem(item);
            fragment.appendChild(itemEl);
        });

        containerEl.appendChild(fragment);
    }

    createCaseStudyItem(item) {
        const itemEl = document.createElement('div');
        itemEl.className = 'case-study-item';

        const resultsHtml = item.results
            ? `<ul class="results-list">${item.results.map(res => `<li>${res}</li>`).join('')}</ul>`
            : '';

        const linkHtml = item.link
            ? `<a href="${item.link.url}" class="read-more-link" target="_blank" rel="noopener noreferrer">${item.link.text || 'Read More'} →</a>`
            : '';

        itemEl.innerHTML = `
            <h3>${item.title}</h3>
            <p class="summary">${item.summary}</p>
            ${resultsHtml}
            ${linkHtml}
        `;

        return itemEl;
    }
}

