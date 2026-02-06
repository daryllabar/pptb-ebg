# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2026-02-06

### Added
- Initial release of Early Bound Generator for Power Platform ToolBox
- Complete GUI for configuring PAC ModelBuilder settings
- Support for all EarlyBoundGeneratorV2 configuration options:
  - Basic settings (namespace, service context, output paths)
  - Entity and action filtering (whitelists, skip lists, prefixes)
  - File organization (one-file-per, cleanup options)
  - Code generation options (constants, relationships, enums)
  - Naming and casing options (CamelCase, custom words)
  - Option set configuration
  - Advanced options
- Configuration management:
  - Generate configuration JSON
  - Save configuration to file
  - Load configuration from file
  - Copy configuration to clipboard
- Connection status monitoring
- Comprehensive documentation and examples
- Sample configuration files

### Features
- Intuitive web-based UI
- Real-time connection status display
- Type-safe TypeScript implementation
- Responsive design
- Support for all modern browsers

### Technical Details
- Built with TypeScript
- Uses Power Platform ToolBox API v1.0.11+
- Follows PPTB tool development best practices
- Clean, maintainable code architecture

