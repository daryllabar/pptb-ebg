# Usage Guide - Early Bound Generator for PPTB

## Quick Start

1. **Install the Tool**
   - Build: `npm install && npm run build`
   - Install in Power Platform Tool Box by navigating to the tool directory

2. **Connect to Dataverse**
   - Use the PPTB connection manager to connect to your environment
   - The tool will automatically detect the active connection

3. **Configure Settings**
   - Fill in the form fields with your desired configuration

4. **Generate & Save**
   - Click "Generate Config JSON" to create the configuration
   - Click "Save Config to File" to save it for use with PAC CLI

## Using with PAC CLI

After generating and saving your configuration:

```bash
pac modelbuilder build --settings-file earlyBoundGeneratorConfig.json
```

See the full documentation for detailed configuration options.
