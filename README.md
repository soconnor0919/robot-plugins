# HRIStudio Robot Plugins Repository

This repository contains robot plugins for use with HRIStudio. Each plugin provides a standardized interface for controlling and interacting with different types of robots.

## Repository Structure

```
repository.json       # Repository metadata and configuration
index.html           # Web interface for viewing repository information
plugins/             # Directory containing all plugin files
  index.json         # List of available plugins
  plugin1.json       # Individual plugin definition
  plugin2.json       # Individual plugin definition
  ...
assets/              # Optional directory for repository assets
  icon.png          # Repository icon
  banner.jpg        # Repository banner
  logo.svg          # Repository logo
```

## Web Interface

The repository includes a built-in web interface (`index.html`) that provides a user-friendly way to view repository information. When hosting your repository on GitHub Pages or any web server, this interface will automatically:

- Display repository name, description, and metadata
- Show repository statistics (plugin count, downloads, stars)
- List author information and compatibility details
- Display repository tags and categories
- Show repository assets (icon, banner, logo)

The web interface is automatically available when you host your repository, making it easy for users to browse repository information before adding it to HRIStudio.

## Repository Configuration

The `repository.json` file contains the repository's metadata and configuration:

```json
{
  "id": "unique-repository-id",
  "name": "Repository Name",
  "description": "Repository description",
  "url": "https://example.com/repository",
  "author": {
    "name": "Author Name",
    "organization": "Organization Name",
    "url": "https://example.com"
  },
  "compatibility": {
    "hristudio": {
      "min": "1.0.0",
      "recommended": "1.1.0"
    },
    "ros2": {
      "distributions": ["humble", "iron"],
      "recommended": "humble"
    }
  },
  "assets": {
    "icon": "assets/icon.png",
    "banner": "assets/banner.jpg",
    "logo": "assets/logo.svg"
  },
  "stats": {
    "plugins": 0,
    "downloads": 0,
    "stars": 0
  },
  "tags": ["robots", "simulation", "education"]
}
```

## Plugin Structure

Each plugin is defined in a JSON file within the `plugins` directory. The `plugins/index.json` file contains a list of all available plugin files.

For detailed information about plugin structure and requirements, see the [Plugin Documentation](docs/plugins.md).

## Contributing

1. Fork this repository
2. Create your plugin branch (`git checkout -b my-new-plugin`)
3. Add your plugin JSON file to the `plugins` directory
4. Update `plugins/index.json` to include your plugin
5. Commit your changes (`git commit -am 'Add new plugin'`)
6. Push to the branch (`git push origin my-new-plugin`)
7. Create a new Pull Request

## License

This repository is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 