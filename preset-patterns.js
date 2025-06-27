// Preset Art Patterns for Wordle Art Generator
class PresetPatterns {
    constructor() {
        this.patterns = {
            tower: this.createTower()
        };
    }

    createTower() {
        return [
            ['gray', 'gray', 'green', 'gray', 'gray'], // Row 1: Top
            ['gray', 'green', 'green', 'green', 'gray'], // Row 2: Upper section
            ['gray', 'green', 'green', 'green', 'gray'], // Row 3: Middle section
            ['gray', 'green', 'green', 'green', 'gray'], // Row 4: Lower section
            ['gray', 'green', 'green', 'green', 'gray'], // Row 5: Base section
            ['green', 'green', 'green', 'green', 'green']  // Row 6: Foundation
        ];
    }

    getPattern(name) {
        return this.patterns[name] || null;
    }

    getPatternNames() {
        return Object.keys(this.patterns);
    }

    getPatternDisplayName(name) {
        const displayNames = {
            tower: '🗼 Tower'
        };
        return displayNames[name] || name;
    }
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PresetPatterns;
} 