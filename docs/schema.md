# Plugin Schema Documentation

This document describes the schema for HRIStudio robot plugins.

## Repository Metadata

The repository itself is defined by a `repository.json` file with the following structure:

```json
{
  "id": string,
  "name": string,
  "description": string?,
  "urls": {
    "repository": string (URL),
    "git": string (URL)?
  },
  "official": boolean,
  "author": {
    "name": string,
    "email": string (email)?,
    "url": string (URL)?,
    "organization": string?
  },
  "maintainers": [
    {
      "name": string,
      "email": string (email)?,
      "url": string (URL)?
    }
  ]?,
  "homepage": string (URL)?,
  "license": string,
  "defaultBranch": string,
  "lastUpdated": string (ISO date),
  "trust": "official" | "verified" | "community",
  "assets": {
    "icon": string?,
    "logo": string?,
    "banner": string?
  },
  "compatibility": {
    "hristudio": {
      "min": string,
      "recommended": string?
    },
    "ros2": {
      "distributions": string[],
      "recommended": string?
    }?
  },
  "tags": string[],
  "stats": {
    "plugins": number
  }?
}
```

## Plugin Schema

Each plugin is defined in a JSON file with the following top-level structure:

```json
{
  "robotId": string,
  "name": string,
  "description": string?,
  "platform": string,
  "version": string,
  "manufacturer": object,
  "documentation": object,
  "assets": object,
  "specs": object,
  "ros2Config": object,
  "actions": array
}
```

## Core Properties

### Required Properties

- `robotId`: Unique identifier for the robot (e.g., "turtlebot3-burger")
- `name`: Display name of the robot
- `platform`: Robot platform/framework (e.g., "ROS2")
- `version`: Plugin version (semver format)

### Optional Properties

- `description`: Detailed description of the robot

## Manufacturer Information

```json
"manufacturer": {
  "name": string,
  "website": string (URL)?,
  "support": string (URL)?
}
```

## Documentation Links

```json
"documentation": {
  "mainUrl": string (URL),
  "apiReference": string (URL)?,
  "wikiUrl": string (URL)?,
  "videoUrl": string (URL)?
}
```

## Assets Configuration

```json
"assets": {
  "thumbnailUrl": string,
  "logo": string?,
  "images": {
    "main": string,
    "angles": {
      "front": string?,
      "side": string?,
      "top": string?
    }
  },
  "model": {
    "format": "URDF" | "glTF" | "other",
    "url": string (URL)
  }?
}
```

## Robot Specifications

```json
"specs": {
  "dimensions": {
    "length": number,
    "width": number,
    "height": number,
    "weight": number
  },
  "capabilities": string[],
  "maxSpeed": number,
  "batteryLife": number
}
```

## ROS2 Configuration

```json
"ros2Config": {
  "namespace": string,
  "nodePrefix": string,
  "defaultTopics": {
    [key: string]: string
  }
}
```

## Actions

Each action in the `actions` array follows this structure:

```json
{
  "actionId": string,
  "type": "move" | "speak" | "wait" | "input" | "gesture" | "record" | "condition" | "loop",
  "title": string,
  "description": string,
  "icon": string?,
  "parameters": {
    "type": "object",
    "properties": {
      [key: string]: {
        "type": string,
        "title": string,
        "description": string?,
        "default": any?,
        "minimum": number?,
        "maximum": number?,
        "enum": string[]?,
        "unit": string?
      }
    },
    "required": string[]
  },
  "ros2": {
    "messageType": string,
    "topic": string?,
    "service": string?,
    "action": string?,
    "payloadMapping": {
      "type": "direct" | "transform",
      "map": object?,
      "transformFn": string?
    },
    "qos": {
      "reliability": "reliable" | "best_effort",
      "durability": "volatile" | "transient_local",
      "history": "keep_last" | "keep_all",
      "depth": number?
    }?
  }
}
```

## QoS Settings

When specifying ROS2 QoS settings:

- `reliability`: Message delivery guarantee
  - `reliable`: Guaranteed delivery
  - `best_effort`: Fast but may drop messages

- `durability`: Message persistence
  - `volatile`: Only delivered to active subscribers
  - `transient_local`: Stored for late-joining subscribers

- `history`: Message queue behavior
  - `keep_last`: Store up to N messages (specify with depth)
  - `keep_all`: Store all messages

## Example

See the TurtleBot3 Burger plugin for a complete example implementation. 