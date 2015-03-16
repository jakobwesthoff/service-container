var Builder, Container, CommonTests, chai, expect, sinon, env, dir;

// Get the node environment - coverage causes us to look for the test library
env = process.env.NODE_TEST_ENV || 'test';

if (env === 'coverage') {
    dir = '../../lib-cov/';
} else {
    dir = '../../lib/';
}

Builder = require(dir + 'Builder');
Container = require(dir + 'Container');
Definition = require(dir + 'Definition');
CommonTests = require('../CommonTests');
chai = require('chai');
expect = chai.expect;
sinon = require('sinon');

chai.config.includeStack = true;


// Use the service container to get the right Definition file
env = process.env.NODE_ENV || 'test'; // Can be set for the coverage env

/**
 * Tests for the Definition.js Object
 */
describe('lib/Builder.js', function () {
    var mockConfigurations;
    var someClassConstructor;
    var anotherClassConstructor;
    beforeEach(function() {
        someClassConstructor = function() {};
        anotherClassConstructor = function() {};
        mockConfigurations = [{
            parameters: {
                test: 1
            },
            services: {
                test_service: {
                    class: someClassConstructor,
                    arguments: [1],
                    calls: [['set', [1]]],
                    properties: {hello: 1}
                },
                another_service: {
                    class: anotherClassConstructor
                }
            }
        }]
    });

    describe('#Constructor', function () {
        it('Should not require any arguments', function () {
            expect(function () {
                new Builder();
            }).to.not.throw();
        });
    });

    describe('#buildContainer', function () {
        it('Should construct and return a new container', function () {
            var builder, result;
            builder = new Builder(Container, null);
            result = builder.buildContainer([{}]);
            expect(result).to.be.an.instanceof(Container);
        });

        it('Should loop through single service definition not provided as array', function () {
            var builder, result, spy;
            spy = sinon.spy();

            builder = new Builder(Container, null);
            builder.parseConfiguration = spy;
            result = builder.buildContainer({});

            expect(result).to.be.an.instanceof(Container);
            expect(spy.calledOnce).to.be.true;
        });

        it('Should loop through the service definitions and parse them with #parseConfiguration', function () {
            var builder, result, spy;
            spy = sinon.spy();

            builder = new Builder(Container, null);
            builder.parseConfiguration = spy;
            result = builder.buildContainer([{}, {}, {}]);

            expect(result).to.be.an.instanceof(Container);
            expect(spy.calledThrice).to.be.true;
        });


    });

    describe('#parseConfiguration', function () {
        it('Should add the parameters in the config to the container', function () {
            var builder, container, result;
            builder = new Builder(null, Definition);
            container = new Container();
            builder.parseConfiguration(mockConfigurations[0], container);

            result = container.parameters;
            expect(result).to.deep.equal({test: 1});
        });

        it('Should call #buildDefinition on each of the services it finds', function () {
            var builder, container, spy;
            builder = new Builder(null, Definition);
            spy = sinon.spy(function () {
                return true;
            });
            builder.buildDefinition = spy;

            container = new Container();
            builder.parseConfiguration(mockConfigurations[0], container);

            expect(spy.calledTwice).to.be.true;
        });
    });

    /**
     *
     */
    describe('#buildDefinition', function () {
        it('Should take the service config and set the appropriate fields of the defintion object', function () {
            var builder, test, result;
            test = mockConfigurations[0].services.test_service;
            builder = new Builder(null, Definition);
            result = builder.buildDefinition(test);
            expect(result).to.be.an.instanceof(Definition);
            expect(result.class).to.equal(test.class);
            expect(result.arguments).to.deep.equal(test.arguments);
            expect(result.calls).to.deep.equal(test.calls);
            expect(result.properties).to.deep.equal(test.properties);
        });
    });
});


