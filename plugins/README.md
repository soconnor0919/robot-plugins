# Robot Plugins

This directory contains individual robot plugin definitions for the HRIStudio platform.

## Available Plugins

### Mobile Robots

- **turtlebot3-burger.json** - Compact educational robot platform
- **turtlebot3-waffle.json** - Extended TurtleBot3 with camera and additional sensors

### Humanoid Robots

- **nao-humanoid.json** - NAO humanoid robot for social interaction research

## Plugin Structure

Each plugin file defines:

- Robot specifications and capabilities
- Available actions for experiment design
- Communication protocol configuration
- Asset references for UI display

## Adding New Plugins

1. Create a new JSON file following the schema
2. Add robot assets to the `assets/` directory
3. Update `index.json` to include the new plugin
4. Test the plugin definition for validity

## Schema Validation

All plugins must conform to the HRIStudio plugin schema. See `../docs/schema.md` for complete documentation.

## Asset Requirements

Each plugin should include:
- Thumbnail image (200x150px)
- Main robot image
- Multiple angle views
- Manufacturer logo (optional)

Assets are served relative to the repository root URL.