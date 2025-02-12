# HRIStudio Robot Plugins

This repository contains robot plugins for use with HRIStudio, a platform for designing and executing human-robot interaction experiments.

## Repository Structure

```
robot-plugins/
├── plugins/         # Robot plugin definitions (JSON)
├── assets/         # Robot images and 3D models
│   └── {robotId}/  # Assets for each robot
└── docs/           # Plugin documentation
```

## Adding a New Robot Plugin

1. Create a new JSON file in the `plugins` directory with your robot's plugin definition
2. Add required assets to the `assets/{robotId}` directory
3. Update documentation if needed
4. Submit a pull request

## Required Files

For each robot plugin, you need:

### Plugin Definition
- `plugins/{robotId}.json` - Plugin configuration file

### Assets
- `assets/{robotId}/thumb.png` - Thumbnail image (160x160px)
- `assets/{robotId}/main.png` - Main image (16:9 aspect ratio)
- `assets/{robotId}/dimensions.png` - Technical drawing (optional)
- Additional views (optional):
  - `assets/{robotId}/front.png`
  - `assets/{robotId}/side.png`
  - `assets/{robotId}/top.png`

## Plugin Schema

See [docs/schema.md](docs/schema.md) for the complete plugin schema documentation.

## Example Plugin

See the TurtleBot3 Burger plugin (`plugins/turtlebot3-burger.json`) for a complete example.

## Contributing

1. Fork this repository
2. Create your plugin following the structure above
3. Test your plugin with HRIStudio
4. Submit a pull request

## License

MIT License - See LICENSE file for details 