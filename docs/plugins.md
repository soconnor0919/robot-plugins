# HRIStudio Robot Plugins

This document explains how robot plugins work in HRIStudio and provides guidance for plugin developers.

## Overview

HRIStudio uses a plugin-based architecture to support different robot platforms. Each plugin defines:

- Robot capabilities and specifications
- Available actions for experiment design
- ROS2 integration details
- Communication protocols

## Plugin Structure

### Core Components

1. **Robot Definition**: Basic information about the robot platform
2. **Action Library**: Operations that can be performed during experiments
3. **ROS2 Integration**: Message types, topics, and communication setup
4. **Assets**: Images, models, and visual resources

### Plugin Lifecycle

1. **Repository Registration**: Plugin repositories are added to HRIStudio
2. **Plugin Discovery**: Available plugins are fetched from repositories
3. **Study Installation**: Plugins are installed for specific studies
4. **Experiment Integration**: Actions become available in the experiment designer
5. **Trial Execution**: Actions are executed during live trials

## Action System

### Action Types

Actions are the building blocks of experiments. HRIStudio supports four main categories:

#### Movement Actions
- Robot locomotion and positioning
- Navigation and path planning
- Velocity control and stopping

#### Interaction Actions
- Speech synthesis and audio playback
- Gesture and animation control
- Display and lighting effects

#### Sensor Actions
- Data collection from sensors
- Environmental monitoring
- State queries and feedback

#### Logic Actions
- Conditional operations
- Loops and iteration
- Variable manipulation

### Parameter Schema

Each action defines parameters using JSON Schema format:

```json
{
  "type": "object",
  "properties": {
    "speed": {
      "type": "number",
      "minimum": 0,
      "maximum": 1.0,
      "default": 0.5,
      "description": "Movement speed as fraction of maximum"
    }
  },
  "required": ["speed"]
}
```

### ROS2 Integration

Actions can integrate with ROS2 through:

- **Topics**: Publishing messages for robot control
- **Services**: Synchronous request/response operations
- **Actions**: Long-running operations with feedback

## Plugin Development

### Basic Plugin Structure

```json
{
  "robotId": "my-robot",
  "name": "My Robot",
  "description": "Custom robot for research",
  "platform": "ROS2",
  "version": "1.0.0",
  "pluginApiVersion": "1.0",
  "hriStudioVersion": ">=0.1.0",
  "trustLevel": "community",
  "category": "mobile-robot",
  
  "manufacturer": {
    "name": "Research Lab",
    "website": "https://example.com"
  },
  
  "assets": {
    "thumbnailUrl": "assets/my-robot/thumb.png"
  },
  
  "actions": []
}
```

### Creating Actions

Each action needs:

1. **Unique ID**: Snake_case identifier
2. **Clear Name**: Human-readable title
3. **Category**: One of the four main types
4. **Parameters**: JSON Schema definition
5. **ROS2 Config**: Communication details

Example action:

```json
{
  "id": "move_forward",
  "name": "Move Forward",
  "description": "Move the robot forward by a specified distance",
  "category": "movement",
  "icon": "arrow-up",
  "timeout": 30000,
  "retryable": true,
  
  "parameterSchema": {
    "type": "object",
    "properties": {
      "distance": {
        "type": "number",
        "minimum": 0.1,
        "maximum": 5.0,
        "default": 1.0,
        "description": "Distance to move in meters"
      }
    },
    "required": ["distance"]
  },
  
  "ros2": {
    "messageType": "geometry_msgs/msg/Twist",
    "topic": "/cmd_vel",
    "payloadMapping": {
      "type": "transform",
      "transformFn": "transformToTwist"
    }
  }
}
```

### Asset Management

Plugins should include visual assets:

- **Thumbnail**: 200x150px preview image
- **Main Image**: High-resolution robot photo
- **Angle Views**: Front, side, top perspectives
- **Logo**: Manufacturer or robot series logo

Assets are served relative to the repository URL.

### Testing Plugins

Before publishing, test your plugin:

1. Validate JSON syntax and schema
2. Verify all asset URLs are accessible
3. Test ROS2 message formats
4. Check parameter validation
5. Ensure timeout values are reasonable

## Integration with HRIStudio

### Repository Management

Administrators can add plugin repositories in HRIStudio:

1. Navigate to Admin > Plugin Repositories
2. Add repository URL
3. Set trust level and enable sync
4. Plugins become available for installation

### Study-Level Installation

Researchers install plugins for specific studies:

1. Go to Study > Plugins
2. Browse available plugins
3. Install required plugins
4. Configure plugin settings

### Experiment Design

Installed plugin actions appear in the experiment designer:

1. Drag actions from the block library
2. Configure parameters in the properties panel
3. Connect actions to create experiment flow
4. Test and validate the experiment protocol

### Trial Execution

During trials, HRIStudio:

1. Establishes ROS2 connections
2. Validates action parameters
3. Sends commands to robots
4. Monitors execution status
5. Logs all events for analysis

## Best Practices

### Plugin Design

- Use clear, descriptive action names
- Provide comprehensive parameter validation
- Include helpful descriptions for all parameters
- Choose appropriate timeout values
- Make actions atomic and focused

### ROS2 Integration

- Follow ROS2 naming conventions
- Use appropriate QoS settings
- Handle connection failures gracefully
- Implement proper error reporting
- Document message format requirements

### Asset Management

- Use consistent image dimensions
- Optimize file sizes for web delivery
- Provide high-quality thumbnails
- Include multiple viewing angles
- Ensure assets load quickly

### Documentation

- Document all action behaviors
- Provide usage examples
- Explain parameter effects
- Include troubleshooting tips
- Maintain version compatibility notes

## Repository Hosting

### File Structure

```
repository/
├── repository.json       # Repository metadata
├── index.html           # Web interface
├── plugins/
│   ├── index.json       # Plugin list
│   └── robot-name.json  # Individual plugins
└── assets/
    ├── repository-icon.png
    └── robot-name/
        ├── thumb.png
        ├── main.jpg
        └── angles/
```

### Hosting Requirements

- HTTPS enabled
- CORS headers configured
- Static file serving
- Reliable uptime
- Fast response times

### Version Management

- Use semantic versioning
- Maintain backward compatibility
- Document breaking changes
- Provide migration guides
- Archive old versions

## Security Considerations

### Trust Levels

- **Official**: Signed and verified plugins
- **Verified**: Community plugins that passed review
- **Community**: User-contributed, use with caution

### Validation

- All plugins are validated against schema
- Parameters are sanitized before execution
- ROS2 messages are type-checked
- Network communications are monitored

### Permissions

- Plugins run with limited permissions
- Robot access is study-scoped
- Actions can be disabled by administrators
- Audit logs track all plugin activities

## Troubleshooting

### Common Issues

1. **Plugin Not Loading**: Check JSON syntax and schema compliance
2. **Assets Not Found**: Verify asset URLs and file paths
3. **ROS2 Connection Failed**: Check topic names and message types
4. **Action Timeout**: Increase timeout or check robot connectivity
5. **Parameter Validation**: Ensure all required parameters are provided

### Debug Tools

- Use browser developer tools for network issues
- Check HRIStudio logs for plugin errors
- Validate JSON files with online tools
- Test ROS2 connections independently
- Monitor robot topics and services

## Contributing

To contribute to the official plugin repository:

1. Fork the repository
2. Create a new plugin file
3. Add assets and documentation
4. Test thoroughly
5. Submit a pull request

For questions or support, contact the HRIStudio development team.