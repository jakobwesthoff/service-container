/**
 * Construct a Builder object
 */
module.exports = (function () {
    var Builder, Container, Definition;
    Builder = require('./lib/Builder');
    Container = require('./lib/Container');
    Definition = require('./lib/Definition');

    // Create an instance of the builder with the proper dependencies injected
    var builder = new Builder(Container, Definition);

    // Return the initialized builder
    return builder;
}());
