/**
 * @file Unseen.View.test.js
 * @description Unit tests for the Unseen ES2015 class library.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Environment
const IS_CI = process.env.CI;
const IS_TRAVIS = process.env.TRAVIS;

// Imports
const fs = require("fs");
const path = require("path");
// const sinon = require("sinon");

// Unit
const Unseen = require("../../src/js/unseen/Unseen");

// Constants
let workingDirectory = process.cwd();
if(IS_TRAVIS) {workingDirectory = process.env.TRAVIS_BUILD_DIR;} // Usually: "/home/travis/build/kasargeant/warhorse"

// Setup
let entityData = {"id": 100013440,"idn": "", "class": "building", "type": "restaurant", "name": "La Perla"};

class EntityModel extends Unseen.Model {
    initialize() {
        this.baseSchema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
    }
}
let entityModel = new EntityModel(entityData);

class EntityListItemView extends Unseen.View {

    /**
     * Initialize and target component
     */
    initialize() {
        this.id = "entity-item";
        this.tag = "article";
        this.classList = [];
    }

    /**
     * Defines 'scoped' stylesheet
     * @returns {string}
     */
    style() {
        return `
            <style>
                            
                article {
                    margin-bottom: 0.25em;
                    padding: 0.25em;
                    background-color: lightgray;
                    border-radius: .5em;
                }
                
                h1 {
                    font-size: 1.5em;
                }
                h2 {
                    font-size: 1em;
                }
                
                a {
                    font-style: normal;
                }
                
                header {}
                
                footer {
                    display: flex;
                    flex-direction: row-reverse;
                    justify-content: space-between;
                }
            </style>
        `;
    }

    /**
     * Defines component template and returns markup for the given Model instance.
     * @param {model} model - The Model instance to be used with this template.
     * @param {number} [idx] - Index number used by component parents of type list e.g. ViewList.
     * @returns {string}
     */
    template(model, idx) {

        return `
            <header>
                <h2 class="subtitle">${model.id}</h2>
                <h1 class="title">${model.name}</h1>
            </header>
            <section>
                ${model.id}: ${model.type} - ${model.name}
            </section>
            <footer>
                <button id="button-delete" class="btn">Delete</button>
            </footer>
        `;
    }

    /**
     * Defines and returns the event lookup table for this component.
     * @returns {Object} - the event lookup table for this component.
     */
    events() {
        return {
            "#entity-item": ["click", "focusAction"],
            "#button-delete": ["click", "deleteAction"]
        };
    }

    /**
     * A custom search action method for this component.
     * @param {Event} evt - The event that triggered this method.
     * @param {number} viewId - The UUID of the component target.
     */
    deleteAction(evt) {
        console.log(`deleteAction for ${this._id} called by ${JSON.stringify(evt)}.`);
        this.destroy();
    }

    /**
     * A custom focus action - that opens details of this entity in another view.
     * @param {Event} evt - The event that triggered this method.
     * @param {number} viewId - The UUID of the component target.
     */
    focusAction(evt) {
        console.log(`focusAction for ${this._id} called by ${JSON.stringify(evt)}.`);

    }
}

// Tests
describe("Class: View", function() {

    describe("Standard sanity check", function() {
        it("contains spec with an positive expectation", function() {
            expect(true).toBe(true);
        });
        it("contains spec with a negative expectation", function() {
            expect(!true).toBe(false);
        });
    });

    describe("Class", function() {

        it("should have been defined", function() {
            expect(Unseen.View).toBeDefined();
        });

        it("should be able to extend with a derivative", function() {
            expect(EntityListItemView).toBeDefined();
        });
    });

    describe("Defaults", function() {

        let view;
        beforeEach(function() {
            view = new Unseen.View(entityModel);
        });

        it("should be able to create instances of the View class.", function() {
            expect(view).toBeDefined();
        });

        it("should be able to render a default version of a model.", function() {
            expect(view._render()).toBe(`<ul><li><strong>id</strong>: 100013440</li><li><strong>idn</strong>: unnamed</li><li><strong>class</strong>: building</li><li><strong>type</strong>: restaurant</li><li><strong>name</strong>: La Perla</li></ul>`);
        });
    });

    describe("Derivative instances", function() {

        let view;
        beforeEach(function() {
            view = new EntityListItemView(entityModel);
        });

        it("should be able to create instances of the derivative View class.", function() {
            expect(view).toBeDefined();
        });

        it("should have defined events", function() {
            expect(view.events()).toEqual({"#button-delete": ["click", "deleteAction"], "#entity-item": ["click", "focusAction"]});
        });

        it("should have a defined stylesheet", function() {
            expect(view.style()).toMatchSnapshot();
        });

        it("should have a defined template", function() {
            expect(view.template(view.baseModel)).toMatchSnapshot();
        });

    });



});
