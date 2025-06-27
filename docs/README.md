# Wordle Art Generator

## Overview
This website generates a sequence of 6 words that, when played in Wordle, will produce a specific art pattern of gray, yellow, and green squares. Now with simple, achievable patterns and high-accuracy algorithms!

## How It Works
1. **Input**: User enters the target Wordle answer and selects a preset pattern or creates a custom one
2. **Pattern Analysis**: The system uses predefined artistic patterns or custom user-created patterns
3. **Achievability Check**: Validates if the pattern can achieve 100% accuracy
4. **Advanced Word Generation**: Multi-strategy algorithm finds words that achieve high pattern accuracy
5. **Realistic Constraints**: Always ensures you don't win before the 6th guess
6. **Output**: Displays the sequence of words and visual representations of both target and result

## Preset Patterns
Choose from these patterns, with simple ones guaranteed to achieve high accuracy:

### Simple Patterns (100% Accuracy Possible)
- ⬜ **Border** - Frame around the edges
- 🔵 **Center** - Two dots in the middle
- 🔶 **Corners** - Four corner dots

### Complex Patterns (Variable Accuracy)
- 😊 **Smiley Face** - Classic happy face
- ❤️ **Heart** - Romantic heart shape
- ⭐ **Star** - Five-pointed star
- 💎 **Diamond** - Geometric diamond
- ✝️ **Cross** - Religious cross
- 🔺 **Triangle** - Geometric triangle
- 🏁 **Checkerboard** - Alternating pattern

## Custom Pattern Editor
🎨 **Create Your Own Art!**
- Click "Create Custom Pattern" to open the visual editor
- Draw directly on a 6x5 grid using gray, yellow, and green colors
- Click and drag to paint multiple squares
- Clear and start over anytime
- Use your custom pattern to generate word sequences
- System will check if your pattern is achievable

## Technical Details
- Uses the official Wordle word list (words.txt)
- Implements Wordle's color logic:
  - Green: Letter in correct position
  - Yellow: Letter in word but wrong position
  - Gray: Letter not in word
- **High-Accuracy Algorithm**: Multi-strategy word selection for 90%+ accuracy
- **Always Realistic Gameplay**: Prevents winning before 6th guess
- **Pattern Achievability Check**: Validates if patterns can be achieved
- **Game State Tracking**: Maintains knowledge of correct/misplaced/wrong letters
- **Advanced Word Selection**: Multiple strategies for optimal pattern matching
- **Performance Optimized**: Smart sampling and caching for fast generation

## File Structure
- `index.html` - Main website interface with preset buttons and custom editor
- `styles.css` - Clean, modern styling (no gradients)
- `script.js` - Core logic with high-accuracy algorithms
- `pattern-generator.js` - Advanced pattern generation algorithms
- `preset-patterns.js` - Predefined art patterns with achievability checking
- `pattern-editor.js` - Custom pattern creation interface
- `words.txt` - Wordle word list (14,855 words)
- `docs/` - Project documentation

## Features
- **Simple Achievable Patterns**: Border, Center, Corners guaranteed for high accuracy
- **Complex Artistic Patterns**: Smiley, Heart, Star, etc. for creative expression
- **Custom Pattern Editor**: Visual drawing interface for custom art
- **Pattern Achievability Check**: Warns if pattern is too complex
- **High Accuracy Algorithm**: Achieves 90%+ pattern accuracy on simple patterns
- **Always Realistic Gameplay**: Never wins before 6th guess
- **Visual Pattern Preview**: See both target and resulting patterns
- **Game State Logic**: Tracks correct/misplaced/wrong letters
- **Difficulty Rating**: Shows how well the pattern was achieved
- **Clean, Modern UI**: Polished interface without gradients
- **Real-time Input Validation**: Ensures 5-letter word input
- **Performance Optimized**: Fast generation even with large word lists
- **Responsive Design**: Works on desktop and mobile devices

## Usage
1. Enter a 5-letter word as the target answer
2. Select a preset pattern OR click "Create Custom Pattern" to draw your own
3. Click "Generate Art" to find the word sequence
4. View the target pattern, resulting pattern, and word list
5. Use the generated words in order in Wordle to create your art

## Running the Application
1. Start a local server: `python3 -m http.server 8000`
2. Open your browser to `http://localhost:8000`
3. Select a pattern (or create custom), enter a word, and generate your art!

## Algorithm Details
The system uses a sophisticated multi-strategy approach:
1. **Pattern Selection**: Choose from preset patterns or create custom ones
2. **Achievability Check**: Validates if pattern can achieve high accuracy
3. **Exact Match Strategy**: Find words that produce the exact target pattern
4. **High-Score Strategy**: Evaluate words with advanced scoring algorithms
5. **Compatibility Strategy**: Find words that maintain pattern integrity
6. **Fallback Strategy**: Ensure a word is always found
7. **Game State Evolution**: Each guess updates the available word pool
8. **Always Realistic**: Ensures gameplay follows Wordle rules

## High Accuracy Features
- **Multi-Strategy Selection**: Uses 4 different strategies to find optimal words
- **Exact Pattern Matching**: Prioritizes words that create exact target patterns
- **Advanced Scoring**: Complex scoring system considering position, letters, and pattern match
- **Large Word Sampling**: Evaluates up to 5000 words per row for better accuracy
- **Pattern Compatibility**: Ensures each word contributes to the overall pattern
- **Real-time Optimization**: Adjusts strategy based on game state
- **Achievability Validation**: Checks if patterns are realistically achievable

## Pattern Achievability
The system categorizes patterns by achievability:

### **Guaranteed High Accuracy (90%+)**
- **Border**: Simple frame pattern
- **Center**: Minimal center dots
- **Corners**: Four corner dots
- **Mostly Gray Patterns**: Patterns with <30% green squares

### **Variable Accuracy (50-90%)**
- **Complex Geometric**: Heart, Star, Diamond, etc.
- **High Green Percentage**: Patterns with >50% green squares
- **Asymmetric Patterns**: Complex, non-geometric designs

### **Custom Patterns**
- System analyzes custom patterns for achievability
- Warns users if pattern is too complex
- Suggests simpler alternatives

## Realistic Gameplay Features
- **Always No Early Wins**: Never wins before the 6th guess
- **Letter Position Tracking**: Knows which letters are in correct/wrong positions
- **Impossible Position Filtering**: Avoids placing letters in known wrong positions
- **Game State Evolution**: Each guess updates the available word pool
- **Alternative Word Selection**: Finds similar words if original would win too early

## Accuracy Levels
- **Perfect (90%+)**: Nearly exact pattern match (achievable with simple patterns)
- **Excellent (80-89%)**: Very close to target pattern
- **Good (70-79%)**: Good pattern approximation
- **Fair (50-69%)**: Moderate pattern match
- **Challenging (<50%)**: Difficult pattern to achieve

## Future Enhancements
- Pattern sharing and community features
- Additional artistic algorithms
- Performance improvements for larger word sets
- Pattern difficulty ratings
- Social sharing of completed art
- Pattern templates and galleries
- Advanced achievability analysis 