# Early Bound Generator for Power Platform ToolBox

A Power Platform ToolBox tool for configuring and generating PAC ModelBuilder settings for early bound class generation. This tool is a port of the EarlyBoundGeneratorV2 from the DLaB.Xrm.XrmToolBoxTools repository.

## Overview

This tool provides a graphical user interface for configuring all the options needed to generate early bound classes using the PAC CLI's `pac modelbuilder` command. Instead of manually creating configuration JSON files, you can use this tool to:

- Configure all early bound generation settings through an intuitive UI
- Generate a complete configuration JSON file
- Save/load configuration files for reuse
- Copy configuration to clipboard for quick use

## Features

### Basic Settings
- Configure namespace and service context name
- Set output paths for entities, option sets, and messages
- Control message/action generation

### Entity & Action Filtering
- Whitelist specific entities or actions
- Skip entities or actions by name or prefix
- Filter by entity/action prefixes

### File Organization
- Create one file per entity, option set, or action
- Automatically clean output folders before generation
- Add new files to project automatically

### Code Generation Options
- Generate attribute name constants
- Generate anonymous type constructors
- Generate entity relationships
- Generate enum properties for option sets
- Control entity type codes and virtual attributes

### Naming & Casing Options
- CamelCase class and member names
- Adjust casing for enum options
- Custom word dictionary for camelcasing
- Override entity class names

### Option Set Options
- Add option set metadata attributes
- Generate all option set label metadata

### Advanced Options
- Add file prefix text (copyright, pragma directives)
- Control builder settings JSON updates
- Cleanup legacy CrmSvcUtil files

## Installation

1. Build the tool:
   ```bash
   npm install
   npm run build
   ```

2. Install in Power Platform Tool Box:
   - Open Power Platform Tool Box
   - Go to Tools section
   - Click "Install Tool"
   - Navigate to the built tool directory and select it

## Usage

1. **Connect to Environment**: Connect to your Dataverse environment using the Power Platform Tool Box connection manager

2. **Configure Settings**: Fill in the configuration options in the UI:
   - Set your namespace and service context name
   - Configure output paths
   - Select which entities/actions to generate
   - Choose code generation options

3. **Generate Configuration**: Click "Generate Config JSON" to create the configuration

4. **Save Configuration**: Click "Save Config to File" to save the JSON configuration to a file

5. **Use with PAC CLI**: Use the generated configuration file with the PAC ModelBuilder command:
   ```bash
   pac modelbuilder build --settings-file earlyBoundGeneratorConfig.json
   ```

## Configuration File Format

The tool generates a JSON configuration file compatible with the PAC ModelBuilder command. The configuration follows the structure defined by the DLaB.EarlyBoundGeneratorV2 settings format.

Example configuration:
```json
{
  "Namespace": "YourCompany.Crm",
  "ServiceContextName": "XrmServiceContext",
  "EntityTypesFolder": "Entities",
  "ExtensionConfig": {
    "BuilderSettingsJsonRelativePath": "builderSettings.json",
    "EntitiesWhitelist": "account|contact|opportunity",
    "CreateOneFilePerEntity": true,
    "GenerateAttributeNameConsts": true
  }
}
```

## Development

### Build
```bash
npm run build
```

### Watch Mode
```bash
npm run watch
```

## Links

- [Power Platform Tool Box](https://github.com/PowerPlatformToolBox)
- [Original EarlyBoundGeneratorV2](https://github.com/daryllabar/DLaB.Xrm.XrmToolBoxTools)
- [PAC CLI Documentation](https://learn.microsoft.com/en-us/power-platform/developer/cli/introduction)

## License

MIT License - See LICENSE file for details

## Author

Daryl LaBar
- GitHub: [@daryllabar](https://github.com/daryllabar)

## Credits

This tool is a port of the EarlyBoundGeneratorV2 from the DLaB.Xrm.XrmToolBoxTools repository. Thanks to Daryl LaBar for the original implementation.
