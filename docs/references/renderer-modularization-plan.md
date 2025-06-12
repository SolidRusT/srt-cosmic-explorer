# Renderer Modularization Plan

## Current State
- `renderer.js`: 100KB monolithic file
- Contains: rendering, combat, AI, effects, particles, UI elements, ship systems, enemy management
- Too large for efficient debugging and AI assistance

## Target Architecture
Break down into focused modules, each under 15KB for easy AI targeting:

### Core Modules

#### 1. RenderCore.js (~10KB)
- Main Renderer class shell
- Canvas management
- Camera system
- Main render loop
- Module coordination

#### 2. StarFieldRenderer.js (~8KB)
- Star generation and rendering
- Nebula effects
- Background parallax
- Region theme management

#### 3. ShipRenderer.js (~12KB)
- Player ship rendering
- Pod rendering
- Ship trails and effects
- Shield/armor/hull visualization
- Ship type variations
- Pod augmentation indicators

#### 4. CombatRenderer.js (~12KB)
- Enemy ship rendering
- Projectile system
- Damage numbers
- Target locks
- Combat effects
- Health bars

#### 5. EffectsRenderer.js (~10KB)
- Warp effects
- Scan effects
- Screen flash
- Explosions
- Regional particle effects
- Visual events

#### 6. ParticleSystem.js (~8KB)
- Particle management
- Particle types
- Emission patterns
- Particle physics
- Optimization

#### 7. EnemyAI.js (~10KB)
- Enemy behavior states
- Movement patterns
- Attack logic
- Target acquisition
- Formation flying

#### 8. EntityRenderer.js (~10KB)
- Planets
- Stations
- Asteroids
- Wrecks
- Cargo containers
- Merchants
- Trade ships

#### 9. UIRenderer.js (~10KB)
- Capacitor UI
- Ship status bars
- Damage overlay
- HUD elements
- Debug overlays

#### 10. RegionEffects.js (~8KB)
- Region-specific visuals
- Trade ship spawning
- Environmental hazards
- Ambient effects
- Dynamic backgrounds

## Implementation Steps

### Phase 1: Create Module Structure
1. Create base classes for each module
2. Define interfaces between modules
3. Set up module loader

### Phase 2: Extract and Refactor
1. Move star/nebula code to StarFieldRenderer
2. Extract ship rendering to ShipRenderer
3. Separate combat visuals to CombatRenderer
4. Move effects to EffectsRenderer
5. Extract particle logic to ParticleSystem

### Phase 3: Integration
1. Update RenderCore to coordinate modules
2. Ensure proper communication between modules
3. Test each module independently
4. Verify performance

### Phase 4: Cleanup
1. Remove old renderer.js
2. Update all references
3. Document module interfaces
4. Create usage examples

## Module Communication

### Event System
```javascript
// RenderCore dispatches events
this.events.emit('ship.damaged', { damage: 10 });

// Modules listen and react
this.events.on('ship.damaged', (data) => {
    this.createDamageEffect(data.damage);
});
```

### Shared State
```javascript
// Central state managed by RenderCore
const renderState = {
    camera: { x: 0, y: 0, zoom: 1 },
    ship: { x: 0, y: 0, angle: 0 },
    particles: [],
    enemies: []
};
```

### Module Registry
```javascript
// Modules register themselves
class StarFieldRenderer {
    constructor(core) {
        this.core = core;
        core.registerModule('starField', this);
    }
}
```

## Benefits

1. **Better AI Assistance**: Each module is small enough for AI to fully understand
2. **Easier Debugging**: Issues isolated to specific modules
3. **Parallel Development**: Multiple modules can be worked on simultaneously
4. **Performance**: Only load needed modules
5. **Testing**: Each module can be unit tested
6. **Maintenance**: Clear separation of concerns

## Example Module Structure

```javascript
// StarFieldRenderer.js
export default class StarFieldRenderer {
    constructor(core) {
        this.core = core;
        this.ctx = core.ctx;
        this.stars = [];
        this.nebulae = [];
        this.init();
    }
    
    init() {
        this.generateStars();
        this.generateNebulae();
    }
    
    render() {
        this.renderNebulae();
        this.renderStars();
    }
    
    updateTheme(theme) {
        this.regionTheme = theme;
        this.regenerate();
    }
}
```

## Migration Strategy

1. **Keep old renderer.js working** during migration
2. **Create modules one by one** and test individually
3. **Use feature flags** to switch between old/new
4. **Gradual rollout** with fallback options
5. **Performance monitoring** to ensure no regression

## Success Metrics

- Each module < 15KB
- No circular dependencies
- Clear module boundaries
- Improved load time
- Easier debugging
- Better AI comprehension
