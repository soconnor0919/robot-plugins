# HRIStudio Robot Plugins Repository

Official collection of robot plugins for the HRIStudio platform, providing standardized interfaces for controlling and interacting with different types of robots in Human-Robot Interaction research.

## Overview

This repository contains robot plugins that enable HRIStudio to work with various robot platforms including mobile robots, humanoid robots, manipulators, and drones. Each plugin provides a standardized interface for robot control, sensor data collection, and experiment execution.

## Available Plugins

### Mobile Robots
- **TurtleBot3 Burger** (`turtlebot3-burger`) - Compact educational robot platform
- **TurtleBot3 Waffle** (`turtlebot3-waffle`) - Extended TurtleBot3 with camera and additional sensors

### Humanoid Robots
- **NAO Humanoid** (`nao-humanoid`) - SoftBank Robotics NAO for social interaction research

## Quick Start

### Using Plugins in HRIStudio

1. **Add Repository**: In HRIStudio Admin panel, add this repository URL
2. **Install Plugins**: Browse and install plugins for your study
3. **Design Experiments**: Use plugin actions in the experiment designer
4. **Run Trials**: Execute experiments with real-time robot control

### Local Development

```bash
# Clone the repository
git clone https://github.com/soconnor0919/robot-plugins.git
cd robot-plugins

# Install development dependencies (optional)
npm install

# Start development server
./validate.sh serve

# Validate all plugins
./validate.sh validate

# Create a new plugin
./validate.sh create my-robot
```

## Repository Structure

```
robot-plugins/
├── repository.json         # Repository metadata
├── index.html             # Web interface
├── plugins/               # Plugin definitions
│   ├── index.json         # Plugin list
│   ├── turtlebot3-burger.json
│   ├── turtlebot3-waffle.json
│   └── nao-humanoid.json
├── assets/                # Visual assets
│   ├── repository-*.png   # Repository branding
│   ├── turtlebot3-burger/ # Robot images
│   ├── turtlebot3-waffle/
│   └── nao-humanoid/
├── docs/                  # Documentation
│   ├── schema.md          # Plugin schema reference
│   └── plugins.md         # Plugin development guide
├── scripts/               # Development tools
│   └── validate-plugin.js # Plugin validator
└── .github/workflows/     # CI/CD pipelines
```

## Plugin Development

### Creating a New Plugin

1. **Generate Template**:
   ```bash
   ./validate.sh create my-robot
   ```

2. **Edit Plugin Definition**: Update `plugins/my-robot.json` with robot details

3. **Add Assets**: Place robot images in `assets/my-robot/`

4. **Validate Plugin**:
   ```bash
   ./validate.sh validate
   ```

5. **Update Index**:
   ```bash
   ./validate.sh update-index
   ```

### Plugin Schema

Each plugin must include:

```json
{
  "robotId": "unique-robot-id",
  "name": "Robot Display Name",
  "platform": "ROS2|NAOqi|Custom",
  "version": "1.0.0",
  "pluginApiVersion": "1.0",
  "hriStudioVersion": ">=0.1.0",
  "trustLevel": "official|verified|community",
  "category": "mobile-robot|humanoid-robot|manipulator|drone",
  "actions": [...]
}
```

### Action Definitions

Actions define robot operations available in experiments:

```json
{
  "id": "action_name",
  "name": "Action Display Name",
  "category": "movement|interaction|sensors|logic",
  "parameterSchema": {
    "type": "object",
    "properties": {...},
    "required": [...]
  },
  "ros2": {
    "messageType": "geometry_msgs/msg/Twist",
    "topic": "/cmd_vel"
  }
}
```

## Development Tools

### Validation Script

```bash
# Validate all plugins and repository
./validate.sh validate

# Run full test suite
./validate.sh test

# Build for production
./validate.sh build

# Start development server
./validate.sh serve [port]
```

### Node.js Scripts

```bash
# Validate specific plugin
node scripts/validate-plugin.js validate plugins/my-robot.json

# Validate all plugins
npm run validate

# Update plugin index
npm run update-index

# Show repository statistics
npm run stats
```

## Web Interface

The repository includes a built-in web interface accessible at the repository URL. It provides:

- Repository information and statistics
- Plugin catalog with search and filtering
- Individual plugin details and documentation
- Asset preview and download links
- Installation instructions for HRIStudio

## Contributing

### Adding a Plugin

1. **Fork** this repository
2. **Create** your plugin using the template
3. **Add** comprehensive robot assets
4. **Validate** your plugin thoroughly
5. **Submit** a pull request

### Plugin Requirements

- Valid JSON syntax and schema compliance
- Complete action definitions with parameter schemas
- High-quality robot images (thumbnail, main, angles)
- Accurate robot specifications
- Working communication protocol configuration

### Review Process

All plugins undergo review for:
- Technical correctness
- Schema compliance
- Asset quality
- Documentation completeness
- Security considerations

## Integration with HRIStudio

### Repository Registration

Administrators can add this repository in HRIStudio:

1. Navigate to **Admin > Plugin Repositories**
2. Add repository URL: `https://repo.hristudio.com`
3. Set trust level and enable synchronization
4. Plugins become available for installation

### Study Installation

Researchers can install plugins for studies:

1. Go to **Study > Plugins**
2. Browse available plugins from registered repositories
3. Install required plugins for your research
4. Configure plugin settings as needed

### Experiment Design

Plugin actions appear in the experiment designer:

1. Drag actions from the **Block Library**
2. Configure parameters in the **Properties Panel**
3. Connect actions to create experiment flow
4. Test and validate your protocol

### Trial Execution

During live trials:

1. HRIStudio establishes robot connections
2. Wizard controls actions in real-time
3. All robot commands are logged
4. Sensor data is captured automatically

## API Compatibility

This repository supports:
- **Plugin API Version**: 1.0
- **HRIStudio Version**: 0.1.0+
- **Schema Version**: Latest

## Trust Levels

Plugins are classified by trust level:

- **Official**: Maintained by HRIStudio team or robot manufacturers
- **Verified**: Third-party plugins reviewed and tested
- **Community**: User-contributed plugins (use with caution)

## Support

- **Documentation**: [Plugin Development Guide](docs/plugins.md)
- **Schema Reference**: [Schema Documentation](docs/schema.md)
- **Issues**: [GitHub Issues](https://github.com/soconnor0919/robot-plugins/issues)
- **Email**: support@hristudio.com

## License

This repository is licensed under the MIT License. See [LICENSE](LICENSE) for details.

Individual plugins may have different licenses - please check each plugin's documentation.

## Acknowledgments

- ROBOTIS for TurtleBot3 platform support
- SoftBank Robotics for NAO platform documentation
- ROS2 community for standardized messaging
- HRIStudio research community for feedback and testing