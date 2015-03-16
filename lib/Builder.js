/**
 * The builder is responsible for constructing the container and the definitions
 * based on the services.json files located anywhere within the application
 *
 *
 * @param {Container} Container The constructor for the container class
 * @param {Definition} Definition The constructor for the service Definition class
 * @returns {Builder} An instance of the container builder
 */
var Builder = function Builder(Container, Definition) {
    this.options = {
        env: false
    };

    this.Container = Container;
    this.Definition = Definition;
};

/**
 * Build a container based on a given array of service definition objects
 *
 * @param {Array<string>|string} configurations
 * @param {Object?} options Options for constructing the container
 * @returns {Container} An initialized container instance
 */
Builder.prototype.buildContainer = function (configurations, options) {
    var container, i;

    if (typeof configurations === "string") {
        configurations = [configurations];
    }

    // Set the options, or use the defaults
    this.options = options || this.options;

    // Construct a new Container
    container = new this.Container();

    // Ensure that we iterate in sorted order
    for (i = 0; i < configurations.length; i++) {
        this.parseConfiguration(configurations[i], container);
    }

    return container;
};

/**
 * Take a service definition object and add its definitions to the given container
 *
 * @param configuration
 * @param {Container} container The container instance to add services and parameters to
 * @param namespace
 * @returns {undefined}
 */
Builder.prototype.parseConfiguration = function (configuration, container, namespace) {
    var i, serviceConfigs;
    var modifiedNs = '';

    namespace = namespace || '';

    // Get the namespace if specified
    if (configuration.namespace) {
        namespace = (namespace && namespace !== '')
            ? namespace + '.' + configuration.namespace
            : configuration.namespace;
    }

    modifiedNs = (namespace) ? namespace + '.' : '';

    // Add the parameters with the right namespace
    for (i in configuration.parameters) {
        container.setParameter(modifiedNs + i, configuration.parameters[i]);
    }

    // Add service definitions if not a parameter file
    if (!!configuration.services) {
        serviceConfigs = configuration.services;
        for (i in serviceConfigs) {
            container.set(
                modifiedNs + i,
                this.buildDefinition(serviceConfigs[i], namespace)
            );
        }
    }
};

/**
 *
 * @param configuration
 * @param namespace
 * @returns {Definition}
 */
Builder.prototype.buildDefinition = function (configuration, namespace) {
    var definition;
    definition = new this.Definition();
    definition.class = configuration.class;
    definition.constructorMethod = configuration.constructorMethod;
    definition.factoryFunction = (!!configuration.factoryFunction) ? configuration.factoryFunction : false;
    definition.arguments = configuration.arguments;
    definition.calls = configuration.calls;
    definition.properties = configuration.properties;
    definition.isObject = configuration.isObject;
    definition.isSingleton = configuration.isSingleton;
    definition.namespace = namespace;
    return definition;
};

module.exports = Builder;