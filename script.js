// Wordle Art Generator - Main Script
class WordleArtGenerator {
    constructor() {
        this.wordList = [];
        this.targetWord = '';
        this.generatedWords = [];
        this.artPattern = [];
        this.targetPattern = [];
        this.patternGenerator = null;
        this.presetPatterns = null;
        this.patternEditor = null;
        this.selectedPreset = null;
        
        this.init();
    }

    async init() {
        await this.loadWordList();
        this.presetPatterns = new PresetPatterns();
        this.patternEditor = new PatternEditor();
        this.setupEventListeners();
        this.setupPresetButtons();
        this.setupCustomEditor();
    }

    async loadWordList() {
        try {
            const response = await fetch('words.txt');
            const text = await response.text();
            this.wordList = text.trim().split('\n').map(word => word.toLowerCase());
            console.log(`Loaded ${this.wordList.length} words`);
        } catch (error) {
            console.error('Error loading word list:', error);
            alert('Error loading word list. Please refresh the page.');
        }
    }

    setupEventListeners() {
        const input = document.getElementById('target-word');
        const generateBtn = document.getElementById('generate-btn');
        const customPatternBtn = document.getElementById('custom-pattern-btn');

        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.toLowerCase().replace(/[^a-z]/g, '');
            generateBtn.disabled = e.target.value.length !== 5;
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.target.value.length === 5) {
                this.generateArt();
            }
        });

        generateBtn.addEventListener('click', () => this.generateArt());

        customPatternBtn.addEventListener('click', () => {
            this.toggleCustomEditor();
        });
    }

    setupCustomEditor() {
        this.patternEditor.setPatternSelectedCallback((pattern) => {
            this.selectCustomPattern(pattern);
        });
    }

    toggleCustomEditor() {
        const container = document.getElementById('custom-editor-container');
        const isVisible = container.style.display !== 'none';
        
        if (isVisible) {
            container.style.display = 'none';
            container.innerHTML = '';
        } else {
            container.style.display = 'block';
            const editor = this.patternEditor.createEditor();
            container.appendChild(editor);
            window.patternEditor = this.patternEditor;
        }
    }

    selectCustomPattern(pattern) {
        // Clear preset selection
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        this.selectedPreset = 'custom';
        this.targetPattern = pattern;
        this.displayTargetPattern();
        
        // Hide custom editor
        document.getElementById('custom-editor-container').style.display = 'none';
    }

    setupPresetButtons() {
        const presetButtons = document.getElementById('preset-buttons');
        const patternNames = this.presetPatterns.getPatternNames();
        
        presetButtons.innerHTML = '';
        
        patternNames.forEach(name => {
            const button = document.createElement('button');
            button.className = 'preset-btn';
            button.textContent = this.presetPatterns.getPatternDisplayName(name);
            button.dataset.pattern = name;
            
            button.addEventListener('click', () => {
                this.selectPresetPattern(name);
            });
            
            presetButtons.appendChild(button);
        });
    }

    selectPresetPattern(patternName) {
        // Remove active class from all buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to selected button
        const selectedButton = document.querySelector(`[data-pattern="${patternName}"]`);
        if (selectedButton) {
            selectedButton.classList.add('active');
        }
        
        this.selectedPreset = patternName;
        this.targetPattern = this.presetPatterns.getPattern(patternName);
        
        // Show target pattern preview
        this.displayTargetPattern();
    }

    displayTargetPattern() {
        const targetPreview = document.getElementById('target-preview');
        if (!this.targetPattern) return;
        
        targetPreview.innerHTML = '';
        this.targetPattern.forEach((row, rowIndex) => {
            const wordRow = document.createElement('div');
            wordRow.className = 'word-row';
            
            row.forEach((color, colIndex) => {
                const square = document.createElement('div');
                square.className = `letter-square ${color}`;
                square.textContent = '?';
                wordRow.appendChild(square);
            });
            
            targetPreview.appendChild(wordRow);
        });
        
        targetPreview.style.display = 'grid';
    }

    async generateArt() {
        const input = document.getElementById('target-word');
        this.targetWord = input.value.toLowerCase();

        if (this.targetWord.length !== 5) {
            alert('Please enter a 5-letter word');
            return;
        }

        if (!this.targetPattern) {
            alert('Please select a preset pattern or create a custom one');
            return;
        }

        this.showLoading(true);
        
        // Use setTimeout to allow UI to update
        setTimeout(() => {
            this.generateWordSequence();
            this.showLoading(false);
            this.displayResults();
        }, 100);
    }

    generateWordSequence() {
        this.generatedWords = [];
        this.artPattern = [];

        // Initialize pattern generator for fallback
        this.patternGenerator = new PatternGenerator(this.targetWord);
        
        // Generate words that will create the desired pattern
        this.generatedWords = this.findOptimalWordSequence(this.targetPattern);
        
        // Generate the actual art pattern from the words
        this.artPattern = this.generateArtPattern(this.generatedWords);
    }

    findOptimalWordSequence(targetPattern) {
        const words = [];
        const usedWords = new Set();
        const gameState = {
            correctLetters: new Set(),
            misplacedLetters: new Set(),
            wrongLetters: new Set(),
            knownPositions: new Array(5).fill(null),
            impossiblePositions: Array(5).fill().map(() => new Set())
        };
        
        // Use advanced algorithm for high accuracy
        return this.findHighAccuracySequence(targetPattern, gameState);
    }

    findHighAccuracySequence(targetPattern, gameState) {
        const words = [];
        const usedWords = new Set();
        
        // Strategy: Find words that can achieve the target pattern with high precision
        for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
            const targetRow = targetPattern[rowIndex];
            const word = this.findOptimalWordForRow(targetRow, usedWords, gameState, rowIndex);
            words.push(word);
            usedWords.add(word);
            
            // Update game state
            this.updateGameState(word, gameState);
            
            // Always ensure realistic gameplay (no early wins)
            if (rowIndex < 5) {
                this.ensureNoWin(word, gameState, words);
            }
        }
        
        return words;
    }

    findOptimalWordForRow(targetRow, usedWords, gameState, rowIndex) {
        // Advanced word selection with multiple strategies
        const strategies = [
            () => this.findExactMatchWord(targetRow, usedWords, gameState),
            () => this.findHighScoringWord(targetRow, usedWords, gameState),
            () => this.findCompatibleWord(targetRow, usedWords, gameState),
            () => this.findFallbackWord(usedWords, gameState)
        ];
        
        for (const strategy of strategies) {
            const word = strategy();
            if (word && !usedWords.has(word)) {
                return word;
            }
        }
        
        // Ultimate fallback
        return this.wordList.find(word => !usedWords.has(word)) || this.wordList[0];
    }

    findExactMatchWord(targetRow, usedWords, gameState) {
        // Try to find a word that would produce exactly the target pattern
        const targetColors = targetRow.join('');
        
        for (const word of this.wordList) {
            if (usedWords.has(word)) continue;
            if (!this.isWordCompatible(word, gameState)) continue;
            
            const result = this.getWordleResult(word, this.targetWord);
            const resultColors = result.join('');
            
            if (resultColors === targetColors) {
                return word;
            }
        }
        
        return null;
    }

    findHighScoringWord(targetRow, usedWords, gameState) {
        let bestWord = null;
        let bestScore = -1;
        
        // Sample more words for better accuracy
        const sampleSize = Math.min(5000, this.wordList.length);
        const sampleWords = this.getRandomSample(this.wordList, sampleSize);
        
        for (const word of sampleWords) {
            if (usedWords.has(word)) continue;
            if (!this.isWordCompatible(word, gameState)) continue;
            
            const score = this.calculateAdvancedScore(word, targetRow, gameState);
            if (score > bestScore) {
                bestScore = score;
                bestWord = word;
            }
        }
        
        return bestWord;
    }

    findCompatibleWord(targetRow, usedWords, gameState) {
        // Find any compatible word that doesn't break the pattern
        for (const word of this.wordList) {
            if (usedWords.has(word)) continue;
            if (!this.isWordCompatible(word, gameState)) continue;
            
            const result = this.getWordleResult(word, this.targetWord);
            const compatibility = this.calculatePatternCompatibility(result, targetRow);
            
            if (compatibility > 0.3) { // At least 30% compatible
                return word;
            }
        }
        
        return null;
    }

    findFallbackWord(usedWords, gameState) {
        // Find any word that works with current game state
        for (const word of this.wordList) {
            if (usedWords.has(word)) continue;
            if (this.isWordCompatible(word, gameState)) {
                return word;
            }
        }
        
        return null;
    }

    calculateAdvancedScore(word, targetRow, gameState) {
        let score = 0;
        const result = this.getWordleResult(word, this.targetWord);
        
        // Exact color matches
        for (let i = 0; i < 5; i++) {
            if (result[i] === targetRow[i]) {
                score += 50; // High reward for exact matches
            }
        }
        
        // Pattern similarity
        const patternMatch = this.calculatePatternMatch(result, targetRow);
        score += patternMatch * 100;
        
        // Letter position optimization
        for (let i = 0; i < 5; i++) {
            const letter = word[i];
            const targetColor = targetRow[i];
            
            if (targetColor === 'green') {
                if (letter === this.targetWord[i]) {
                    score += 30;
                } else if (this.targetWord.includes(letter)) {
                    score += 10;
                }
            } else if (targetColor === 'yellow') {
                if (this.targetWord.includes(letter) && letter !== this.targetWord[i]) {
                    score += 25;
                }
            } else if (targetColor === 'gray') {
                if (!this.targetWord.includes(letter)) {
                    score += 20;
                }
            }
        }
        
        // Always prevent early wins
        const greenCount = result.filter(color => color === 'green').length;
        if (greenCount >= 4) {
            score -= 100;
        }
        
        return score;
    }

    calculatePatternCompatibility(actual, target) {
        let matches = 0;
        for (let i = 0; i < 5; i++) {
            if (actual[i] === target[i]) {
                matches++;
            }
        }
        return matches / 5;
    }

    updateGameState(word, gameState) {
        const result = this.getWordleResult(word, this.targetWord);
        
        for (let i = 0; i < 5; i++) {
            const letter = word[i];
            const color = result[i];
            
            if (color === 'green') {
                gameState.correctLetters.add(letter);
                gameState.knownPositions[i] = letter;
            } else if (color === 'yellow') {
                gameState.misplacedLetters.add(letter);
                gameState.impossiblePositions[i].add(letter);
            } else if (color === 'gray') {
                gameState.wrongLetters.add(letter);
            }
        }
    }

    ensureNoWin(word, gameState, words) {
        const result = this.getWordleResult(word, this.targetWord);
        const greenCount = result.filter(color => color === 'green').length;
        
        if (greenCount === 5) {
            const alternativeWord = this.findAlternativeWord(word, gameState);
            if (alternativeWord) {
                const wordIndex = words.length - 1;
                words[wordIndex] = alternativeWord;
            }
        }
    }

    findAlternativeWord(originalWord, gameState) {
        const originalLetters = originalWord.split('');
        
        for (const word of this.wordList) {
            if (word === originalWord) continue;
            
            const sharedLetters = originalLetters.filter(letter => word.includes(letter));
            if (sharedLetters.length >= 3) {
                const result = this.getWordleResult(word, this.targetWord);
                const greenCount = result.filter(color => color === 'green').length;
                
                if (greenCount < 5) {
                    return word;
                }
            }
        }
        
        return null;
    }

    isWordCompatible(word, gameState) {
        const letters = word.split('');
        
        // Check known positions
        for (let i = 0; i < 5; i++) {
            if (gameState.knownPositions[i] && letters[i] !== gameState.knownPositions[i]) {
                return false;
            }
        }
        
        // Check impossible positions
        for (let i = 0; i < 5; i++) {
            if (gameState.impossiblePositions[i].has(letters[i])) {
                return false;
            }
        }
        
        return true;
    }

    getRandomSample(array, size) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, size);
    }

    calculatePatternMatch(actual, target) {
        let matches = 0;
        for (let i = 0; i < 5; i++) {
            if (actual[i] === target[i]) {
                matches++;
            }
        }
        return matches / 5;
    }

    generateArtPattern(words) {
        const pattern = [];
        
        for (const word of words) {
            const row = this.getWordleResult(word, this.targetWord);
            pattern.push(row);
        }
        
        return pattern;
    }

    getWordleResult(guess, answer) {
        const result = [];
        const answerLetters = answer.split('');
        const guessLetters = guess.split('');
        
        // First pass: mark greens
        for (let i = 0; i < 5; i++) {
            if (guessLetters[i] === answerLetters[i]) {
                result[i] = 'green';
                answerLetters[i] = null; // Mark as used
            }
        }
        
        // Second pass: mark yellows and grays
        for (let i = 0; i < 5; i++) {
            if (result[i] === 'green') continue;
            
            const letter = guessLetters[i];
            const letterIndex = answerLetters.indexOf(letter);
            
            if (letterIndex !== -1) {
                result[i] = 'yellow';
                answerLetters[letterIndex] = null; // Mark as used
            } else {
                result[i] = 'gray';
            }
        }
        
        return result;
    }

    displayResults() {
        const resultsSection = document.getElementById('results');
        const wordSequence = document.getElementById('word-sequence');
        const artPreview = document.getElementById('art-preview');
        const accuracy = document.getElementById('accuracy');
        const wordCount = document.getElementById('word-count');
        const difficulty = document.getElementById('difficulty');
        
        // Display word sequence
        wordSequence.innerHTML = '';
        this.generatedWords.forEach((word, index) => {
            const wordItem = document.createElement('div');
            wordItem.className = 'word-item';
            wordItem.textContent = `${index + 1}. ${word.toUpperCase()}`;
            wordSequence.appendChild(wordItem);
        });
        
        // Display art preview
        artPreview.innerHTML = '';
        this.artPattern.forEach((row, rowIndex) => {
            const wordRow = document.createElement('div');
            wordRow.className = 'word-row';
            
            row.forEach((color, colIndex) => {
                const square = document.createElement('div');
                square.className = `letter-square ${color}`;
                square.textContent = this.generatedWords[rowIndex][colIndex].toUpperCase();
                wordRow.appendChild(square);
            });
            
            artPreview.appendChild(wordRow);
        });
        
        // Update stats
        const accuracyScore = this.calculateAccuracy();
        accuracy.textContent = `${accuracyScore}%`;
        wordCount.textContent = this.generatedWords.length;
        difficulty.textContent = this.calculateDifficulty();
        
        resultsSection.style.display = 'block';
    }

    calculateAccuracy() {
        let totalSquares = 0;
        let correctSquares = 0;
        
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 5; j++) {
                totalSquares++;
                if (this.artPattern[i][j] === this.targetPattern[i][j]) {
                    correctSquares++;
                }
            }
        }
        
        return Math.round((correctSquares / totalSquares) * 100);
    }

    calculateDifficulty() {
        const accuracy = this.calculateAccuracy();
        const greenSquares = this.artPattern.flat().filter(color => color === 'green').length;
        
        if (accuracy > 90) {
            return 'Perfect';
        } else if (accuracy > 80) {
            return 'Excellent';
        } else if (accuracy > 70) {
            return 'Good';
        } else if (accuracy > 50) {
            return 'Fair';
        } else {
            return 'Challenging';
        }
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const results = document.getElementById('results');
        const generateBtn = document.getElementById('generate-btn');
        
        if (show) {
            loading.style.display = 'block';
            results.style.display = 'none';
            generateBtn.disabled = true;
        } else {
            loading.style.display = 'none';
            generateBtn.disabled = false;
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new WordleArtGenerator();
}); 