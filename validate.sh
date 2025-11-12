#!/bin/bash

# HRIStudio Plugin Repository Validation Script
# This script provides convenient commands for plugin development and validation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is available
check_node() {
    if ! command -v node &> /dev/null; then
        error "Node.js is required but not installed."
        error "Please install Node.js from https://nodejs.org/"
        exit 1
    fi
}

# Validate JSON syntax
validate_json() {
    local file="$1"
    if ! node -e "JSON.parse(require('fs').readFileSync('$file', 'utf8'))" 2>/dev/null; then
        error "Invalid JSON syntax in $file"
        return 1
    fi
    return 0
}

# Validate all JSON files
validate_json_files() {
    log "Validating JSON syntax..."

    local valid=true

    for file in repository.json plugins/*.json; do
        if [ -f "$file" ]; then
            if validate_json "$file"; then
                success "✓ $file"
            else
                error "✗ $file"
                valid=false
            fi
        fi
    done

    if [ "$valid" = true ]; then
        success "All JSON files have valid syntax"
    else
        error "Some JSON files have syntax errors"
        return 1
    fi
}

# Validate plugins using the Node.js script
validate_plugins() {
    log "Validating plugins..."
    check_node

    if [ ! -f "scripts/validate-plugin.js" ]; then
        error "Plugin validator script not found: scripts/validate-plugin.js"
        return 1
    fi

    node scripts/validate-plugin.js validate-all
}

# Update plugin index
update_index() {
    log "Updating plugin index..."
    check_node

    if [ ! -f "scripts/validate-plugin.js" ]; then
        error "Plugin validator script not found: scripts/validate-plugin.js"
        return 1
    fi

    node scripts/validate-plugin.js update-index
}

# Start local development server
serve() {
    local port="${1:-8080}"
    log "Starting development server on port $port..."

    if command -v python3 &> /dev/null; then
        log "Using Python 3 HTTP server"
        python3 -m http.server "$port"
    elif command -v python &> /dev/null; then
        log "Using Python HTTP server"
        python -m SimpleHTTPServer "$port"
    elif command -v node &> /dev/null; then
        log "Using Node.js http-server (install with: npm install -g http-server)"
        if command -v http-server &> /dev/null; then
            http-server -p "$port" -c-1
        else
            error "http-server not found. Install with: npm install -g http-server"
            exit 1
        fi
    else
        error "No suitable HTTP server found. Please install Python or Node.js with http-server"
        exit 1
    fi
}

# Test the repository
test_repo() {
    log "Running repository tests..."

    # Validate JSON syntax
    validate_json_files || return 1

    # Validate plugins
    validate_plugins || return 1

    # Check assets exist
    log "Checking asset files..."
    local missing_assets=false

    for plugin_file in plugins/*.json; do
        if [ "$plugin_file" = "plugins/index.json" ] || [ "$plugin_file" = "plugins/*.json" ]; then
            continue
        fi

        local plugin_name=$(basename "$plugin_file" .json)
        log "Checking assets for $plugin_name..."

        # Extract asset paths and check they exist
        if [ -f "$plugin_file" ]; then
            local thumbnail=$(node -e "
                const plugin = JSON.parse(require('fs').readFileSync('$plugin_file', 'utf8'));
                console.log(plugin.assets?.thumbnailUrl || '');
            ")

            if [ -n "$thumbnail" ] && [ ! -f "$thumbnail" ]; then
                warn "Missing thumbnail: $thumbnail"
                missing_assets=true
            fi
        fi
    done

    if [ "$missing_assets" = true ]; then
        warn "Some assets are missing - this may cause display issues"
    fi

    # Test web interface
    log "Testing web interface..."
    if command -v curl &> /dev/null; then
        # Start server in background
        python3 -m http.server 8000 &>/dev/null &
        local server_pid=$!

        # Wait for server to start
        sleep 2

        # Test endpoints
        if curl -sf http://localhost:8000/index.html >/dev/null 2>&1; then
            success "✓ Web interface accessible"
        else
            error "✗ Web interface not accessible"
        fi

        if curl -sf http://localhost:8000/repository.json >/dev/null 2>&1; then
            success "✓ Repository metadata accessible"
        else
            error "✗ Repository metadata not accessible"
        fi

        # Cleanup
        kill $server_pid 2>/dev/null || true
    else
        warn "curl not available - skipping web interface test"
    fi

    success "Repository validation completed"
}

# Build for production
build() {
    log "Building repository for production..."

    # Validate everything first
    test_repo || return 1

    # Update index
    update_index

    # Optimize JSON files (remove extra whitespace)
    log "Optimizing JSON files..."
    for file in repository.json plugins/*.json; do
        if [ -f "$file" ]; then
            node -e "
                const fs = require('fs');
                const data = JSON.parse(fs.readFileSync('$file', 'utf8'));
                fs.writeFileSync('$file', JSON.stringify(data));
            "
            success "✓ Optimized $file"
        fi
    done

    success "Build completed - repository is ready for production"
}

# Create a new plugin template
create_plugin() {
    local robot_id="$1"

    if [ -z "$robot_id" ]; then
        error "Usage: $0 create <robot-id>"
        error "Example: $0 create my-robot"
        exit 1
    fi

    local plugin_file="plugins/${robot_id}.json"
    local asset_dir="assets/${robot_id}"

    if [ -f "$plugin_file" ]; then
        error "Plugin already exists: $plugin_file"
        exit 1
    fi

    log "Creating plugin template for $robot_id..."

    # Create asset directory
    mkdir -p "$asset_dir"

    # Create plugin template
    cat > "$plugin_file" << EOF
{
  "robotId": "$robot_id",
  "name": "Robot Name",
  "description": "Description of the robot platform",
  "platform": "ROS2",
  "version": "1.0.0",
  "pluginApiVersion": "1.0",
  "hriStudioVersion": ">=0.1.0",
  "trustLevel": "community",
  "category": "mobile-robot",

  "manufacturer": {
    "name": "Manufacturer Name",
    "website": "https://example.com",
    "support": "https://example.com/support"
  },

  "documentation": {
    "mainUrl": "https://example.com/docs"
  },

  "assets": {
    "thumbnailUrl": "$asset_dir/thumb.png",
    "images": {
      "main": "$asset_dir/main.jpg"
    }
  },

  "specs": {
    "dimensions": {
      "length": 0.5,
      "width": 0.3,
      "height": 0.2,
      "weight": 5.0
    },
    "capabilities": ["example_capability"]
  },

  "actions": [
    {
      "id": "example_action",
      "name": "Example Action",
      "description": "An example action for demonstration",
      "category": "movement",
      "icon": "move",
      "timeout": 30000,
      "retryable": true,
      "parameterSchema": {
        "type": "object",
        "properties": {
          "parameter": {
            "type": "string",
            "default": "value",
            "description": "Example parameter"
          }
        },
        "required": ["parameter"]
      },
      "ros2": {
        "messageType": "std_msgs/msg/String",
        "topic": "/example_topic",
        "payloadMapping": {
          "type": "transform",
          "transformFn": "exampleTransform"
        }
      }
    }
  ]
}
EOF

    success "✓ Created plugin template: $plugin_file"
    success "✓ Created asset directory: $asset_dir"
    warn "Don't forget to:"
    warn "  1. Edit the plugin details in $plugin_file"
    warn "  2. Add robot images to $asset_dir/"
    warn "  3. Run './validate.sh update-index' to include the plugin"
    warn "  4. Run './validate.sh validate' to check your plugin"
}

# Show help
show_help() {
    cat << EOF
HRIStudio Plugin Repository Development Tools

Usage: $0 <command> [arguments]

Commands:
  validate           Validate all plugins and repository metadata
  update-index      Update plugins/index.json with all plugin files
  serve [port]      Start local development server (default port: 8080)
  test              Run full test suite
  build             Build and optimize for production
  create <robot-id> Create a new plugin template
  help              Show this help message

Examples:
  $0 validate               # Validate all plugins
  $0 serve 3000            # Start server on port 3000
  $0 create my-robot       # Create new plugin template
  $0 test                  # Run all tests
  $0 build                 # Build for production

Requirements:
  - Node.js (for plugin validation)
  - Python 3 or Python 2 (for development server)
  - curl (for testing, optional)

EOF
}

# Main command dispatcher
main() {
    case "${1:-help}" in
        validate)
            validate_plugins
            ;;
        update-index)
            update_index
            ;;
        serve)
            serve "${2:-8080}"
            ;;
        test)
            test_repo
            ;;
        build)
            build
            ;;
        create)
            create_plugin "$2"
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            error "Unknown command: $1"
            echo
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
