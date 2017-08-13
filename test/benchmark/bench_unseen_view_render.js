"use strict";

// BUNDLE WITH: browserify bench_unseen_view_insertion.js > bench_unseen_view_insertion_bundle.js

// Imports
const Unseen = require("../../src/js/unseen/Unseen");

const jQuery = require("jquery");

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
// UNIT SETUP

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
        this.target = "#test-target";
        this.id = "test-id";
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

    styleElement() {
        return `color: red; border: 1px solid black; margin-bottom: 0.25em; padding: 0.25em; background-color: lightgray; border-radius: .5em;`;
    }
    styleElementInitial() {
        return `color: initial; border: initial; margin-bottom: initial; padding: initial; background-color: initial; border-radius: initial;`;
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

document.addEventListener("DOMContentLoaded", () => {
    console.log(`%c Benchmark started...`, "background: #000; color: #fff; font-size: 14px");


    // SANITY CHECK SETUP
    // let $target = document.getElementById("test-target");
    // let view = new EntityListItemView(entityModel);
    //
    // // SANITY CHECKS...
    //
    // // // DOM - inline style
    // // view._render();
    // // view._insertMarkupDOM();
    // // jQuery($target).children().remove();
    // // view._insertMarkupDOM();
    // // console.log(view.markup);
    //
    // // // // DOM - element style
    // // view._renderInlineElement();
    // // view._insertMarkupDOM();
    // // // jQuery($target).children().remove();
    // // // view._insertMarkupDOM();
    // // console.log(view.markup);
    //
    //
    // // // SHADOW_DOM - inline style
    // // view._render();
    // // view._insertMarkupShadowDOM();
    // // jQuery($target).children().remove();
    // // // view._insertMarkupShadowDOM();
    // // console.log(view.markup);
    //
    //
    // // // DOM_FRAGMENT - inline style
    // view._renderFragment();
    // view._insertElementDOM();
    // // jQuery($target).children().remove();
    // // view._insertMarkupDOM();
    // console.log(view.markup);
    //
    // // SHADOW_DOM_FRAGMENT - inline style
    // view._renderFragment();
    // view._insertElementShadowDOM();
    // jQuery($target).children().remove();
    // view._insertElementShadowDOM();
    // console.log(view.markup);



    // let el = document.getElementById("myroot");
    // while (el.firstChild) {
    //     el.removeChild(el.firstChild);
    // }

    ///////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////
    // UNIT BENCHMARK

    let suite = new Benchmark.Suite("Benchmark: Unseen View insertion.");


    // console.log("Sanity check:-");
    let $target = document.getElementById("test-target");
    let view = new EntityListItemView(entityModel);

    // Benchmark
    console.log();
    console.log("Benchmark:-");
    suite
        .add("Render markup - with inline style.", function() {
            return view._render();
        })
        .add("Render markup - with element attribute style.", function() {
            return view._renderInlineElement();
        })
        .add("Render document fragment - inline style.", function() {
            return view._renderFragment();
        })
        // add listeners
        .on("cycle", function(event) {
            console.log(String(event.target));
        })
        .on("complete", function() {
            console.log("Fastest is " + this.filter("fastest").map("name"));
        })
        // run async
        .run({"async": true});



});



