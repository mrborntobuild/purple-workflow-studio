# Purple Node System - Architecture & Implementation Plan

**Created:** January 25, 2026
**Version:** 1.0
**Reference:** Weavy.ai comparison analysis

---

## Executive Summary

This document provides a complete understanding of Purple's node-based workflow system, comparing it to Weavy.ai's approach, and outlining improvements to achieve feature parity and beyond.

---

## Part 1: Current Node System Architecture

### Data Type System (Port Colors)

| Color | Hex | Data Type | Description |
|-------|-----|-----------|-------------|
| Pink | `#c084fc` | TEXT/PROMPT | Text strings, prompts |
| Blue | `#38bdf8` | IMAGE | Image data (URLs, base64) |
| Red | `#f87171` | VIDEO | Video files |
| Yellow | `#fbbf24` | AUDIO | Audio files |
| Teal | `#2dd4bf` | 3D/SVG | 3D models, vector graphics |
| Slate | `#94a3b8` | ARRAY | Arrays, generic data |

### Connection Rules
- Ports of matching colors can connect
- Data flows from **output (right)** to **input (left)**
- Multiple outputs can connect to one input (merge behavior varies by node)
- One output can connect to multiple inputs (fan-out)

---

## Part 2: Complete Node Catalog

### Category A: Text & Prompt Nodes

#### 1. Text Node
```
┌─────────────────────────────────┐
│  TEXT                       ... │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ Your text content here... │  │○ TEXT
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```
**Purpose:** Store and output static text
**Inputs:** None
**Outputs:** TEXT (pink)
**Use Cases:**
- Writing prompts manually
- Storing reusable text snippets
- Adding descriptions or instructions

**Panel Settings:** None (inline editing only)

---

#### 2. Prompt Enhancer Node
```
┌─────────────────────────────────┐
│  PROMPT ENHANCER            ... │
├─────────────────────────────────┤
│○ PROMPT                         │
│                                 │○ TEXT
│         [Enhance]               │
└─────────────────────────────────┘
```
**Purpose:** Use AI to improve prompt quality
**Inputs:** PROMPT (pink)
**Outputs:** TEXT (pink)
**Use Cases:**
- Improving vague prompts
- Adding detail and specificity
- Optimizing for specific models

**Panel Settings:**
- Enhancement style (detailed, concise, creative)

---

#### 3. Prompt Concatenator Node
```
┌─────────────────────────────────┐
│  PROMPT CONCATENATOR        ... │
├─────────────────────────────────┤
│○ PROMPT 1  [Read-only preview]  │
│○ PROMPT 2  [Read-only preview]  │
│○ TEXT 1    [Read-only preview]  │○ TEXT
│○ TEXT 2    [Read-only preview]  │
│  ┌───────────────────────────┐  │
│  │ Manual text input...      │  │
│  └───────────────────────────┘  │
│  [+ Add another text input]     │
└─────────────────────────────────┘
```
**Purpose:** Combine multiple text inputs into one output
**Inputs:**
- PROMPT 1 (pink) - fixed
- PROMPT 2 (pink) - fixed
- TEXT 1-N (pink) - dynamic, add/remove
**Outputs:** TEXT (pink)
**Use Cases:**
- Building complex prompts from components
- Combining style + subject + environment descriptions
- Modular prompt construction

**Panel Settings:**
- `textInputPortCount` - Number of additional text inputs
- `manualText` - Direct text entry

**Data Flow:**
```
Prompt 1 ──┐
Prompt 2 ──┼──▶ [Concatenate with spaces] ──▶ Combined Text
Text 1   ──┤
Text 2   ──┤
Manual   ──┘
```

---

#### 4. Any LLM Node
```
┌─────────────────────────────────┐
│  ANY LLM                    ... │
├─────────────────────────────────┤
│○ PROMPT                         │
│○ IMAGE (optional)               │
│  ┌───────────────────────────┐  │
│  │ Response preview...       │  │○ TEXT
│  └───────────────────────────┘  │
│  [+ Add another image input]    │
│                    [Run Model]  │
└─────────────────────────────────┘
```
**Purpose:** Run any LLM model with text/image inputs
**Inputs:**
- PROMPT (pink) - required
- IMAGE (blue) - optional, dynamic 0-N
**Outputs:** TEXT (pink)
**Use Cases:**
- Text generation
- Image description/analysis
- Multi-modal reasoning

**Panel Settings:**
- `model` - Model selection (GPT-4, Claude, etc.)
- `temperature` - Creativity control
- `maxTokens` - Response length limit
- `mediaInputCount` - Number of image inputs

---

#### 5. Image Describer Node
```
┌─────────────────────────────────┐
│  IMAGE DESCRIBER            ... │
├─────────────────────────────────┤
│○ IMAGE                          │○ TEXT
│         [Describe]              │
└─────────────────────────────────┘
```
**Purpose:** Generate text description of an image
**Inputs:** IMAGE (blue)
**Outputs:** TEXT (pink)
**Use Cases:**
- Auto-captioning
- Creating prompts from reference images
- Accessibility descriptions

---

#### 6. Video Describer Node
```
┌─────────────────────────────────┐
│  VIDEO DESCRIBER            ... │
├─────────────────────────────────┤
│○ VIDEO                          │○ TEXT
│         [Describe]              │
└─────────────────────────────────┘
```
**Purpose:** Generate text description of video content
**Inputs:** VIDEO (red)
**Outputs:** TEXT (pink)

---

### Category B: Data Structure Nodes

#### 7. Array Node
```
┌─────────────────────────────────┐
│  ARRAY                      ... │
├─────────────────────────────────┤
│○ TEXT (optional)                │
│  Split text by: [ * ]           │
│  ┌───────────────────────────┐  │
│  │ • Item 1                  │  │○ ARRAY
│  │ • Item 2                  │  │
│  │ • Item 3                  │  │
│  │ [+ Add item]              │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```
**Purpose:** Create/parse arrays of text items
**Inputs:** TEXT (pink) - optional, splits by delimiter
**Outputs:** ARRAY (slate)
**Use Cases:**
- Splitting LLM output into separate items
- Creating lists for batch processing
- Parsing structured responses

**Panel Settings:**
- `delimiter` - Character to split on (default: `*`)
- `arrayItems` - Manual item list

**Data Flow:**
```
"Item 1 * Item 2 * Item 3" ──▶ [Split by *] ──▶ ["Item 1", "Item 2", "Item 3"]
```

---

#### 8. Options Node (Dropdown)
```
┌─────────────────────────────────┐
│  OPTIONS                    ... │
├─────────────────────────────────┤
│○ ARRAY                          │
│  ┌───────────────────────────┐  │
│  │ ▼ Select an option...     │  │○ TEXT
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```
**Purpose:** Select one item from an array
**Inputs:** ARRAY (slate)
**Outputs:** TEXT (pink) - selected item
**Use Cases:**
- User selection from generated options
- Workflow branching
- Parameter selection

**Data Flow:**
```
["Option A", "Option B", "Option C"] ──▶ [User selects B] ──▶ "Option B"
```

---

#### 9. Number Node
```
┌─────────────────────────────────┐
│  NUMBER                     ... │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │        42                 │  │○ NUMBER
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```
**Purpose:** Store and output numeric values
**Inputs:** None
**Outputs:** NUMBER
**Use Cases:**
- Setting parameters (seed, steps, etc.)
- Mathematical operations
- Counters

---

#### 10. Toggle Node
```
┌─────────────────────────────────┐
│  TOGGLE                     ... │
├─────────────────────────────────┤
│         [ ◉ ON ]                │○ BOOLEAN
└─────────────────────────────────┘
```
**Purpose:** Boolean on/off switch
**Inputs:** None
**Outputs:** BOOLEAN
**Use Cases:**
- Enable/disable features
- Conditional logic
- Flag settings

---

#### 11. Seed Node
```
┌─────────────────────────────────┐
│  SEED                       ... │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │     123456789             │  │○ SEED
│  └───────────────────────────┘  │
│  [ ] Random    [🎲 Generate]    │
└─────────────────────────────────┘
```
**Purpose:** Generate/store random seeds
**Inputs:** None
**Outputs:** SEED/NUMBER
**Use Cases:**
- Reproducible generation
- Variation exploration
- Batch processing with different seeds

---

#### 12. List Node (Dropdown Preset)
```
┌─────────────────────────────────┐
│  LIST                       ... │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ ▼ Preset options...       │  │○ TEXT
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```
**Purpose:** Predefined dropdown with static options
**Inputs:** None
**Outputs:** TEXT
**Use Cases:**
- Aspect ratio selection
- Quality presets
- Style presets

---

### Category C: Image Generation Nodes

#### 13. Image Node (Multi-Model)
```
┌─────────────────────────────────┐
│  FLUX PRO 1.1              ... │
├─────────────────────────────────┤
│○ PROMPT                         │
│○ IMAGE 1 (ref)                  │
│○ IMAGE 2 (ref)                  │
│  ┌───────────────────────────┐  │
│  │    [Generated Image]      │  │○ IMAGE
│  │    ████████░░ 80%         │  │
│  └───────────────────────────┘  │
│  [+ Add image] [- Remove]       │
└─────────────────────────────────┘
```

**Supported Models:**
| Model | Provider | Image Inputs | Special Features |
|-------|----------|--------------|------------------|
| `nano_banana_pro` | Google | 0-4 | Fast generation |
| `nano_banana_pro_edit` | Google | 1-4 | Image editing |
| `flux_pro_1_1_ultra` | Black Forest | 0-1 | Highest quality |
| `flux_pro_1_1` | Black Forest | 0-1 | High quality |
| `flux_dev` | Black Forest | 0 | Development |
| `flux_lora` | Black Forest | 0 | LoRA support |
| `ideogram_v3` | Ideogram | 0 | Text rendering |
| `ideogram_v3_edit` | Ideogram | 1 | Image editing |
| `imagen_3` | Google | 0 | Photorealistic |
| `imagen_3_fast` | Google | 0 | Fast variant |
| `minimax_image` | Minimax | 0 | Versatile |

**Inputs:**
- PROMPT (pink) - required
- IMAGE (blue) - 0-4 depending on model

**Outputs:** IMAGE (blue)

**Panel Settings:**
- `prompt` - Generation prompt
- `negativePrompt` - What to avoid
- `aspectRatio` - Output dimensions
- `seed` - Reproducibility
- `guidanceScale` - Prompt adherence
- `numInferenceSteps` - Quality/speed tradeoff
- `imageInputCount` - Dynamic port count

---

#### 14. Import Node
```
┌─────────────────────────────────┐
│  IMPORT                     ... │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │  Drop image here or       │  │
│  │  click to browse          │  │○ IMAGE
│  │  ─────────────────────    │  │
│  │  Or paste URL:            │  │
│  │  [                    ]   │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```
**Purpose:** Import images from files or URLs
**Inputs:** None
**Outputs:** IMAGE (blue)
**Features:**
- Drag and drop upload
- File browser
- URL paste
- Supabase Storage integration

---

#### 15. File Node
```
┌─────────────────────────────────┐
│  FILE                       ... │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │    [Stored Image]         │  │○ IMAGE
│  │    filename.png           │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```
**Purpose:** Store and manage uploaded/generated files
**Inputs:** None
**Outputs:** IMAGE (blue)

---

#### 16. Preview Node
```
┌─────────────────────────────────┐
│  PREVIEW                    ... │
├─────────────────────────────────┤
│○ IMAGE                          │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │    [Large Preview]        │  │
│  │                           │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```
**Purpose:** Display images at larger size
**Inputs:** IMAGE (blue)
**Outputs:** None (display only)

---

### Category D: Video Generation Nodes

#### 17. Video Node (Multi-Model)
```
┌─────────────────────────────────┐
│  VEO 3.1                    ... │
├─────────────────────────────────┤
│○ PROMPT                         │
│○ IMAGE (for I2V)                │
│  ┌───────────────────────────┐  │
│  │    [Video Preview]        │  │○ VIDEO
│  │    ▶ 0:00 / 0:05          │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Supported Models:**
| Model | Provider | Type | Features |
|-------|----------|------|----------|
| `veo_2` | Google | T2V | Text to video |
| `veo_2_i2v` | Google | I2V | Image to video |
| `veo_3_1` | Google | T2V/I2V | Latest |
| `kling_2_6_pro` | Kuaishou | T2V/I2V | High quality |
| `kling_2_1_pro` | Kuaishou | T2V/I2V | Fast |
| `kling_2_0_master` | Kuaishou | T2V | Artistic |
| `kling_1_6_pro` | Kuaishou | T2V | Stable |
| `hunyuan_video_*` | Tencent | T2V/I2V | Various |
| `luma_ray_2` | Luma | T2V/I2V | Cinematic |
| `luma_ray_2_flash` | Luma | T2V/I2V | Fast |
| `minimax_video` | Minimax | T2V | Versatile |
| `pika_2_2` | Pika | T2V | Creative |
| `ltx_video` | Lightricks | T2V | Mobile-friendly |
| `wan_i2v` | Wan | I2V | Image animation |

**Inputs:**
- PROMPT (pink) - required
- IMAGE (blue) - required for I2V models

**Outputs:** VIDEO (red)

**Panel Settings:**
- `prompt` - Generation prompt
- `aspectRatio` - Video dimensions
- `duration` - Length in seconds
- `fps` - Frames per second

---

### Category E: Image Editing Nodes

#### 18. Levels Node
```
┌─────────────────────────────────┐
│  LEVELS                     ... │
├─────────────────────────────────┤
│○ IMAGE                          │
│  Input:  ●────────────────●     │○ IMAGE
│  Output: ●────────────────●     │
│  Gamma:  ──────●──────────      │
└─────────────────────────────────┘
```
**Purpose:** Adjust brightness, contrast, gamma
**Inputs:** IMAGE (blue)
**Outputs:** IMAGE (blue)

---

#### 19. Compositor Node
```
┌─────────────────────────────────┐
│  COMPOSITOR                 ... │
├─────────────────────────────────┤
│○ BASE IMAGE                     │
│○ OVERLAY IMAGE                  │
│  Blend Mode: [▼ Multiply  ]     │○ IMAGE
│  Opacity:    ──────●──────      │
└─────────────────────────────────┘
```
**Purpose:** Blend two images together
**Inputs:**
- IMAGE (blue) - base layer
- IMAGE (blue) - overlay layer
**Outputs:** IMAGE (blue)

**Blend Modes:**
- Normal
- Multiply
- Screen
- Overlay
- Soft Light

**Panel Settings:**
- `blendMode` - Blending algorithm
- `opacity` - Overlay transparency (0-100%)

---

#### 20. Crop Node
```
┌─────────────────────────────────┐
│  CROP                       ... │
├─────────────────────────────────┤
│○ IMAGE                          │
│  Aspect: [▼ 16:9    ]           │○ IMAGE
│  Width:  [1920] 🔗               │
│  Height: [1080]                 │
│                       [Reset]   │
└─────────────────────────────────┘
```
**Purpose:** Crop images to specific dimensions
**Inputs:** IMAGE (blue)
**Outputs:** IMAGE (blue)

**Presets:**
- 1:1 (Square)
- 3:4 (Portrait)
- 4:3 (Standard)
- 16:9 (Widescreen)
- 9:16 (Vertical/Mobile)
- Custom

**Panel Settings:**
- `aspectRatio` - Preset or custom
- `width` - Pixel width
- `height` - Pixel height
- `linked` - Lock aspect ratio

---

#### 21. Blur Node
```
┌─────────────────────────────────┐
│  BLUR                       ... │
├─────────────────────────────────┤
│○ IMAGE                          │
│  Type:   [▼ Gaussian  ]         │○ IMAGE
│  Radius: ──────●──────          │
└─────────────────────────────────┘
```
**Purpose:** Apply blur effects
**Inputs:** IMAGE (blue)
**Outputs:** IMAGE (blue)

**Blur Types:**
- Gaussian
- Box
- Motion

---

#### 22. Invert Node
```
┌─────────────────────────────────┐
│  INVERT                     ... │
├─────────────────────────────────┤
│○ IMAGE                          │○ IMAGE
└─────────────────────────────────┘
```
**Purpose:** Invert image colors
**Inputs:** IMAGE (blue)
**Outputs:** IMAGE (blue)

---

#### 23. Painter Node
```
┌─────────────────────────────────┐
│  PAINTER                    ... │
├─────────────────────────────────┤
│○ IMAGE                          │
│  ┌───────────────────────────┐  │
│  │   [Canvas with tools]     │  │○ IMAGE
│  │   🖌 ✏️ 🪣 ⭕ ⬜            │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```
**Purpose:** Paint/draw on images
**Inputs:** IMAGE (blue)
**Outputs:** IMAGE (blue)

**Tools:**
- Brush
- Pencil
- Fill
- Shapes
- Eraser

---

#### 24. Channels Node
```
┌─────────────────────────────────┐
│  CHANNELS                   ... │
├─────────────────────────────────┤
│○ IMAGE                          │
│  [R] ✓  [G] ✓  [B] ✓  [A] ✓    │○ IMAGE
└─────────────────────────────────┘
```
**Purpose:** Manipulate color channels
**Inputs:** IMAGE (blue)
**Outputs:** IMAGE (blue)

---

#### 25. Style Guide Node
```
┌─────────────────────────────────┐
│  STYLE GUIDE                ... │
├─────────────────────────────────┤
│○ BACKGROUND                     │
│○ LAYER 1                        │
│○ LAYER 2                        │
│○ LAYER 3                        │
│○ LAYER 4                        │
│  ┌─────────┬─────────┐          │○ IMAGE
│  │ [Img 1] │ [Img 2] │          │
│  ├─────────┼─────────┤          │
│  │ [Img 3] │ [Img 4] │          │
│  └─────────┴─────────┘          │
│  [+ Add Layer] [- Remove]       │
└─────────────────────────────────┘
```
**Purpose:** Create style reference grids
**Inputs:**
- BACKGROUND (blue) - base
- LAYER 1-N (blue) - dynamic
**Outputs:** IMAGE (blue)

**Panel Settings:**
- `layerCount` - Number of style layers

---

### Category F: Video Processing Nodes

#### 26. Video Frame Node
```
┌─────────────────────────────────┐
│  VIDEO FRAME                ... │
├─────────────────────────────────┤
│○ VIDEO                          │
│  Frame: [▼ First  ]             │○ FRAME
│  Time:  [0:00.000]              │
└─────────────────────────────────┘
```
**Purpose:** Extract frame from video
**Inputs:** VIDEO (red)
**Outputs:** FRAME/IMAGE (teal/blue)

---

### Category G: Utility Nodes

#### 27. Export Node
```
┌─────────────────────────────────┐
│  EXPORT                     ... │
├─────────────────────────────────┤
│○ IMAGE / VIDEO                  │
│  Format: [▼ PNG     ]           │
│  Quality: ────────●──           │
│                    [Download]   │
└─────────────────────────────────┘
```
**Purpose:** Export files for download
**Inputs:** IMAGE (blue) or VIDEO (red)
**Outputs:** None (terminal node)

**Status:** UI Only - Not Functional

---

#### 28. Sticky Note Node
```
┌─────────────────────────────────┐
│  📝 Note Title              ╳   │
├─────────────────────────────────┤
│  Note content goes here...      │
│                                 │
│  🎨 ● ● ● ● ●                   │
└─────────────────────────────────┘
```
**Purpose:** Add annotations to canvas
**Inputs:** None
**Outputs:** None

**Features:**
- 5 colors (yellow, pink, blue, green, purple)
- Resizable (200-800px wide, 150-600px tall)
- Editable title and content

---

#### 29. Group Node
```
┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  Group Label
│ ┌───────┐      ┌───────┐      │
  │ Node  │──────│ Node  │
│ └───────┘      └───────┘      │
└ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```
**Purpose:** Visually group related nodes
**Inputs:** None
**Outputs:** None

**Features:**
- Green dashed border
- Editable label
- Resizable (min 200x150px)
- Children constrained to parent

---

### Category H: Placeholder Nodes (Not Implemented)

| Category | Models | Status |
|----------|--------|--------|
| **Lip Sync** | kling_lipsync_a2v, kling_lipsync_t2v, sync_lipsync_v1/v2, tavus_hummingbird, latent_sync | UI Only |
| **Audio/TTS** | minimax_speech_hd/turbo, kokoro_tts, dia_tts, elevenlabs_tts/turbo, mmaudio_v2 | UI Only |
| **Upscaling** | topaz_video, creative_upscaler, esrgan, thera, drct | UI Only |
| **3D Generation** | trellis, hunyuan_3d_v2/mini/turbo | UI Only |
| **Utilities** | background_remove, image_to_svg, speech_to_text, whisper | UI Only |

---

## Part 3: Data Flow Patterns

### Pattern 1: Simple Generation
```
[Text] ──▶ [Image Model] ──▶ [Preview]
```

### Pattern 2: Prompt Building
```
[Text: Subject]     ──┐
[Text: Style]       ──┼──▶ [Concatenator] ──▶ [Image Model]
[Text: Environment] ──┘
```

### Pattern 3: Batch from LLM
```
[Text: Instructions] ──▶ [Any LLM] ──▶ [Array: Split by *] ──▶ [Options]
                                                                   │
                                                                   ▼
                                                           [Image Model]
```

### Pattern 4: Image to Video
```
[Text: Prompt] ──┐
                 ├──▶ [Video Model (I2V)]
[Import: Image] ─┘
```

### Pattern 5: Edit Pipeline
```
[Import] ──▶ [Crop] ──▶ [Levels] ──▶ [Compositor] ──▶ [Export]
                                          ▲
[Import: Overlay] ────────────────────────┘
```

### Pattern 6: Style Reference
```
[Import: Ref 1] ──┐
[Import: Ref 2] ──┼──▶ [Style Guide] ──▶ [Image Model]
[Import: Ref 3] ──┤
[Import: Ref 4] ──┘
```

---

## Part 4: Weavy.ai Comparison

### Feature Comparison

| Feature | Purple | Weavy.ai | Gap |
|---------|--------|----------|-----|
| Node-based canvas | ✅ | ✅ | - |
| Text nodes | ✅ | ✅ | - |
| Prompt concatenation | ✅ | ✅ | - |
| Array/Split nodes | ✅ | ✅ | - |
| Image generation | ✅ 15+ models | ✅ 10+ models | Purple ahead |
| Video generation | ✅ 13+ models | ✅ 5+ models | Purple ahead |
| Image editing | ✅ Basic | ✅ Advanced | Weavy ahead |
| Inpainting | ❌ | ✅ | Gap |
| Outpainting | ❌ | ✅ | Gap |
| Relighting | ❌ | ✅ | Gap |
| Z-depth extraction | ❌ | ✅ | Gap |
| App Mode | ✅ (Dashboard) | ✅ (Figma integration) | Different approach |
| Upscaling | ❌ UI only | ✅ | Gap |
| Background removal | ❌ UI only | ✅ | Gap |
| Masking tools | ❌ | ✅ | Gap |
| Typography tools | ❌ | ✅ | Gap |
| Blending modes | ✅ Basic | ✅ Full | Weavy ahead |
| Lip sync | ❌ UI only | ❌ | Both missing |
| 3D generation | ❌ UI only | ❌ | Both missing |

### Weavy Features to Add

1. **Inpainting Node** - Edit specific areas of images
2. **Outpainting Node** - Extend images beyond borders
3. **Relighting Node** - Change lighting in images
4. **Mask Node** - Create/edit masks for selective processing
5. **Typography Node** - Add text overlays to images
6. **Z-Depth Node** - Extract depth maps
7. **Upscaling Node** - Functional implementation
8. **Background Removal Node** - Functional implementation

---

## Part 5: Implementation Plan

### Phase 1: Complete Placeholder Nodes (P1)

#### 1.1 Upscaling Node
```typescript
// New file: components/nodes/UpscalingNode.tsx
Inputs: IMAGE
Outputs: IMAGE
Panel Settings:
  - scale: 2x | 4x
  - model: esrgan | real-esrgan | topaz
  - faceEnhance: boolean
```

**API Integration:**
- FAL.ai: `fal-ai/esrgan` or `fal-ai/real-esrgan`
- Replicate: Real-ESRGAN models

**Tasks:**
- [ ] Create UpscalingNode component
- [ ] Add to node type registry
- [ ] Implement FAL.ai API call
- [ ] Add panel settings
- [ ] Test with various image sizes

---

#### 1.2 Background Removal Node
```typescript
// New file: components/nodes/BackgroundRemovalNode.tsx
Inputs: IMAGE
Outputs: IMAGE (transparent PNG), MASK (optional)
Panel Settings:
  - model: rembg | remove.bg
  - outputMask: boolean
```

**API Integration:**
- FAL.ai: `fal-ai/rembg`
- remove.bg API

**Tasks:**
- [ ] Create BackgroundRemovalNode component
- [ ] Handle transparent PNG output
- [ ] Optional mask output port
- [ ] Add to toolbox

---

#### 1.3 Audio/TTS Nodes
```typescript
// New file: components/nodes/TTSNode.tsx
Inputs: TEXT
Outputs: AUDIO
Panel Settings:
  - voice: selection from provider
  - speed: 0.5-2.0
  - provider: elevenlabs | minimax | kokoro
```

**Tasks:**
- [ ] Create TTSNode component
- [ ] Integrate ElevenLabs API
- [ ] Add audio player preview
- [ ] Create audio port type handling

---

### Phase 2: New Editing Nodes (P2)

#### 2.1 Inpainting Node
```typescript
Inputs: IMAGE, MASK
Outputs: IMAGE
Panel Settings:
  - prompt: what to generate in masked area
  - model: flux_fill | ideogram_edit
```

**Tasks:**
- [ ] Create InpaintingNode component
- [ ] Integrate with Flux Fill or similar
- [ ] Create mask input handling
- [ ] Add to editing category

---

#### 2.2 Outpainting Node
```typescript
Inputs: IMAGE
Outputs: IMAGE
Panel Settings:
  - direction: left | right | top | bottom | all
  - amount: pixels to extend
  - prompt: context for generation
```

---

#### 2.3 Mask Node
```typescript
Inputs: IMAGE (optional reference)
Outputs: MASK
Features:
  - Brush painting
  - Threshold from image
  - Invert mask
```

---

#### 2.4 Typography Node
```typescript
Inputs: IMAGE (background)
Outputs: IMAGE
Panel Settings:
  - text: string
  - font: selection
  - size: number
  - color: hex
  - position: x, y
  - alignment: left | center | right
```

---

### Phase 3: Advanced Processing (P3)

#### 3.1 Relighting Node
```typescript
Inputs: IMAGE
Outputs: IMAGE
Panel Settings:
  - lightDirection: angle
  - intensity: 0-100
  - color: hex
```

---

#### 3.2 Z-Depth Node
```typescript
Inputs: IMAGE
Outputs: DEPTH_MAP (grayscale image)
Panel Settings:
  - model: midas | zoe
```

---

#### 3.3 Lip Sync Nodes
```typescript
Inputs: VIDEO, AUDIO
Outputs: VIDEO
Panel Settings:
  - model: wav2lip | sadtalker
```

---

### Phase 4: Quality of Life (P3)

#### 4.1 Node Search
- [ ] Add search bar to toolbox
- [ ] Filter nodes by name/category
- [ ] Keyboard shortcut (Cmd+K)

#### 4.2 Node Favorites
- [ ] Star/favorite nodes
- [ ] "Favorites" section in toolbox
- [ ] Persist to user preferences

#### 4.3 Node Presets
- [ ] Save node configurations
- [ ] Load presets
- [ ] Share presets

#### 4.4 Batch Processing
- [ ] Array → Model batch execution
- [ ] Progress tracking for batches
- [ ] Parallel execution option

---

## Part 6: Technical Specifications

### Adding a New Node Type

1. **Create Component** (`components/nodes/NewNode.tsx`)
```typescript
import React from 'react';
import BaseNode from '../BaseNode';

interface NewNodeProps {
  id: string;
  data: {
    label: string;
    content?: string;
    imageUrl?: string;
    panelSettings?: {
      // node-specific settings
    };
  };
  selected: boolean;
  onUpdate: (id: string, data: Partial<NodeData>) => void;
}

export default function NewNode({ id, data, selected, onUpdate }: NewNodeProps) {
  return (
    <BaseNode
      id={id}
      label={data.label}
      selected={selected}
      inputs={[{ label: 'INPUT', color: '#c084fc' }]}
      outputs={[{ label: 'OUTPUT', color: '#38bdf8' }]}
    >
      {/* Node content */}
    </BaseNode>
  );
}
```

2. **Register in NodeRenderer** (`components/NodeRenderer.tsx`)
```typescript
// Add to imports
import NewNode from './nodes/NewNode';

// Add to module configs
new_node: {
  inputs: [{ label: 'INPUT', color: pink, dataType: 'text' }],
  outputs: [{ label: 'OUTPUT', color: blue, dataType: 'image' }],
},

// Add to render switch
case 'new_node':
  return <NewNode {...props} />;
```

3. **Add Panel Config** (`nodePanelConfig.ts`)
```typescript
new_node: [
  { type: 'prompt', label: 'Prompt', required: true, dataType: 'string' },
  { type: 'seed', label: 'Seed', required: false, dataType: 'number' },
],
```

4. **Add to Toolbox** (wherever toolbox items are defined)
```typescript
{
  type: 'new_node',
  label: 'New Node',
  category: 'image',
  icon: <IconComponent />,
}
```

---

## Part 7: Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Node types available | 40+ | Count of functional nodes |
| Model integrations | 30+ | Count of AI model connections |
| Average workflow complexity | 8+ nodes | Analytics tracking |
| Node execution success rate | >95% | Error rate monitoring |
| User-created workflows | 1000+ | Database count |

---

## Appendix A: Port Type Reference

```typescript
// types.ts
export type DataType = 'text' | 'image' | 'video' | 'audio' | 'mask' | '3d_model' | 'file' | 'array' | 'number' | 'boolean';

export const PORT_COLORS: Record<DataType, string> = {
  text: '#c084fc',      // Pink
  image: '#38bdf8',     // Blue
  video: '#f87171',     // Red
  audio: '#fbbf24',     // Yellow
  mask: '#a78bfa',      // Purple
  '3d_model': '#2dd4bf', // Teal
  file: '#94a3b8',      // Slate
  array: '#94a3b8',     // Slate
  number: '#fb923c',    // Orange
  boolean: '#4ade80',   // Green
};
```

---

## Appendix B: Node Categories

```typescript
export const NODE_CATEGORIES = {
  text: ['text', 'prompt_enhancer', 'prompt_concatenator', 'any_llm', 'image_describer', 'video_describer'],
  data: ['array', 'options', 'number', 'toggle', 'seed', 'list'],
  image_gen: ['nano_banana_pro', 'flux_pro_1_1_ultra', 'ideogram_v3', 'imagen_3', ...],
  video_gen: ['veo_3_1', 'kling_2_6_pro', 'luma_ray_2', ...],
  editing: ['levels', 'compositor', 'crop', 'blur', 'invert', 'painter', 'channels'],
  video_proc: ['video_frame'],
  utility: ['import', 'export', 'file', 'preview', 'sticky_note', 'group'],
  audio: ['minimax_speech_hd', 'elevenlabs_tts', ...],
  upscaling: ['esrgan', 'topaz_video', ...],
  '3d': ['trellis', 'hunyuan_3d_v2', ...],
};
```

---

*Document maintained by Purple Engineering Team*
