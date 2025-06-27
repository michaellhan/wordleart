// Custom Pattern Editor for Wordle Art Generator
class PatternEditor {
    constructor() {
        this.currentColor = 'gray';
        this.pattern = this.createEmptyPattern();
        this.isDrawing = false;
        this.editorElement = null;
    }

    createEmptyPattern() {
        return Array(6).fill().map(() => Array(5).fill('gray'));
    }

    createEditor() {
        const editor = document.createElement('div');
        editor.className = 'pattern-editor';
        editor.innerHTML = `
            <div class="editor-header">
                <h3>Custom Pattern Editor</h3>
                <div class="color-picker">
                    <button class="color-btn gray active" data-color="gray">Gray</button>
                    <button class="color-btn yellow" data-color="yellow">Yellow</button>
                    <button class="color-btn green" data-color="green">Green</button>
                </div>
            </div>
            <div class="editor-grid" id="editor-grid"></div>
            <div class="editor-controls">
                <button class="btn btn-secondary" id="clear-pattern">Clear</button>
                <button class="btn btn-primary" id="use-pattern">Use This Pattern</button>
            </div>
        `;

        this.editorElement = editor;
        this.setupEditorEvents();
        this.renderGrid();
        return editor;
    }

    setupEditorEvents() {
        const colorBtns = this.editorElement.querySelectorAll('.color-btn');
        const clearBtn = this.editorElement.querySelector('#clear-pattern');
        const useBtn = this.editorElement.querySelector('#use-pattern');

        colorBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                colorBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentColor = btn.dataset.color;
            });
        });

        clearBtn.addEventListener('click', () => {
            this.pattern = this.createEmptyPattern();
            this.renderGrid();
        });

        useBtn.addEventListener('click', () => {
            this.onPatternSelected(this.pattern);
        });
    }

    renderGrid() {
        const grid = this.editorElement.querySelector('#editor-grid');
        grid.innerHTML = '';

        for (let row = 0; row < 6; row++) {
            const rowElement = document.createElement('div');
            rowElement.className = 'editor-row';

            for (let col = 0; col < 5; col++) {
                const cell = document.createElement('div');
                cell.className = `editor-cell ${this.pattern[row][col]}`;
                cell.dataset.row = row;
                cell.dataset.col = col;

                cell.addEventListener('mousedown', (e) => {
                    this.isDrawing = true;
                    this.paintCell(row, col);
                });

                cell.addEventListener('mouseenter', (e) => {
                    if (this.isDrawing) {
                        this.paintCell(row, col);
                    }
                });

                rowElement.appendChild(cell);
            }

            grid.appendChild(rowElement);
        }
    }

    paintCell(row, col) {
        this.pattern[row][col] = this.currentColor;
        const cell = this.editorElement.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.className = `editor-cell ${this.currentColor}`;
    }

    onPatternSelected(pattern) {
        // This will be set by the main script
        if (this.patternSelectedCallback) {
            this.patternSelectedCallback(pattern);
        }
    }

    setPatternSelectedCallback(callback) {
        this.patternSelectedCallback = callback;
    }

    // Stop drawing when mouse leaves the grid
    stopDrawing() {
        this.isDrawing = false;
    }
}

// Add event listeners for mouse up outside the grid
document.addEventListener('mouseup', () => {
    if (window.patternEditor) {
        window.patternEditor.stopDrawing();
    }
});

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PatternEditor;
} 