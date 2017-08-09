/**
 * @file View.js
 * @description The View class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Component = require("./Component");
const jQuery = require("jquery");
const walk = require("./walk");

/**
 * The View class.
 *
 * Responsibilities:-
 * * To render a particular model with a particular template.
 * * To be able to attach events to the resultant markup.
 * @class
 */
class View extends Component {

    /**
     * @param {Model} baseModel - A model instance.
     * @param {Object} [options={}] - Instance options to override class/custom defaults.
     * @param {Component} [parent=null] - The parent (if any).
     * @constructor
     */
    constructor(baseModel = null, options = {}, parent = null) {

        // Call Component constructor
        super(parent);

        // Set by user (or default).
        this.defaults = {
            baseClass: null,
            baseModel: null,
            useDOM: true,
            target: "main",
            tag: "div",
            id: null,      // HTML Element ID
            classList: null
        };

        // Order of precedence is: Custom properties -then-> Instance options -then-> class defaults.
        this.baseModel = baseModel || this.config.baseModel || this.baseModel || this.defaults.baseModel;
        this.useDOM = options.useDOM || this.useDOM || this.defaults.useDOM;
        this.target = options.target || this.target || this.defaults.target;
        this.tag = options.tag || this.tag || this.defaults.tag;
        this.id = options.id || this.id || this.defaults.id;
        this.classList = options.classList || this.classList || this.defaults.baseModel;

        // // Sanity check user initialization.
        // if(!this.baseModel) {
        //     if(!this.baseModel && this.baseClass) {
        //         this.baseModel = new this.baseClass();
        //     } else {
        //         this.baseModel = new Model();
        //     }
        // }

        // Set depending on previous internal/user properties.
        this.$el = null;
        this.markup = "";

        // Adds internal events listener used by the ModelList to signal this ViewList on update.
        this.baseModel.on("change", function(args) {
            console.log(`View #${this._id}: Model #${args} changed.`);
            this.reset();
        }.bind(this));
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // DATA METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * Renders and inserts the view into the DOM.
     * @private
     */
    reset() {
        this._render(true);
        if(this.useDOM === true) {
            this._insert();
        }
    }


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // LIFECYCLE METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * Destroys the View.
     */
    destroy() {
        let selector = `#${this.id}-${this._id}`;
        console.log("SELECTOR" + selector);
        console.log(`View ${this._id} is being destroyed!!!`);
        jQuery(selector).remove();

        this.baseModel.destroy();
    }

    /**
     * Returns an event lookup object for this View.
     * @returns {Object}
     * @override
     */
    events() {return {};}

    /**
     *
     * @param evt
     * @private
     */
    _handleEvents(evt) {
        console.log(`ViewList Event '${evt.type}': ${evt.target.name}, #${evt.target.id} .${evt.target.className}`);

        let mangledId = evt.target.id;
        if(mangledId === "") {
            throw new Error("Missing event target.");
        }
        let elementId = "#" + mangledId.slice(0, mangledId.lastIndexOf("-"));
        let viewId = evt.target.dataset.unid;
        // let viewId = evt.target.getAttribute("data-unid"); // Alternative for older browsers.
        console.log(`ElementId: ${viewId}`);
        console.log(`ViewId: ${viewId}`);
        console.log(`View events are: ${JSON.stringify(this.viewEvents)}`);

        let elementEvent = this.viewEvents[viewId][elementId];
        console.log(`View event found: ${JSON.stringify(elementEvent)}`);
        if(elementEvent !== undefined && elementEvent[0] === evt.type) {
            console.log(`View matched '${evt.type}' event for component '${viewId}' element ${elementId}`);
            // Note viewId ALWAYS the same as modelId - i.e. one-to-one correspondence.
            this[elementEvent[1]](evt, viewId);
        }

        // let modelId = this.views[viewId].model._id;
        // console.log("Have model id: " + modelId);


    }

    /**
     * Returns this View's built template.
     * @returns {string}
     * @override
     */
    template(model, idx=0, params={}) {return "";}

    /**
     * [UNIMPLEMENTED] Returns this View's scoped stylesheet.
     * @returns {string}
     * @override
     */
    style() {return "";}

    /**
     *
     * @param doInsert
     * @returns {{}|*}
     * @private
     */
    _render() {

        let classList = [this.id]; // We add the id as a class because here - it will not be mutated/mangled.
        classList.push(...this.classList); // We add any remaining classes.

        let elementOpen = `<${this.tag} id="${this.id + "-" + this._id}" class="${classList.join(" ")}">`;
        let elementClose = "</" + this.tag + ">";
        let elementBody = this.template(this.baseModel, this._id);

        // First we make any element ids in this View - unique.
        // let matches = content.match(/(?:id|class)="([^"]*)"/gi);    // Matches class="sfasdf" or id="dfssf"
        // console.log("MATCHES: " + JSON.stringify(matches));
        // elementBody = elementBody.replace(/(?:id)="([^"]*)"/gi, `id="$1-${this._id}"`);    // Matches class="sfasdf" or id="dfssf"
        elementBody = elementBody.replace(/(?:id)="([^"]*)"/gi, `id="$1-${this._id}" data-unid="${this._id}"`);    // Matches class="sfasdf" or id="dfssf"
        // console.log("CONTENT: " + JSON.stringify(element));

        // Are we a top-level view?
        // Collect events
        // let viewEvents = this.events();

        // Do we create a markup container with id and/or classes?
        if(!this.id && !this.classList) {
            // NO: Just return template result.
            this.markup = elementBody;
        } else {
            // YES: Then template result with wrapping tag.
            this.markup = elementOpen + elementBody + elementClose;
        }
        // console.log("MARKUP: " + JSON.stringify(markup.html));

        // if(doInsert === true) {
        //     // jQuery(this.target).append(markup);
        //     console.log(`Appending to ${this.target}`);
        //     this.$el = jQuery(markup.html).appendTo(this.target).get(0);
        //     if(this.$el === undefined) {throw new Error("Unable to find DOM target to append to.");}
        //     // We don't even think about whether to add a listener if this fragment isn't being inserted into the DOM.
        //     if(!this._parent) {
        //
        //         // We set the viewEvents lookup
        //         this.viewEvents = viewEvents;
        //
        //         // Add top-level event listener
        //         this.$el.addEventListener("click", this._handleEvents.bind(this), false);
        //     }
        // }

        return this.markup;
    }

    _insert() {
        // jQuery(this.target).append(markup);
        console.log(`Appending to ${this.target}`);
        this.$el = jQuery(this.markup).appendTo(this.target).get(0);
        if(this.$el === undefined) {throw new Error("Unable to find DOM target to append to.");}
        // We don't even think about whether to add a listener if this fragment isn't being inserted into the DOM.
        if(!this._parent) {

            // We set the viewEvents lookup
            this.viewEvents = {"0": this.events()}; // Note: Single object NOT array!

            // Add top-level event listener
            this.$el.addEventListener("click", this._handleEvents.bind(this), false);
        }
    }
}

// Exports
module.exports = View;



// // REST TEST
// const schema = {"id": 0, "idn": "unnamed", "class": "unknown", "type": "unknown", "name": "Unnamed"};
//
// const Model = require("./Model");
// class MyModel extends Model {
//     initialize() {
//         this.baseSchema = schema;
//         this.url = "http://localhost:8080/entity/1";
//     }
// }
// let myModel = new MyModel();
//
//
// class EntityView extends View {
//
//     initialize() {
//         this.baseClass = MyModel;
//         this.useDOM = false;
//         this.id = "my-item";
//         this.tag = "div";
//         this.classList = ["card"];
//     }
//
//     template(model, idx) {
//
//         return `
//             <div class="card-header">
//                 <h4 class="card-title">${model.id}</h4>
//                 <h6 class="card-subtitle">${model.name}</h6>
//             </div>
//             <div class="card-body">
//                 ${model.id}: ${model.type} - ${model.name}
//             </div>
//             <div class="card-footer">
//                 <button id="button-delete" class="btn btn-primary">Delete</button>
//             </div>
//         `;
//     }
//
//     events() {
//         return {
//             "#button-delete": ["click", "actionDelete"]
//         };
//     }
//
//     actionDelete(evt) {
//         console.log(`deleteAction for ${this._id} called by ${JSON.stringify(evt)}.`);
//         this.destroy();
//     }
// }
//
// let myView = new EntityView(myModel);
//
// myModel.on("change", function() {
//     console.log(myView.markup);
// });
//
// myModel.fetch();