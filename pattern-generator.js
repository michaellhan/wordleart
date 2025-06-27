// Advanced Pattern Generator for Wordle Art
class PatternGenerator {
    constructor(targetWord) {
        this.targetWord = targetWord;
        this.targetLetters = targetWord.split('');
        this.letterFrequency = this.calculateLetterFrequency();
    }

    calculateLetterFrequency() {
        const frequency = {};
        for (const letter of this.targetLetters) {
            frequency[letter] = (frequency[letter] || 0) + 1;
        }
        return frequency;
    }

    generateArtisticPattern() {
        // Generate different types of patterns based on the target word
        const patterns = [
            this.generateRevealPattern(),
            this.generateHighlightPattern(),
            this.generateSymmetricalPattern(),
            this.generateGradientPattern()
        ];

        // Return the pattern with the highest artistic score
        return patterns.reduce((best, current) => {
            return this.calculateArtisticScore(current) > this.calculateArtisticScore(best) ? current : best;
        });
    }

    generateRevealPattern() {
        // Pattern that gradually reveals the target word
        const pattern = [];
        
        for (let row = 0; row < 6; row++) {
            const rowPattern = [];
            for (let col = 0; col < 5; col++) {
                if (row === 0) {
                    // First row: all green to show the word
                    rowPattern.push('green');
                } else if (row === 1) {
                    // Second row: strategic yellows
                    rowPattern.push('yellow');
                } else if (row === 2) {
                    // Third row: mix of colors
                    rowPattern.push(col % 2 === 0 ? 'yellow' : 'gray');
                } else {
                    // Remaining rows: mostly gray with some highlights
                    const shouldHighlight = (row + col) % 3 === 0;
                    rowPattern.push(shouldHighlight ? 'yellow' : 'gray');
                }
            }
            pattern.push(rowPattern);
        }
        
        return pattern;
    }

    generateHighlightPattern() {
        // Pattern that highlights specific letters
        const pattern = [];
        const highlightPositions = this.findHighlightPositions();
        
        for (let row = 0; row < 6; row++) {
            const rowPattern = [];
            for (let col = 0; col < 5; col++) {
                if (highlightPositions.includes(col)) {
                    rowPattern.push('green');
                } else if (this.targetLetters.includes(this.targetLetters[col])) {
                    rowPattern.push('yellow');
                } else {
                    rowPattern.push('gray');
                }
            }
            pattern.push(rowPattern);
        }
        
        return pattern;
    }

    generateSymmetricalPattern() {
        // Create a symmetrical pattern
        const pattern = [];
        
        for (let row = 0; row < 6; row++) {
            const rowPattern = [];
            for (let col = 0; col < 5; col++) {
                const distanceFromCenter = Math.abs(col - 2);
                const rowFactor = row / 5;
                
                if (distanceFromCenter === 0 && row < 3) {
                    rowPattern.push('green');
                } else if (distanceFromCenter === 1 && row < 4) {
                    rowPattern.push('yellow');
                } else {
                    rowPattern.push('gray');
                }
            }
            pattern.push(rowPattern);
        }
        
        return pattern;
    }

    generateGradientPattern() {
        // Create a gradient-like pattern
        const pattern = [];
        
        for (let row = 0; row < 6; row++) {
            const rowPattern = [];
            for (let col = 0; col < 5; col++) {
                const intensity = (row + col) / 10;
                
                if (intensity > 0.8) {
                    rowPattern.push('green');
                } else if (intensity > 0.5) {
                    rowPattern.push('yellow');
                } else {
                    rowPattern.push('gray');
                }
            }
            pattern.push(rowPattern);
        }
        
        return pattern;
    }

    findHighlightPositions() {
        // Find positions to highlight based on letter frequency
        const positions = [];
        const uniqueLetters = [...new Set(this.targetLetters)];
        
        for (let i = 0; i < 5; i++) {
            const letter = this.targetLetters[i];
            const frequency = this.letterFrequency[letter];
            
            if (frequency > 1 || uniqueLetters.length <= 3) {
                positions.push(i);
            }
        }
        
        return positions.slice(0, 3); // Limit to 3 positions
    }

    calculateArtisticScore(pattern) {
        let score = 0;
        
        // Reward patterns with good color distribution
        const colorCounts = { green: 0, yellow: 0, gray: 0 };
        
        for (const row of pattern) {
            for (const color of row) {
                colorCounts[color]++;
            }
        }
        
        // Balance score
        const total = colorCounts.green + colorCounts.yellow + colorCounts.gray;
        const greenRatio = colorCounts.green / total;
        const yellowRatio = colorCounts.yellow / total;
        const grayRatio = colorCounts.gray / total;
        
        // Prefer patterns with some green, moderate yellow, and some gray
        if (greenRatio > 0.1 && greenRatio < 0.4) score += 10;
        if (yellowRatio > 0.2 && yellowRatio < 0.6) score += 10;
        if (grayRatio > 0.2) score += 5;
        
        // Reward patterns with interesting structure
        for (let row = 0; row < pattern.length - 1; row++) {
            const currentRow = pattern[row];
            const nextRow = pattern[row + 1];
            
            // Reward variation between rows
            const variation = this.calculateRowVariation(currentRow, nextRow);
            score += variation * 2;
        }
        
        return score;
    }

    calculateRowVariation(row1, row2) {
        let differences = 0;
        for (let i = 0; i < 5; i++) {
            if (row1[i] !== row2[i]) {
                differences++;
            }
        }
        return differences / 5;
    }

    generateCustomPattern(style = 'reveal') {
        switch (style) {
            case 'reveal':
                return this.generateRevealPattern();
            case 'highlight':
                return this.generateHighlightPattern();
            case 'symmetrical':
                return this.generateSymmetricalPattern();
            case 'gradient':
                return this.generateGradientPattern();
            default:
                return this.generateArtisticPattern();
        }
    }
}

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PatternGenerator;
} 