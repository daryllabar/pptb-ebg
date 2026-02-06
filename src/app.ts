/// <reference types="@pptb/types" />

// Type definitions for our configuration
interface EarlyBoundGeneratorConfig {
    // Basic Settings
    Namespace?: string;
    ServiceContextName?: string;
    
    // Output Paths
    EntityTypesFolder?: string;
    OptionSetsTypesFolder?: string;
    MessageTypesFolder?: string;
    
    // Flags
    GenerateMessages?: boolean;
    EmitEntityETC?: boolean;
    EmitVirtualAttributes?: boolean;
    SuppressGeneratedCodeAttribute?: boolean;
    IncludeCommandLine?: boolean;
    UpdateBuilderSettingsJson?: boolean;
    
    // Extension Config
    ExtensionConfig?: ExtensionConfig;
}

interface ExtensionConfig {
    // Builder Settings Path
    BuilderSettingsJsonRelativePath?: string;
    
    // Entity/Action Filtering
    EntitiesWhitelist?: string;
    EntitiesToSkip?: string;
    EntityPrefixesWhitelist?: string;
    EntityPrefixesToSkip?: string;
    ActionsWhitelist?: string;
    ActionsToSkip?: string;
    ActionPrefixesWhitelist?: string;
    
    // File Organization
    CreateOneFilePerEntity?: boolean;
    CreateOneFilePerOptionSet?: boolean;
    CreateOneFilePerAction?: boolean;
    DeleteFilesFromOutputFolders?: boolean;
    AddNewFilesToProject?: boolean;
    
    // Code Generation Options
    GenerateAttributeNameConsts?: boolean;
    GenerateActionAttributeNameConsts?: boolean;
    GenerateAnonymousTypeConstructor?: boolean;
    GenerateConstructorsSansLogicalName?: boolean;
    GenerateEntityRelationships?: boolean;
    GenerateEnumProperties?: boolean;
    GenerateGlobalOptionSets?: boolean;
    AddDebuggerNonUserCode?: boolean;
    
    // Naming Options
    CamelCaseClassNames?: boolean;
    CamelCaseMemberNames?: boolean;
    AdjustCasingForEnumOptions?: boolean;
    CamelCaseCustomWords?: string;
    EntityClassNameOverrides?: string;
    
    // Filtering
    AttributeBlacklist?: string;
    EntityAttributeSpecifiedNames?: string;
    
    // Option Set Options
    AddOptionSetMetadataAttribute?: boolean;
    GenerateAllOptionSetLabelMetadata?: boolean;
    
    // Advanced
    FilePrefixText?: string;
    CleanupCrmSvcUtilLocalOptionSets?: boolean;
}

class EarlyBoundGeneratorApp {
    private toolboxAPI: typeof window.toolboxAPI;
    private currentConfig: EarlyBoundGeneratorConfig = {};

    constructor() {
        this.toolboxAPI = window.toolboxAPI;
        this.initialize();
    }

    private async initialize(): Promise<void> {
        await this.setupConnectionMonitoring();
        this.setupEventListeners();
        this.loadDefaultValues();
    }

    private async setupConnectionMonitoring(): Promise<void> {
        const connectionInfo = document.getElementById('connection-info');
        if (!connectionInfo) return;

        const updateConnectionStatus = async () => {
            const connection = await this.toolboxAPI.connections.getActiveConnection();
            
            if (connection) {
                connectionInfo.innerHTML = `
                    <div class="connection-status">
                        <span class="status-indicator connected"></span>
                        <div>
                            <strong>Connected to:</strong> ${connection.name}<br>
                            <small>${connection.url}</small>
                        </div>
                    </div>
                `;
            } else {
                connectionInfo.innerHTML = `
                    <div class="connection-status">
                        <span class="status-indicator disconnected"></span>
                        <div>
                            <strong>No Connection</strong><br>
                            <small>Please connect to a Dataverse environment</small>
                        </div>
                    </div>
                `;
            }
        };

        // Initial update
        await updateConnectionStatus();

        // Subscribe to connection changes
        this.toolboxAPI.events.on((event, payload) => {
            if (payload.event === 'connection:updated' || payload.event === 'connection:created') {
                updateConnectionStatus();
            }
        });
    }

    private setupEventListeners(): void {
        // Action buttons
        document.getElementById('generate-config-btn')?.addEventListener('click', () => this.generateConfig());
        document.getElementById('save-config-btn')?.addEventListener('click', () => this.saveConfigToFile());
        document.getElementById('load-config-btn')?.addEventListener('click', () => this.loadConfigFromFile());
        document.getElementById('copy-config-btn')?.addEventListener('click', () => this.copyConfigToClipboard());
    }

    private loadDefaultValues(): void {
        // Set some sensible defaults
        (document.getElementById('namespace') as HTMLInputElement).value = 'YourCompany.Crm';
        (document.getElementById('serviceContextName') as HTMLInputElement).value = 'XrmServiceContext';
        (document.getElementById('builderSettingsPath') as HTMLInputElement).value = 'builderSettings.json';
        (document.getElementById('entityTypesFolder') as HTMLInputElement).value = 'Entities';
        (document.getElementById('optionSetsTypesFolder') as HTMLInputElement).value = 'OptionSets';
        (document.getElementById('messageTypesFolder') as HTMLInputElement).value = 'Messages';
        (document.getElementById('updateBuilderSettingsJson') as HTMLInputElement).checked = true;
    }

    private getFormValue(id: string): string {
        const element = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
        return element?.value.trim() || '';
    }

    private getCheckboxValue(id: string): boolean {
        const element = document.getElementById(id) as HTMLInputElement;
        return element?.checked || false;
    }

    private generateConfig(): void {
        // Build the configuration object from form values
        const config: EarlyBoundGeneratorConfig = {
            Namespace: this.getFormValue('namespace') || undefined,
            ServiceContextName: this.getFormValue('serviceContextName') || undefined,
            EntityTypesFolder: this.getFormValue('entityTypesFolder') || undefined,
            OptionSetsTypesFolder: this.getFormValue('optionSetsTypesFolder') || undefined,
            MessageTypesFolder: this.getFormValue('messageTypesFolder') || undefined,
            GenerateMessages: this.getCheckboxValue('generateMessages') || undefined,
            EmitEntityETC: this.getCheckboxValue('emitEntityETC') || undefined,
            EmitVirtualAttributes: this.getCheckboxValue('emitVirtualAttributes') || undefined,
            SuppressGeneratedCodeAttribute: this.getCheckboxValue('suppressGeneratedCodeAttribute') || undefined,
            IncludeCommandLine: this.getCheckboxValue('includeCommandLine') || undefined,
            UpdateBuilderSettingsJson: this.getCheckboxValue('updateBuilderSettingsJson') || undefined,
            ExtensionConfig: this.buildExtensionConfig()
        };

        // Remove undefined values to keep JSON clean
        this.currentConfig = this.cleanConfig(config);

        // Display the configuration
        this.displayConfig();
        
        this.showStatusMessage('Configuration generated successfully!', 'success');
    }

    private buildExtensionConfig(): ExtensionConfig {
        const extensionConfig: ExtensionConfig = {
            BuilderSettingsJsonRelativePath: this.getFormValue('builderSettingsPath') || undefined,
            
            // Entity/Action Filtering
            EntitiesWhitelist: this.getFormValue('entitiesWhitelist') || undefined,
            EntitiesToSkip: this.getFormValue('entitiesToSkip') || undefined,
            EntityPrefixesWhitelist: this.getFormValue('entityPrefixesWhitelist') || undefined,
            EntityPrefixesToSkip: this.getFormValue('entityPrefixesToSkip') || undefined,
            ActionsWhitelist: this.getFormValue('actionsWhitelist') || undefined,
            ActionsToSkip: this.getFormValue('actionsToSkip') || undefined,
            ActionPrefixesWhitelist: this.getFormValue('actionPrefixesWhitelist') || undefined,
            
            // File Organization
            CreateOneFilePerEntity: this.getCheckboxValue('createOneFilePerEntity') || undefined,
            CreateOneFilePerOptionSet: this.getCheckboxValue('createOneFilePerOptionSet') || undefined,
            CreateOneFilePerAction: this.getCheckboxValue('createOneFilePerAction') || undefined,
            DeleteFilesFromOutputFolders: this.getCheckboxValue('deleteFilesFromOutputFolders') || undefined,
            AddNewFilesToProject: this.getCheckboxValue('addNewFilesToProject') || undefined,
            
            // Code Generation Options
            GenerateAttributeNameConsts: this.getCheckboxValue('generateAttributeNameConsts') || undefined,
            GenerateActionAttributeNameConsts: this.getCheckboxValue('generateActionAttributeNameConsts') || undefined,
            GenerateAnonymousTypeConstructor: this.getCheckboxValue('generateAnonymousTypeConstructor') || undefined,
            GenerateConstructorsSansLogicalName: this.getCheckboxValue('generateConstructorsSansLogicalName') || undefined,
            GenerateEntityRelationships: this.getCheckboxValue('generateEntityRelationships') || undefined,
            GenerateEnumProperties: this.getCheckboxValue('generateEnumProperties') || undefined,
            GenerateGlobalOptionSets: this.getCheckboxValue('generateGlobalOptionSets') || undefined,
            AddDebuggerNonUserCode: this.getCheckboxValue('addDebuggerNonUserCode') || undefined,
            
            // Naming Options
            CamelCaseClassNames: this.getCheckboxValue('camelCaseClassNames') || undefined,
            CamelCaseMemberNames: this.getCheckboxValue('camelCaseMemberNames') || undefined,
            AdjustCasingForEnumOptions: this.getCheckboxValue('adjustCasingForEnumOptions') || undefined,
            CamelCaseCustomWords: this.getFormValue('camelCaseCustomWords') || undefined,
            EntityClassNameOverrides: this.getFormValue('entityClassNameOverrides') || undefined,
            
            // Filtering
            AttributeBlacklist: this.getFormValue('attributeBlacklist') || undefined,
            EntityAttributeSpecifiedNames: this.getFormValue('entityAttributeSpecifiedNames') || undefined,
            
            // Option Set Options
            AddOptionSetMetadataAttribute: this.getCheckboxValue('addOptionSetMetadataAttribute') || undefined,
            GenerateAllOptionSetLabelMetadata: this.getCheckboxValue('generateAllOptionSetLabelMetadata') || undefined,
            
            // Advanced
            FilePrefixText: this.getFormValue('filePrefixText') || undefined,
            CleanupCrmSvcUtilLocalOptionSets: this.getCheckboxValue('cleanupCrmSvcUtilLocalOptionSets') || undefined,
        };

        return this.cleanConfig(extensionConfig);
    }

    private cleanConfig<T extends Record<string, any>>(obj: T): T {
        const cleaned: any = {};
        for (const key in obj) {
            if (obj[key] !== undefined && obj[key] !== null && obj[key] !== '') {
                if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                    const nested = this.cleanConfig(obj[key] as Record<string, any>);
                    if (Object.keys(nested).length > 0) {
                        cleaned[key] = nested;
                    }
                } else {
                    cleaned[key] = obj[key];
                }
            }
        }
        return cleaned as T;
    }

    private displayConfig(): void {
        const configOutput = document.getElementById('config-output');
        const configJson = document.getElementById('config-json');
        
        if (configOutput && configJson) {
            const jsonString = JSON.stringify(this.currentConfig, null, 2);
            configJson.textContent = jsonString;
            configOutput.style.display = 'block';
        }
    }

    private async saveConfigToFile(): Promise<void> {
        if (Object.keys(this.currentConfig).length === 0) {
            this.showStatusMessage('Please generate a configuration first', 'error');
            return;
        }

        try {
            const jsonString = JSON.stringify(this.currentConfig, null, 2);
            const defaultFileName = 'earlyBoundGeneratorConfig.json';
            
            const savedPath = await this.toolboxAPI.fileSystem.saveFile(defaultFileName, jsonString);
            
            if (savedPath) {
                this.showStatusMessage('Configuration saved successfully!', 'success');
            }
        } catch (error) {
            console.error('Error saving config:', error);
            this.showStatusMessage('Failed to save configuration file', 'error');
        }
    }

    private async loadConfigFromFile(): Promise<void> {
        try {
            const filePath = await this.toolboxAPI.fileSystem.selectPath({
                type: 'file',
                title: 'Load Configuration',
                filters: [{ name: 'JSON Files', extensions: ['json'] }]
            });
            
            if (filePath) {
                const fileContent = await this.toolboxAPI.fileSystem.readText(filePath);
                const config = JSON.parse(fileContent) as EarlyBoundGeneratorConfig;
                this.populateFormFromConfig(config);
                this.currentConfig = config;
                this.displayConfig();
                this.showStatusMessage('Configuration loaded successfully!', 'success');
            }
        } catch (error) {
            console.error('Error loading config:', error);
            this.showStatusMessage('Failed to load configuration file. Please ensure it is valid JSON.', 'error');
        }
    }

    private populateFormFromConfig(config: EarlyBoundGeneratorConfig): void {
        // Basic Settings
        this.setFormValue('namespace', config.Namespace);
        this.setFormValue('serviceContextName', config.ServiceContextName);
        this.setFormValue('entityTypesFolder', config.EntityTypesFolder);
        this.setFormValue('optionSetsTypesFolder', config.OptionSetsTypesFolder);
        this.setFormValue('messageTypesFolder', config.MessageTypesFolder);
        
        this.setCheckboxValue('generateMessages', config.GenerateMessages);
        this.setCheckboxValue('emitEntityETC', config.EmitEntityETC);
        this.setCheckboxValue('emitVirtualAttributes', config.EmitVirtualAttributes);
        this.setCheckboxValue('suppressGeneratedCodeAttribute', config.SuppressGeneratedCodeAttribute);
        this.setCheckboxValue('includeCommandLine', config.IncludeCommandLine);
        this.setCheckboxValue('updateBuilderSettingsJson', config.UpdateBuilderSettingsJson);
        
        // Extension Config
        if (config.ExtensionConfig) {
            const ext = config.ExtensionConfig;
            this.setFormValue('builderSettingsPath', ext.BuilderSettingsJsonRelativePath);
            this.setFormValue('entitiesWhitelist', ext.EntitiesWhitelist);
            this.setFormValue('entitiesToSkip', ext.EntitiesToSkip);
            this.setFormValue('entityPrefixesWhitelist', ext.EntityPrefixesWhitelist);
            this.setFormValue('entityPrefixesToSkip', ext.EntityPrefixesToSkip);
            this.setFormValue('actionsWhitelist', ext.ActionsWhitelist);
            this.setFormValue('actionsToSkip', ext.ActionsToSkip);
            this.setFormValue('actionPrefixesWhitelist', ext.ActionPrefixesWhitelist);
            
            this.setCheckboxValue('createOneFilePerEntity', ext.CreateOneFilePerEntity);
            this.setCheckboxValue('createOneFilePerOptionSet', ext.CreateOneFilePerOptionSet);
            this.setCheckboxValue('createOneFilePerAction', ext.CreateOneFilePerAction);
            this.setCheckboxValue('deleteFilesFromOutputFolders', ext.DeleteFilesFromOutputFolders);
            this.setCheckboxValue('addNewFilesToProject', ext.AddNewFilesToProject);
            
            this.setCheckboxValue('generateAttributeNameConsts', ext.GenerateAttributeNameConsts);
            this.setCheckboxValue('generateActionAttributeNameConsts', ext.GenerateActionAttributeNameConsts);
            this.setCheckboxValue('generateAnonymousTypeConstructor', ext.GenerateAnonymousTypeConstructor);
            this.setCheckboxValue('generateConstructorsSansLogicalName', ext.GenerateConstructorsSansLogicalName);
            this.setCheckboxValue('generateEntityRelationships', ext.GenerateEntityRelationships);
            this.setCheckboxValue('generateEnumProperties', ext.GenerateEnumProperties);
            this.setCheckboxValue('generateGlobalOptionSets', ext.GenerateGlobalOptionSets);
            this.setCheckboxValue('addDebuggerNonUserCode', ext.AddDebuggerNonUserCode);
            
            this.setCheckboxValue('camelCaseClassNames', ext.CamelCaseClassNames);
            this.setCheckboxValue('camelCaseMemberNames', ext.CamelCaseMemberNames);
            this.setCheckboxValue('adjustCasingForEnumOptions', ext.AdjustCasingForEnumOptions);
            this.setFormValue('camelCaseCustomWords', ext.CamelCaseCustomWords);
            this.setFormValue('entityClassNameOverrides', ext.EntityClassNameOverrides);
            
            this.setFormValue('attributeBlacklist', ext.AttributeBlacklist);
            this.setFormValue('entityAttributeSpecifiedNames', ext.EntityAttributeSpecifiedNames);
            
            this.setCheckboxValue('addOptionSetMetadataAttribute', ext.AddOptionSetMetadataAttribute);
            this.setCheckboxValue('generateAllOptionSetLabelMetadata', ext.GenerateAllOptionSetLabelMetadata);
            
            this.setFormValue('filePrefixText', ext.FilePrefixText);
            this.setCheckboxValue('cleanupCrmSvcUtilLocalOptionSets', ext.CleanupCrmSvcUtilLocalOptionSets);
        }
    }

    private setFormValue(id: string, value?: string): void {
        const element = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement;
        if (element && value !== undefined) {
            element.value = value;
        }
    }

    private setCheckboxValue(id: string, value?: boolean): void {
        const element = document.getElementById(id) as HTMLInputElement;
        if (element && value !== undefined) {
            element.checked = value;
        }
    }

    private async copyConfigToClipboard(): Promise<void> {
        if (Object.keys(this.currentConfig).length === 0) {
            this.showStatusMessage('Please generate a configuration first', 'error');
            return;
        }

        try {
            const jsonString = JSON.stringify(this.currentConfig, null, 2);
            await this.toolboxAPI.utils.copyToClipboard(jsonString);
            this.showStatusMessage('Configuration copied to clipboard!', 'success');
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            this.showStatusMessage('Failed to copy configuration to clipboard', 'error');
        }
    }

    private showStatusMessage(message: string, type: 'success' | 'error' | 'info'): void {
        const statusMessage = document.getElementById('status-message');
        if (statusMessage) {
            statusMessage.textContent = message;
            statusMessage.className = `status-message ${type}`;
            statusMessage.style.display = 'block';

            // Auto-hide after 5 seconds
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        }
    }
}

// Initialize the app when the DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new EarlyBoundGeneratorApp());
} else {
    new EarlyBoundGeneratorApp();
}
