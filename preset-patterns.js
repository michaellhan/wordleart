// Preset Art Patterns for Wordle Art Generator
class PresetPatterns {
    constructor() {
        this.patterns = {
            tower: this.createTower()
        };
    }

    createTower() {
        return [
            ['gray', 'gray', 'green', 'gray', 'gray'],
            ['gray', 'green', 'green', 'green', 'gray'],
            ['gray', 'green', 'green', 'green', 'gray'],
            ['gray', 'green', 'green', 'green', 'gray'],
            ['gray', 'green', 'green', 'green', 'gray'],
            ['green', 'green', 'green', 'green', 'green']
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