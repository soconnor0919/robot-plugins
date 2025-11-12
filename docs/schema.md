# HRIStudio Plugin Schema Documentation

This document describes the schema for HRIStudio robot plugins, including both repository metadata and individual plugin definitions.

## Repository Metadata (`repository.json`)

The repository metadata file defines the plugin repository and its capabilities:

```json
{
  "id": "string (required) - Unique repository identifier",
  "name": "string (required) - Display name",
  "description": "string (optional) - Repository description",
  "apiVersion": "string (required) - Repository API version",
  "pluginApiVersion": "string (required) - Plugin API version supported",
  "urls": {
    "repository": "string (URL, required) - Repository base URL",
    "git": "string (URL, optional) - Git repository URL"
  },
  "official": "boolean (required) - Whether this is an official repository",
  "trust": "string (enum: official|verified|community, required)",
  "author": {
    "name": "string (required)",
    "email": "string (email, optional)",
    "url": "string (URL, optional)",
    "organization": "string (optional)"
  },
  "maintainers": [
    {
      "name": "string (required)",
      "email": "string (email, optional)",
      "url": "string (URL, optional)"
    }
  ],
  "homepage": "string (URL, optional)",
  "license": "string (required) - License identifier",
  "defaultBranch": "string (required) - Default Git branch",
  "lastUpdated": "string (ISO date, required)",
  "categories": [
    {
      "id": "string (required) - Category identifier",
      "name": "string (required) - Display name",
      "description": "string (required) - Category description"
    }
  ],
  "compatibility": {
    "hristudio": {
      "min": "string (semver, required) - Minimum HRIStudio version",
      "recommended": "string (semver, optional) - Recommended version"
    },
    "ros2": {
      "distributions": "string[] (optional) - Supported ROS2 distributions",
      "recommended": "string (optional) - Recommended distribution"
    }
  },
  "assets": {
    "icon": "string (path, optional) - Repository icon",
    "logo": "string (path, optional) - Repository logo",
    "banner": "string (path, optional) - Repository banner"
  },
  "tags": "string[] (required) - Repository tags",
  "stats": {
    "plugins": "number (required) - Number of plugins"
  }
}
```

## Plugin Schema

Each plugin is defined in a JSON file with HRIStudio-specific extensions:

### Core Properties

```json
{
  "robotId": "string (required) - Unique robot identifier",
  "name": "string (required) - Display name",
  "description": "string (optional) - Robot description",
  "platform": "string (required) - Robot platform (e.g., 'ROS2')",
  "version": "string (required) - Plugin version (semver)",
  "pluginApiVersion": "string (required) - Plugin API version",
  "hriStudioVersion": "string (required) - Minimum HRIStudio version",
  "trustLevel": "string (enum: official|verified|community, required)",
  "category": "string (required) - Plugin category identifier"
}
```

### Manufacturer Information

```json
"manufacturer": {
  "name": "string (required)",
  "website": "string (URL, optional)",
  "support": "string (URL, optional)"
}
```

### Documentation Links

```json
"documentation": {
  "mainUrl": "string (URL, required)",
  "apiReference": "string (URL, optional)",
  "wikiUrl": "string (URL, optional)",
  "videoUrl": "string (URL, optional)"
}
```

### Assets Configuration

```json
"assets": {
  "thumbnailUrl": "string (path, required)",
  "images": {
    "main": "string (path, required)",
    "angles": {
      "front": "string (path, optional)",
      "side": "string (path, optional)",
      "top": "string (path, optional)"
    },
    "logo": "string (path, optional)"
  },
  "model": {
    "format": "string (enum: URDF|glTF|STL, optional)",
    "url": "string (URL, optional)"
  }
}
```

### Robot Specifications

```json
"specs": {
  "dimensions": {
    "length": "number (meters, required)",
    "width": "number (meters, required)",
    "height": "number (meters, required)",
    "weight": "number (kg, required)"
  },
  "capabilities": "string[] (required) - List of robot capabilities",
  "maxSpeed": "number (m/s, optional)",
  "batteryLife": "number (hours, optional)"
}
```

### ROS2 Configuration

```json
"ros2Config": {
  "namespace": "string (required) - Default ROS2 namespace",
  "nodePrefix": "string (required) - Node name prefix",
  "defaultTopics": {
    "[topicName]": "string (topic path) - Default topic mappings"
  }
}
```

## Action Definitions

Actions define the operations that can be performed with the robot. Each action follows this HRIStudio-specific schema:

```json
{
  "id": "string (required) - Unique action identifier (snake_case)",
  "name": "string (required) - Display name for UI",
  "description": "string (optional) - Action description",
  "category": "string (enum: movement|interaction|sensors|logic, required)",
  "icon": "string (optional) - Lucide icon name",
  "timeout": "number (milliseconds, optional) - Default timeout",
  "retryable": "boolean (optional) - Whether action can be retried on failure",
  "parameterSchema": {
    "type": "object (required)",
    "properties": {
      "[paramName]": {
        "type": "string (JSON Schema type, required)",
        "minimum": "number (optional) - For numeric types",
        "maximum": "number (optional) - For numeric types",
        "default": "any (optional) - Default value",
        "description": "string (required) - Parameter description",
        "enum": "string[] (optional) - For enum types"
      }
    },
    "required": "string[] (required) - List of required parameters"
  },
  "ros2": {
    "messageType": "string (required) - ROS2 message type",
    "topic": "string (optional) - Topic name for publishers",
    "service": "string (optional) - Service name for service calls",
    "action": "string (optional) - Action name for action calls",
    "payloadMapping": {
      "type": "string (enum: transform|static, required)",
      "transformFn": "string (optional) - Transform function name",
      "payload": "object (optional) - Static payload for static type"
    },
    "qos": {
      "reliability": "string (enum: reliable|best_effort, optional)",
      "durability": "string (enum: volatile|transient_local, optional)",
      "history": "string (enum: keep_last|keep_all, optional)",
      "depth": "number (optional) - Queue depth for keep_last"
    }
  }
}
```

## Action Categories

HRIStudio organizes actions into these standard categories:

- **movement**: Robot locomotion and positioning
- **interaction**: Communication and social behaviors
- **sensors**: Data collection and environmental sensing
- **logic**: Control flow and decision making

## Trust Levels

Plugins are classified by trust level:

- **official**: Maintained by HRIStudio team or robot manufacturer
- **verified**: Third-party plugins that have been reviewed and tested
- **community**: User-contributed plugins without formal verification

## Validation Requirements

### Required Fields
All plugins must include:
- Core properties (robotId, name, platform, version)
- HRIStudio metadata (pluginApiVersion, hriStudioVersion, trustLevel, category)
- At least one action definition
- Valid manufacturer information
- Asset thumbnailUrl

### Naming Conventions
- `robotId`: lowercase with hyphens (e.g., "turtlebot3-burger")
- `action.id`: snake_case (e.g., "move_velocity")
- `category`: predefined enum values only

### Version Requirements
- Plugin version must follow semantic versioning (semver)
- HRIStudio version must use semver range syntax (e.g., ">=0.1.0")

## Example Implementation

See `plugins/turtlebot3-burger.json` for a complete reference implementation demonstrating all schema features and best practices.