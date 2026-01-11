# Gap Analysis & Atomic Implementation Plan

## Custom Equations Prototype vs Design Framework

---

## Executive Summary

The current prototype provides a solid visual foundation but lacks significant functional depth specified in the design framework. Key gaps include: no actual equation parsing, hardcoded parameters, missing accessibility features, incomplete mobile support, and no real export functionality.

**Overall Completion: ~35%**

---

## 1. Gap Analysis by Category

### 1.1 Equation Input & Parsing

| Spec (Framework) | Current (Prototype) | Gap | Priority |
|------------------|---------------------|-----|----------|
| Syntax highlighting by token type | Plain textarea, no highlighting | **MISSING** | P0 |
| Auto-complete for function names | Not implemented | **MISSING** | P1 |
| Bracket matching with highlight | Not implemented | **MISSING** | P1 |
| Real-time validation feedback | Static "valid" message only | **MISSING** | P0 |
| Multi-line support | Basic textarea resize | Partial | P2 |
| Actual equation parsing | Hardcoded rose curve only | **MISSING** | P0 |
| Error states (typing, soft, hard) | Not implemented | **MISSING** | P0 |
| Screen reader announces validation | No ARIA attributes | **MISSING** | P1 |

**Gap Score: 15%**

### 1.2 Visualization Canvas

| Spec (Framework) | Current (Prototype) | Gap | Priority |
|------------------|---------------------|-----|----------|
| Real-time updates from equation | Hardcoded formula | **MISSING** | P0 |
| Scroll to zoom (cursor-centered) | Zooms to center, not cursor | Partial | P2 |
| Click-drag to pan | Implemented | ✅ | - |
| Double-click to reset view | Not implemented | **MISSING** | P2 |
| Pinch-to-zoom on touch | Not implemented | **MISSING** | P1 |
| 60fps for parameter changes | Achieved | ✅ | - |
| < 100ms initial render | Achieved | ✅ | - |
| Progressive rendering for complex | Not implemented | **MISSING** | P2 |
| "Calculating..." fallback | Not implemented | **MISSING** | P1 |
| WebGL rendering | Canvas 2D only | Partial | P2 |

**Gap Score: 50%**

### 1.3 Parameter System

| Spec (Framework) | Current (Prototype) | Gap | Priority |
|------------------|---------------------|-----|----------|
| Auto-detect variables from equation | Hardcoded a, b, n | **MISSING** | P0 |
| Intelligent defaults by variable name | Not implemented | **MISSING** | P1 |
| Direct value input (click number) | Display only, not editable | **MISSING** | P1 |
| Fine control (Shift for 10x precision) | Not implemented | **MISSING** | P2 |
| Range adjustment (expandable) | Button exists, no functionality | **MISSING** | P1 |
| Reset to default (double-click) | Not implemented | **MISSING** | P2 |
| Per-parameter animation toggle | UI exists, partial logic | Partial | P1 |
| Preset values | Not implemented | **MISSING** | P2 |

**Gap Score: 25%**

### 1.4 Template Gallery

| Spec (Framework) | Current (Prototype) | Gap | Priority |
|------------------|---------------------|-----|----------|
| Grid view with previews | Implemented | ✅ | - |
| Animated preview on hover | Static previews only | **MISSING** | P2 |
| Click inserts equation | Partial (updates text, not parsed) | Partial | P1 |
| Parameters auto-populate | Not implemented | **MISSING** | P1 |
| Categories (Spirals, Waves, etc.) | No categories, flat list | **MISSING** | P2 |
| Rating/usage display | Not implemented | **MISSING** | P3 |
| User Saved templates | Not implemented | **MISSING** | P2 |
| Search/filter | Not implemented | **MISSING** | P2 |

**Gap Score: 40%**

### 1.5 Function Library

| Spec (Framework) | Current (Prototype) | Gap | Priority |
|------------------|---------------------|-----|----------|
| Categorized functions | Implemented | ✅ | - |
| Click to insert at cursor | Implemented | ✅ | - |
| Hover for description + example | Tooltip exists, no descriptions | **MISSING** | P1 |
| Hyperbolic functions (sinh, cosh, tanh) | Not included | **MISSING** | P2 |
| Comparison operators (<, >, =) | Not included | **MISSING** | P2 |
| random(), noise() functions | Not included | **MISSING** | P2 |
| Custom constants | Not implemented | **MISSING** | P3 |

**Gap Score: 60%**

### 1.6 Animation System

| Spec (Framework) | Current (Prototype) | Gap | Priority |
|------------------|---------------------|-----|----------|
| Play/Pause button | Implemented | ✅ | - |
| Timeline scrubber | Implemented | ✅ | - |
| Speed control (0.25x - 4x) | Not implemented | **MISSING** | P1 |
| Loop toggle | Always loops, no toggle | **MISSING** | P2 |
| Frame-by-frame stepping | Not implemented | **MISSING** | P2 |
| Multiple param animation | UI exists, only 'n' animates | **MISSING** | P1 |

**Gap Score: 50%**

### 1.7 Error Handling

| Spec (Framework) | Current (Prototype) | Gap | Priority |
|------------------|---------------------|-----|----------|
| Warning level (yellow indicator) | Not implemented | **MISSING** | P1 |
| Soft error (gray out, cursor hint) | Not implemented | **MISSING** | P0 |
| Hard error (red underline, suggestion) | Not implemented | **MISSING** | P0 |
| Recovery (immediate transition) | Not implemented | **MISSING** | P0 |
| "Did you mean X?" suggestions | Not implemented | **MISSING** | P1 |
| Keep last valid visualization | Not implemented | **MISSING** | P0 |
| Auto-save every change | Not implemented | **MISSING** | P1 |

**Gap Score: 0%**

### 1.8 Accessibility

| Spec (Framework) | Current (Prototype) | Gap | Priority |
|------------------|---------------------|-----|----------|
| 4.5:1 color contrast | Not verified | Needs audit | P1 |
| Focus indicators on all elements | Partial (some missing) | Partial | P1 |
| Full ARIA labeling | None implemented | **MISSING** | P0 |
| Keyboard navigation | Partial (shortcuts only) | Partial | P1 |
| Focus equation input (/ or F2) | Not implemented | **MISSING** | P1 |
| Open template gallery (T) | Not implemented | **MISSING** | P2 |
| Export (Ctrl/Cmd + E) | Not implemented | **MISSING** | P2 |
| Undo/Redo (Ctrl+Z/Ctrl+Shift+Z) | Not implemented | **MISSING** | P1 |
| prefers-reduced-motion | Not implemented | **MISSING** | P1 |
| High contrast mode | Not implemented | **MISSING** | P2 |
| 200% zoom support | Not tested | Needs audit | P2 |

**Gap Score: 20%**

### 1.9 Responsive / Mobile

| Spec (Framework) | Current (Prototype) | Gap | Priority |
|------------------|---------------------|-----|----------|
| Desktop 3-column | Implemented | ✅ | - |
| Tablet 2-column | CSS exists, panels hidden | **BROKEN** | P1 |
| Mobile bottom sheets | Not implemented | **MISSING** | P1 |
| 44x44px touch targets | Not verified | Needs audit | P1 |
| Swipe gestures for panels | Not implemented | **MISSING** | P2 |
| Pinch zoom | Not implemented | **MISSING** | P1 |
| Two-finger pan | Not implemented | **MISSING** | P2 |

**Gap Score: 30%**

### 1.10 Performance

| Spec (Framework) | Current (Prototype) | Gap | Priority |
|------------------|---------------------|-----|----------|
| Time to Interactive < 2s | Likely achieved | ✅ | - |
| Equation parse time < 10ms | No parsing exists | N/A | P0 |
| Simple render < 100ms | Achieved | ✅ | - |
| Parameter update < 16ms | Achieved | ✅ | - |
| Debounce typing (150ms) | Not implemented | **MISSING** | P1 |
| Web Workers for computation | Not implemented | **MISSING** | P2 |
| Caching parsed equations | Not implemented | **MISSING** | P2 |
| Level of Detail (zoomed out) | Not implemented | **MISSING** | P3 |

**Gap Score: 50%**

### 1.11 Export

| Spec (Framework) | Current (Prototype) | Gap | Priority |
|------------------|---------------------|-----|----------|
| PNG export | Modal exists, no functionality | **MISSING** | P1 |
| SVG export | Not implemented | **MISSING** | P1 |
| MP4 export | Not implemented | **MISSING** | P2 |
| GIF export | Not implemented | **MISSING** | P2 |
| Resolution options | UI only | **MISSING** | P1 |
| Background options | UI only | **MISSING** | P2 |
| Actual download trigger | Not implemented | **MISSING** | P1 |

**Gap Score: 10%**

### 1.12 Other Missing Features

| Feature | Status | Priority |
|---------|--------|----------|
| Settings modal/panel | Not implemented | P2 |
| Keyboard shortcuts modal | Button exists, no modal | P2 |
| Context menu (right-click) | Not implemented | P3 |
| Collapsible panels | Not implemented | P2 |
| Light theme support | Not implemented | P3 |
| LaTeX rendering | Not implemented | P2 |
| Version history | Not implemented | P3 |

---

## 2. Atomic Implementation Plan

### Phase 1: Core Engine (Foundation)
*Must be completed first - all other features depend on this*

#### 1.1 Equation Parser
```
Task: Build mathematical expression parser
Files: /custom-equations/src/core/parser.js
Atoms:
  1.1.1 Create tokenizer (lexer) for math expressions
  1.1.2 Implement operator precedence parsing (Pratt parser)
  1.1.3 Support basic operators: +, -, *, /, ^, %
  1.1.4 Support parentheses and bracket matching
  1.1.5 Support function calls: sin(), cos(), sqrt(), etc.
  1.1.6 Support variables: single letters a-z (except reserved)
  1.1.7 Support constants: π, e, φ, τ
  1.1.8 Build AST (Abstract Syntax Tree) output
  1.1.9 Add error recovery and position tracking
  1.1.10 Write unit tests for parser
```

#### 1.2 Expression Evaluator
```
Task: Evaluate parsed AST with variable substitution
Files: /custom-equations/src/core/evaluator.js
Atoms:
  1.2.1 Create AST visitor/walker
  1.2.2 Implement numeric evaluation for all operators
  1.2.3 Implement all trig functions
  1.2.4 Implement exponential/log functions
  1.2.5 Implement special functions (abs, floor, ceil, etc.)
  1.2.6 Add variable scope/context for parameters
  1.2.7 Add constant value resolution
  1.2.8 Handle division by zero gracefully
  1.2.9 Handle NaN/Infinity cases
  1.2.10 Write unit tests for evaluator
```

#### 1.3 Variable Detection
```
Task: Auto-detect variables from equation
Files: /custom-equations/src/core/analyzer.js
Atoms:
  1.3.1 Walk AST to find all variable nodes
  1.3.2 Filter out reserved variables (x, y, r, θ, t)
  1.3.3 Apply intelligent defaults by variable name
  1.3.4 Generate parameter configuration objects
  1.3.5 Emit events when variables change
```

---

### Phase 2: Equation Editor Enhancement

#### 2.1 Syntax Highlighting
```
Task: Real-time syntax highlighting in editor
Files: /custom-equations/src/components/SyntaxHighlighter.js
Atoms:
  2.1.1 Create overlay div matching textarea dimensions
  2.1.2 Tokenize input on every change (debounced)
  2.1.3 Map tokens to CSS classes (variable, number, operator, etc.)
  2.1.4 Render highlighted HTML in overlay
  2.1.5 Sync scroll position between textarea and overlay
  2.1.6 Handle multi-line equations
  2.1.7 Add cursor line highlighting
```

#### 2.2 Bracket Matching
```
Task: Highlight matching brackets
Files: /custom-equations/src/components/BracketMatcher.js
Atoms:
  2.2.1 Track cursor position in textarea
  2.2.2 Find bracket at cursor position
  2.2.3 Find matching bracket using stack algorithm
  2.2.4 Apply highlight class to both brackets
  2.2.5 Handle mismatched brackets (error style)
```

#### 2.3 Autocomplete
```
Task: Function name autocomplete
Files: /custom-equations/src/components/Autocomplete.js
Atoms:
  2.3.1 Create popup component with positioning
  2.3.2 Build function dictionary with descriptions
  2.3.3 Detect when user is typing function name
  2.3.4 Filter suggestions by prefix
  2.3.5 Keyboard navigation (up/down/enter/escape)
  2.3.6 Insert selected function at cursor
  2.3.7 Position popup below cursor
```

#### 2.4 Validation & Errors
```
Task: Real-time validation feedback
Files: /custom-equations/src/components/ValidationFeedback.js
Atoms:
  2.4.1 Connect to parser error events
  2.4.2 Display error position indicator
  2.4.3 Show error message below input
  2.4.4 Implement "Did you mean?" suggestions
  2.4.5 Add warning state for edge cases
  2.4.6 Preserve last valid state
  2.4.7 Update status indicator icon
```

---

### Phase 3: Dynamic Parameter System

#### 3.1 Parameter Auto-Generation
```
Task: Generate sliders from detected variables
Files: /custom-equations/src/components/ParameterPanel.js
Atoms:
  3.1.1 Subscribe to analyzer variable detection
  3.1.2 Create slider config from variable defaults
  3.1.3 Dynamically render slider components
  3.1.4 Remove sliders for deleted variables
  3.1.5 Preserve user-modified ranges
```

#### 3.2 Enhanced Slider Controls
```
Task: Add missing slider features
Files: /custom-equations/src/components/ParameterSlider.js
Atoms:
  3.2.1 Make value display editable (click to type)
  3.2.2 Add +/- buttons for fine adjustment
  3.2.3 Implement Shift+drag for 10x precision
  3.2.4 Double-click slider thumb to reset
  3.2.5 Create range edit modal/popover
  3.2.6 Add step size configuration
```

#### 3.3 Multi-Parameter Animation
```
Task: Animate any selected parameters
Files: /custom-equations/src/core/AnimationEngine.js
Atoms:
  3.3.1 Refactor to support multiple animated params
  3.3.2 Add per-param animation config (range, speed)
  3.3.3 Support different easing functions
  3.3.4 Add speed control UI (0.25x - 4x)
  3.3.5 Add loop toggle
  3.3.6 Add frame-by-frame stepping
```

---

### Phase 4: Canvas & Rendering

#### 4.1 Dynamic Curve Rendering
```
Task: Render any parsed equation
Files: /custom-equations/src/rendering/CurveRenderer.js
Atoms:
  4.1.1 Determine equation type (polar, parametric, cartesian)
  4.1.2 Generate points by evaluating equation
  4.1.3 Handle multiple output formats (r vs x,y)
  4.1.4 Auto-scale based on output range
  4.1.5 Support multiple curves in same canvas
```

#### 4.2 Improved Canvas Interactions
```
Task: Fix and enhance canvas controls
Files: /custom-equations/src/rendering/CanvasControls.js
Atoms:
  4.2.1 Cursor-centered zooming
  4.2.2 Double-click to reset view
  4.2.3 Touch gesture: pinch to zoom
  4.2.4 Touch gesture: two-finger pan
  4.2.5 Add "Calculating..." overlay for slow renders
```

#### 4.3 Performance Optimization
```
Task: Optimize rendering performance
Files: /custom-equations/src/rendering/RenderOptimizer.js
Atoms:
  4.3.1 Add debouncing for equation input (150ms)
  4.3.2 Cache parsed AST
  4.3.3 Implement progressive rendering
  4.3.4 Add level-of-detail based on zoom
  4.3.5 Move evaluation to Web Worker (optional)
```

---

### Phase 5: Export System

#### 5.1 PNG Export
```
Task: Export canvas as PNG
Files: /custom-equations/src/export/PngExporter.js
Atoms:
  5.1.1 Create high-res offscreen canvas
  5.1.2 Re-render at target resolution
  5.1.3 Convert to blob/data URL
  5.1.4 Trigger download
  5.1.5 Add background color options
```

#### 5.2 SVG Export
```
Task: Export as vector SVG
Files: /custom-equations/src/export/SvgExporter.js
Atoms:
  5.2.1 Generate SVG path from points
  5.2.2 Add viewBox calculation
  5.2.3 Include styling (colors, stroke width)
  5.2.4 Create downloadable SVG file
```

#### 5.3 Animation Export (GIF/MP4)
```
Task: Export animation frames
Files: /custom-equations/src/export/AnimationExporter.js
Atoms:
  5.3.1 Capture frames at target FPS
  5.3.2 Integrate gif.js for GIF encoding
  5.3.3 Integrate ffmpeg.wasm for MP4 (optional)
  5.3.4 Show progress during encoding
  5.3.5 Handle large animations gracefully
```

---

### Phase 6: Accessibility

#### 6.1 ARIA Implementation
```
Task: Add comprehensive ARIA labels
Files: All component files
Atoms:
  6.1.1 Add aria-label to all buttons
  6.1.2 Add aria-describedby for validation errors
  6.1.3 Add role attributes to custom components
  6.1.4 Add aria-live for dynamic updates
  6.1.5 Add aria-expanded for collapsible sections
```

#### 6.2 Keyboard Navigation
```
Task: Full keyboard accessibility
Files: /custom-equations/src/utils/KeyboardManager.js
Atoms:
  6.2.1 Implement focus trap for modals
  6.2.2 Add Tab navigation order
  6.2.3 Add / and F2 to focus equation input
  6.2.4 Add T to open template gallery
  6.2.5 Add Ctrl+E for export
  6.2.6 Add Ctrl+Z / Ctrl+Shift+Z for undo/redo
  6.2.7 Show keyboard shortcuts modal
```

#### 6.3 Motion & Contrast
```
Task: Respect user preferences
Files: /custom-equations/src/utils/A11yManager.js
Atoms:
  6.3.1 Detect prefers-reduced-motion
  6.3.2 Disable animations when preferred
  6.3.3 Detect prefers-contrast
  6.3.4 Adjust colors for high contrast mode
  6.3.5 Audit and fix contrast ratios
```

---

### Phase 7: Responsive & Mobile

#### 7.1 Tablet Layout
```
Task: Fix tablet breakpoint
Files: /custom-equations/styles/responsive.css
Atoms:
  7.1.1 Create collapsible sidebar component
  7.1.2 Add toggle button for sidebar
  7.1.3 Slide-out animation for panel
  7.1.4 Overlay background when open
```

#### 7.2 Mobile Layout
```
Task: Implement mobile bottom sheets
Files: /custom-equations/src/components/BottomSheet.js
Atoms:
  7.2.1 Create draggable bottom sheet component
  7.2.2 Snap points (closed, half, full)
  7.2.3 Swipe down to dismiss
  7.2.4 Tab bar for switching panels
  7.2.5 Ensure 44x44px touch targets
```

#### 7.3 Touch Gestures
```
Task: Add touch gesture support
Files: /custom-equations/src/utils/GestureManager.js
Atoms:
  7.3.1 Detect pinch gesture for zoom
  7.3.2 Calculate zoom center from touch points
  7.3.3 Detect two-finger drag for pan
  7.3.4 Add momentum scrolling
```

---

### Phase 8: Template System Enhancement

#### 8.1 Template Categories
```
Task: Organize templates by category
Files: /custom-equations/src/data/templates.js
Atoms:
  8.1.1 Define category structure
  8.1.2 Add 20+ templates across categories
  8.1.3 Create collapsible category UI
  8.1.4 Add search/filter functionality
```

#### 8.2 Animated Previews
```
Task: Animate template previews on hover
Files: /custom-equations/src/components/TemplateCard.js
Atoms:
  8.2.1 Start animation on mouseenter
  8.2.2 Stop animation on mouseleave
  8.2.3 Use requestAnimationFrame for smooth animation
  8.2.4 Pause animations when tab not visible
```

#### 8.3 User Templates
```
Task: Save custom templates
Files: /custom-equations/src/storage/TemplateStorage.js
Atoms:
  8.3.1 Save current equation to localStorage
  8.3.2 Load user templates on startup
  8.3.3 Add "Save as template" button
  8.3.4 Allow renaming/deleting user templates
```

---

### Phase 9: Polish & Refinement

#### 9.1 Function Library Enhancement
```
Task: Complete function library
Atoms:
  9.1.1 Add hyperbolic functions
  9.1.2 Add comparison operators
  9.1.3 Add random/noise functions
  9.1.4 Add hover descriptions for all functions
  9.1.5 Add example equations for each function
```

#### 9.2 Settings & Preferences
```
Task: Create settings panel
Atoms:
  9.2.1 Theme selection (dark/light)
  9.2.2 Default parameter ranges
  9.2.3 Animation settings
  9.2.4 Export defaults
  9.2.5 Persist settings to localStorage
```

#### 9.3 Undo/Redo System
```
Task: Track equation history
Atoms:
  9.3.1 Create state history stack
  9.3.2 Push state on equation change (debounced)
  9.3.3 Implement undo (Ctrl+Z)
  9.3.4 Implement redo (Ctrl+Shift+Z)
  9.3.5 Update UI to show undo availability
```

---

## 3. Implementation Priority Matrix

### P0 - Critical (Do First)
| Task | Est. Hours | Dependencies |
|------|------------|--------------|
| 1.1 Equation Parser | 16 | None |
| 1.2 Expression Evaluator | 12 | 1.1 |
| 1.3 Variable Detection | 6 | 1.1 |
| 4.1 Dynamic Curve Rendering | 8 | 1.2 |
| 2.4 Validation & Errors | 6 | 1.1 |

**Subtotal: 48 hours**

### P1 - Important (Next)
| Task | Est. Hours | Dependencies |
|------|------------|--------------|
| 2.1 Syntax Highlighting | 8 | 1.1 |
| 2.2 Bracket Matching | 4 | 1.1 |
| 2.3 Autocomplete | 8 | None |
| 3.1 Parameter Auto-Generation | 6 | 1.3 |
| 3.2 Enhanced Slider Controls | 6 | None |
| 3.3 Multi-Parameter Animation | 8 | None |
| 5.1 PNG Export | 4 | None |
| 5.2 SVG Export | 6 | 4.1 |
| 6.1 ARIA Implementation | 6 | None |
| 6.2 Keyboard Navigation | 6 | None |
| 7.1 Tablet Layout | 6 | None |
| 7.2 Mobile Layout | 10 | None |
| 7.3 Touch Gestures | 6 | None |

**Subtotal: 84 hours**

### P2 - Nice to Have
| Task | Est. Hours | Dependencies |
|------|------------|--------------|
| 4.2 Improved Canvas Interactions | 6 | None |
| 4.3 Performance Optimization | 8 | 1.2 |
| 5.3 Animation Export | 12 | 3.3 |
| 6.3 Motion & Contrast | 4 | None |
| 8.1 Template Categories | 6 | None |
| 8.2 Animated Previews | 4 | None |
| 8.3 User Templates | 6 | None |
| 9.1 Function Library Enhancement | 4 | 1.2 |
| 9.2 Settings & Preferences | 6 | None |
| 9.3 Undo/Redo System | 6 | None |

**Subtotal: 62 hours**

### P3 - Future
- Light theme support
- Context menus
- LaTeX rendering
- Version history
- Level of detail rendering
- Custom constants

---

## 4. Recommended Implementation Order

```
Week 1: Core Engine
├── Day 1-2: Equation Parser (1.1)
├── Day 3-4: Expression Evaluator (1.2)
└── Day 5: Variable Detection (1.3) + Dynamic Rendering (4.1)

Week 2: Editor Enhancement
├── Day 1-2: Syntax Highlighting (2.1)
├── Day 2: Bracket Matching (2.2)
├── Day 3-4: Autocomplete (2.3)
└── Day 5: Validation & Errors (2.4)

Week 3: Parameters & Animation
├── Day 1-2: Parameter Auto-Generation (3.1)
├── Day 2-3: Enhanced Slider Controls (3.2)
└── Day 4-5: Multi-Parameter Animation (3.3)

Week 4: Export & Accessibility
├── Day 1: PNG Export (5.1)
├── Day 2: SVG Export (5.2)
├── Day 3: ARIA Implementation (6.1)
└── Day 4-5: Keyboard Navigation (6.2)

Week 5: Mobile & Polish
├── Day 1-2: Tablet Layout (7.1)
├── Day 2-3: Mobile Layout (7.2)
├── Day 4: Touch Gestures (7.3)
└── Day 5: Final testing & fixes
```

---

## 5. File Structure Recommendation

```
custom-equations/
├── prototype/
│   └── index.html          # Current prototype (reference)
├── src/
│   ├── core/
│   │   ├── parser.js       # Equation tokenizer + parser
│   │   ├── evaluator.js    # AST evaluation engine
│   │   ├── analyzer.js     # Variable detection
│   │   └── AnimationEngine.js
│   ├── components/
│   │   ├── App.js          # Main application
│   │   ├── EquationEditor.js
│   │   ├── SyntaxHighlighter.js
│   │   ├── BracketMatcher.js
│   │   ├── Autocomplete.js
│   │   ├── ValidationFeedback.js
│   │   ├── ParameterPanel.js
│   │   ├── ParameterSlider.js
│   │   ├── TemplateGallery.js
│   │   ├── TemplateCard.js
│   │   ├── FunctionLibrary.js
│   │   ├── Canvas.js
│   │   ├── ExportModal.js
│   │   └── BottomSheet.js
│   ├── rendering/
│   │   ├── CurveRenderer.js
│   │   ├── CanvasControls.js
│   │   └── RenderOptimizer.js
│   ├── export/
│   │   ├── PngExporter.js
│   │   ├── SvgExporter.js
│   │   └── AnimationExporter.js
│   ├── storage/
│   │   ├── TemplateStorage.js
│   │   └── SettingsStorage.js
│   ├── utils/
│   │   ├── KeyboardManager.js
│   │   ├── GestureManager.js
│   │   └── A11yManager.js
│   ├── data/
│   │   ├── templates.js
│   │   ├── functions.js
│   │   └── constants.js
│   └── styles/
│       ├── tokens.css
│       ├── components.css
│       └── responsive.css
├── tests/
│   ├── parser.test.js
│   ├── evaluator.test.js
│   └── ...
├── DESIGN_FRAMEWORK.md
└── package.json
```

---

## 6. Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Parser complexity underestimated | High | Start with subset of operators, expand incrementally |
| Mobile performance issues | Medium | Test early on real devices, use Web Workers |
| Browser compatibility | Medium | Use established patterns, polyfills where needed |
| Scope creep | High | Stick to P0/P1 initially, defer P2/P3 |
| Accessibility testing gaps | Medium | Use automated tools (axe) + manual testing |

---

*Document Version: 1.0*
*Created: January 2026*
