# MathArt Custom Equations: UI/UX Design Framework

## Executive Summary

This document establishes the design framework and UX approach for the Custom Equations feature within MathArt. The framework prioritizes **creative exploration**, **mathematical precision**, and **visual feedback** to enable users to create beautiful mathematical art through equation manipulation.

---

## 1. Design Philosophy

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Immediacy** | Every input should produce instant visual feedback. Users should see their equations come alive in real-time. |
| **Progressive Disclosure** | Simple by default, powerful when needed. Hide complexity until users seek it. |
| **Error Tolerance** | Mathematical errors should guide, not punish. Invalid equations show helpful hints, not red error walls. |
| **Visual-First** | The visualization canvas is the hero. UI controls support the art, they don't compete with it. |
| **Playful Precision** | Balance mathematical rigor with creative experimentation. Make "happy accidents" possible. |

### Design Values

1. **Clarity over Cleverness** - UI should be self-explanatory
2. **Speed over Features** - Responsiveness is non-negotiable
3. **Flexibility over Prescription** - Support diverse workflows
4. **Delight over Decoration** - Animations serve function

---

## 2. User Research & Personas

### Primary Personas

#### Persona 1: "The Artist" - Maya
- **Background**: Digital artist, comfortable with creative tools (Photoshop, Procreate)
- **Math Comfort**: Low to medium. Knows basic algebra, intimidated by notation
- **Goals**: Create visually stunning pieces, explore patterns, share on social media
- **Pain Points**: Complex mathematical syntax, lack of immediate visual feedback
- **Needs**: Templates, presets, intuitive sliders, visual equation building

#### Persona 2: "The Explorer" - Alex
- **Background**: STEM student or hobbyist, curious about math visualization
- **Math Comfort**: Medium to high. Comfortable with functions and variables
- **Goals**: Understand mathematical concepts visually, experiment with parameters
- **Pain Points**: Disconnect between equation and visual output
- **Needs**: Parameter controls, function library, ability to see how changes affect output

#### Persona 3: "The Expert" - Dr. Chen
- **Background**: Mathematician, educator, or researcher
- **Math Comfort**: High. Fluent in mathematical notation
- **Goals**: Create precise visualizations, teach concepts, publish-quality output
- **Pain Points**: Oversimplified tools, lack of control
- **Needs**: Direct equation input, LaTeX support, export options, precision controls

### User Journey Map

```
Discovery → First Equation → Experimentation → Creation → Sharing
    │            │                 │              │          │
    ▼            ▼                 ▼              ▼          ▼
Template     Guided           Parameter      Refinement   Export/
Gallery      Input            Playground     & Polish     Publish
```

---

## 3. Information Architecture

### Content Hierarchy

```
Custom Equations
├── Canvas (Primary Focus - 70% of viewport)
│   ├── Visualization Area
│   ├── Axis/Grid Toggle
│   └── Zoom/Pan Controls
│
├── Equation Panel (Secondary - Collapsible)
│   ├── Equation Input Field
│   ├── Syntax Highlighting
│   ├── Validation Feedback
│   └── Function Suggestions
│
├── Parameters Panel (Tertiary - Context-dependent)
│   ├── Detected Variables
│   ├── Range Sliders
│   ├── Animation Controls
│   └── Preset Values
│
└── Toolbar (Persistent)
    ├── Template Browser
    ├── Function Library
    ├── Settings
    └── Export
```

### Navigation Model

- **Single-page application** - No page transitions during creation
- **Panel-based layout** - Collapsible panels for focused work
- **Keyboard-first** - Full keyboard navigation support
- **Context menus** - Right-click for advanced options

---

## 4. Interaction Patterns

### Pattern 1: Live Preview

**Trigger**: Any equation or parameter change
**Behavior**: Canvas updates in real-time (< 100ms for simple equations)
**Fallback**: Show "Calculating..." for complex operations (> 500ms)
**Edge Case**: Invalid equations show last valid state with error indicator

### Pattern 2: Parameter Discovery

**Trigger**: Valid equation entered
**Behavior**: System auto-detects variables (a-z excluding reserved)
**UI Response**: Parameter panel populates with sliders for each variable
**Defaults**: Intelligent defaults based on variable name conventions

```
Variable Naming Conventions:
- t, θ (theta): Time/angle → Range: 0 to 2π
- n, i, j, k: Integers → Range: 1 to 10, step: 1
- a, b, c: Coefficients → Range: -10 to 10
- r: Radius → Range: 0 to 10
- x, y, z: Coordinates → Range: -10 to 10
```

### Pattern 3: Error Recovery

**Levels of Error Handling:**

| Level | Condition | Response |
|-------|-----------|----------|
| Warning | Unusual but valid (e.g., division might be 0) | Yellow indicator, tooltip explanation |
| Soft Error | Syntax error mid-typing | Gray out preview, show cursor position hint |
| Hard Error | Impossible to parse | Red underline, specific error message, suggestion |
| Recovery | User fixes error | Immediate transition back to valid state |

### Pattern 4: Template Insertion

**Flow:**
1. User browses template gallery (grid view with previews)
2. Hover shows animated preview
3. Click inserts equation into editor
4. Parameters auto-populate with template defaults
5. User modifies as desired

### Pattern 5: Animation Scrubbing

**Trigger**: Parameter marked as "animated"
**Controls**:
- Play/Pause button
- Timeline scrubber
- Speed control (0.25x - 4x)
- Loop toggle
- Frame-by-frame stepping

---

## 5. Component Specifications

### 5.1 Equation Input Field

**Purpose**: Primary method for entering mathematical equations

**Behaviors**:
- Monospace font for alignment
- Syntax highlighting by token type
- Auto-complete for function names
- Bracket matching with highlight
- Multi-line support for complex equations

**States**:
| State | Visual Treatment |
|-------|-----------------|
| Empty | Placeholder with example |
| Typing | Cursor + real-time validation |
| Valid | Green checkmark indicator |
| Error | Red underline + error message |
| Focused | Elevated shadow + border color |

**Accessibility**:
- Screen reader announces validation state
- Error messages linked via aria-describedby
- Keyboard shortcuts announced on focus

### 5.2 Visualization Canvas

**Purpose**: Display the visual output of equations

**Regions**:
```
┌─────────────────────────────────────────┐
│ [Toolbar: Zoom, Pan, Reset, Fullscreen] │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│            VISUALIZATION                │
│               AREA                      │
│                                         │
│                                         │
├─────────────────────────────────────────┤
│ [Status: Coordinates, Render Time]      │
└─────────────────────────────────────────┘
```

**Interactions**:
- Scroll to zoom (centered on cursor)
- Click-drag to pan
- Double-click to reset view
- Pinch-to-zoom on touch devices

**Performance Targets**:
- 60fps for parameter changes
- < 100ms initial render for simple equations
- Progressive rendering for complex visualizations

### 5.3 Parameter Sliders

**Purpose**: Allow intuitive adjustment of equation variables

**Anatomy**:
```
┌────────────────────────────────────────┐
│  a = 2.5            [−] ═══●═══ [+]   │
│  Range: -10 to 10   Step: 0.1          │
└────────────────────────────────────────┘
```

**Features**:
- Direct value input (click on number)
- Fine control (hold Shift for 10x precision)
- Range adjustment (expandable)
- Animation toggle (clock icon)
- Reset to default (double-click)

### 5.4 Function Library Panel

**Purpose**: Provide discoverable access to mathematical functions

**Organization**:
```
├── Basic
│   ├── Arithmetic (+, -, *, /, ^)
│   └── Comparison (<, >, =)
├── Trigonometric
│   ├── sin, cos, tan
│   ├── asin, acos, atan
│   └── sinh, cosh, tanh
├── Exponential
│   ├── exp, log, ln
│   └── sqrt, pow
├── Special
│   ├── abs, floor, ceil
│   ├── mod, sign
│   └── random, noise
└── Constants
    ├── pi, e, phi
    └── Custom...
```

**Interaction**: Click to insert at cursor, hover for description + example

### 5.5 Template Gallery

**Purpose**: Provide starting points and inspiration

**Categories**:
- Spirals & Helixes
- Waves & Oscillations
- Fractals & Recursion
- Polar Curves
- Parametric Surfaces
- Mathematical Constants
- User Saved

**Card Design**:
```
┌─────────────────┐
│   [Preview]     │  ← Animated on hover
│   [Animation]   │
├─────────────────┤
│ Spiral Rose     │  ← Name
│ r = cos(nθ)     │  ← Equation preview
│ ★★★★☆ (42)      │  ← Rating/usage
└─────────────────┘
```

---

## 6. Visual Design Direction

### Color Strategy

**Functional Palette**:
- **Canvas Background**: Dark (reduces eye strain, makes colors pop)
- **UI Chrome**: Neutral grays (doesn't compete with visualization)
- **Accent**: Blue (trustworthy, mathematical association)
- **Syntax Colors**: Distinct hues for different token types

**Syntax Highlighting Scheme**:
| Token Type | Color | Rationale |
|------------|-------|-----------|
| Variables | Pink/Magenta | Stand out, commonly adjusted |
| Numbers | Teal | Calm, stable values |
| Operators | Orange | Action, movement |
| Functions | Green | Growth, transformation |
| Constants | Blue | Fixed, reliable |
| Brackets | Brown | Structural, grounding |
| Errors | Red | Universal warning |

### Typography

- **UI Text**: Sans-serif (Inter, system fonts)
- **Equation Editor**: Monospace (JetBrains Mono, Fira Code)
- **Math Display**: Serif/Math font (for rendered LaTeX)

### Spacing & Layout

- **8px base unit** for all spacing
- **Panel gutters**: 16px
- **Component padding**: 12-16px
- **Canvas priority**: Minimum 60% of viewport width

### Motion Design

| Action | Duration | Easing |
|--------|----------|--------|
| Parameter change | 0ms (instant) | - |
| Panel open/close | 200ms | ease-out |
| Tooltip appear | 150ms | ease-in |
| Error shake | 300ms | ease-in-out |
| Template hover | 300ms | ease-out |

---

## 7. Responsive Behavior

### Breakpoints

| Breakpoint | Layout Adaptation |
|------------|-------------------|
| Desktop (>1200px) | Three-column: Tools + Canvas + Parameters |
| Tablet (768-1200px) | Two-column: Canvas + Collapsible side panel |
| Mobile (<768px) | Single column: Canvas + Bottom sheet panels |

### Mobile Considerations

- **Touch-friendly targets**: Minimum 44x44px
- **Bottom sheet panels**: Swipe up to reveal controls
- **Simplified toolbar**: Essential actions only
- **Gesture support**: Pinch zoom, two-finger pan

---

## 8. Accessibility Requirements

### WCAG 2.1 AA Compliance

- **Color contrast**: 4.5:1 for normal text, 3:1 for large text
- **Focus indicators**: Visible on all interactive elements
- **Screen reader support**: Full ARIA labeling
- **Keyboard navigation**: All features accessible via keyboard

### Specific Accommodations

- **Color blindness**: Don't rely solely on color for meaning
- **Reduced motion**: Respect `prefers-reduced-motion`
- **High contrast mode**: Support system high contrast settings
- **Zoom support**: Functional at 200% zoom

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Focus equation input | `/` or `F2` |
| Play/Pause animation | `Space` |
| Reset view | `R` |
| Toggle fullscreen | `F` |
| Open template gallery | `T` |
| Export | `Ctrl/Cmd + E` |
| Undo | `Ctrl/Cmd + Z` |
| Redo | `Ctrl/Cmd + Shift + Z` |

---

## 9. Error Handling Philosophy

### Guiding Principles

1. **Never lose user work** - Auto-save every change
2. **Show, don't block** - Errors as inline guidance
3. **Suggest, don't prescribe** - Offer fixes, don't force them
4. **Maintain context** - Keep last valid visualization visible

### Error Message Framework

**Structure**: `[What happened] + [Why it matters] + [How to fix]`

**Examples**:

| Error Type | Message |
|------------|---------|
| Unknown function | "Unknown function 'sine'. Did you mean 'sin'?" |
| Missing bracket | "Missing closing parenthesis after 'cos(x'" |
| Division by zero | "This equation divides by zero when x = 0. Consider adding a small offset." |
| Undefined variable | "Variable 'n' has no value. Add it to parameters or define it in the equation." |

---

## 10. Performance Guidelines

### Target Metrics

| Metric | Target |
|--------|--------|
| Time to Interactive | < 2 seconds |
| Equation parse time | < 10ms |
| Simple render | < 100ms |
| Parameter update | < 16ms (60fps) |
| Complex render | < 1 second (with progress) |

### Optimization Strategies

1. **Debounce typing** - Parse after 150ms of no input
2. **Progressive rendering** - Show low-res first, refine
3. **Web Workers** - Offload computation from main thread
4. **Caching** - Cache parsed equations and partial renders
5. **Level of Detail** - Reduce complexity when zoomed out

---

## 11. Future Considerations

### Potential Enhancements

- **Collaborative editing** - Real-time multi-user sessions
- **AI suggestions** - "Try adding a frequency term"
- **3D visualization** - Extend to 3D parametric surfaces
- **Audio reactivity** - Link parameters to audio input
- **Version history** - Timeline of equation iterations
- **Community gallery** - Share and discover creations

### Technical Debt to Avoid

- Tightly coupling UI to specific rendering engine
- Hard-coding parameter ranges
- Ignoring internationalization early
- Skipping automated accessibility testing

---

## 12. Success Metrics

### Quantitative

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to first visualization | < 30 seconds | Analytics |
| Equation success rate | > 80% parse successfully | Error logging |
| Session duration | > 5 minutes average | Analytics |
| Export rate | > 20% of sessions | Analytics |
| Return rate | > 40% within 7 days | Analytics |

### Qualitative

- User satisfaction surveys (target: 4.2+/5)
- Social media sentiment analysis
- User interview feedback themes
- Support ticket categorization

---

## Appendix A: Competitive Analysis Summary

| Product | Strengths | Weaknesses | Opportunity |
|---------|-----------|------------|-------------|
| Desmos | Excellent UX, fast | Limited artistic output | Better visual customization |
| GeoGebra | Powerful features | Steep learning curve | Simpler onboarding |
| Shadertoy | Beautiful output | Code-only, intimidating | Visual equation builder |
| Processing | Flexible, community | Requires programming | No-code path |

---

## Appendix B: Technical Constraints

- **Browser support**: Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
- **Rendering**: WebGL 2.0 preferred, Canvas 2D fallback
- **Math parsing**: Support standard notation + LaTeX subset
- **File formats**: PNG, SVG, MP4/GIF for animations

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Status: Initial Framework*
