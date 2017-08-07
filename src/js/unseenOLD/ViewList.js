/**
 * @file ViewList.js
 * @description The ViewList class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const Component = require("./Component");
const jQuery = require("jquery");

/**
 * The ViewList class.
 *
 * Responsibilities:-
 * * To store Views,
 * * To collect the rendering of all contained Views,
 * * To handle all related events.
 * @class
 */
class ViewList extends Component {

    /**
     * @param {ModelList} modelCollection - An instantiated ModelList object.
     * @constructor
     */
    /**
     * @param {Object} collection - A ModelCollection instance.
     * @param {Object} [options={}] - Instance options to override class/custom defaults.
     * @param {ViewList} [parent] - The parent (if any).
     * @param {number} [parentRef] - The parent's reference ID for this component (if any).
     * @constructor
     */
    constructor(collection = {}, options = {}, parent = null, parentRef = null) {

        // Call Component constructor
        super(parent);

        // Set by user (or default).
        this.defaults = {
            baseClass: null,
            collection: null,
            views: null,
            useDOM: true,
            target: "main",
            tag: "div",
            id: "view",      // HTML Element ID
            classList: []
        };

        // Order of precedence is: Custom properties -then-> Instance options -then-> class defaults.
        this.baseClass = options.baseClass || this.baseClass || this.defaults.baseClass;
        this.collection = collection || options.collection || this.collection || this.defaults.collection;
        if(this.collection !== null) {this.collection._parent = this;}
        this.views = options.views || this.views || this.defaults.views;
        this.useDOM = options.useDOM || this.useDOM || this.defaults.useDOM;
        this.target = options.target || this.target || this.defaults.target;
        this.tag = options.tag || this.tag || this.defaults.tag;
        this.id = options.id || this.id || this.defaults.id;
        this.classList = options.classList || this.classList || this.defaults.baseModel;

        // // Sanity check user initialization.
        // if(!this.baseClass) {
        //     throw new Error("ViewList requires a base View class.");
        // }

        // Set depending on previous internal/user properties.
        this.$el = null;
        this.markup = "";
        this.deferred = [];

        this.viewEvents = null; // We set the viewEvents lookup (i.e. the collected events of all sub-views)


        // Adds internal events listener used by the ModelList to signal this ViewList on update.
        this.on("change", function(args) {
            console.log(`ViewList #${this._id}: Model/Collection #${args} changed.`);
            this.emit("change"); // Relay the event forward
            // jQuery(this.target).children().first().detach();
            // this._renderFragment(true);
        }.bind(this));

        this.collection.on("reset", function(args) {
            console.log(`ViewList #${this._id}: ModelList #${args} changed.`);
            this.reset(this.collection.models);
            this._render(true);
            if(this.useDOM === true) {
                this._insert();
            }
        }.bind(this));

        // TODO - Add internal events listener used by Views signalling this ViewList
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // DATA METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * Renders and inserts the view into the DOM.
     * @private
     */
    reset(models) {
        // Instantiate initial View components from ModelList models
        this.views = {};
        this.length = 0;
        for(let id in models) {

            // Retrieve associated model from collection.
            let model = models[id]; // Note if the 'model' IS a single model... it returns itself

            // Instantiate view and set private properties.
            let view = new this.baseClass(model, {}, this);

            // Now add newly created View to store.
            // this.views[id] = view;
            this.views[view._id] = view;
            this.length++;
        }
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // USER LIFECYCLE METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * Destroys the ViewList.
     */
    destroy() {
        let selector = `#${this.id}-${this._id}`;
        console.log("SELECTOR" + selector);
        console.log(`View ${this._id} is being destroyed!!!`);
        jQuery(selector).remove();
    }

    // return [
    //    ["#button-delete", "click", "deleteAction"]
    // ];
    events() {return null;}

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

        let events = this.viewEvents[viewId];
        let elementEvent = events[elementId];
        console.log(`ViewList event found: ${JSON.stringify(elementEvent)}`);
        if(elementEvent !== undefined && elementEvent[0] === evt.type) {
            console.log(`ViewList matched '${evt.type}' event for component '${viewId}' element ${elementId}`);
            // Note viewId ALWAYS the same as modelId - i.e. one-to-one correspondence.
            let view = this.views[viewId];
            if(view) {
                view[elementEvent[1]](evt, viewId);
            }
        }

        // let modelId = this.views[viewId].model._id;
        // console.log("Have model id: " + modelId);


    }
    // _handleEvents(evt) {
    //     console.log(`ViewList Event '${evt.type}': ${evt.target.name}, #${evt.target.id} .${evt.target.className}`);
    //
    //     let eventTargetId = evt.target.id;
    //     let splitPoint = eventTargetId.lastIndexOf("-");
    //     let elementId = "#" + eventTargetId.slice(0, splitPoint);
    //     if(elementId === "#") {
    //         throw new Error("Missing event target.");
    //     }
    //     let viewId = eventTargetId.slice(splitPoint + 1); // +1 to step over delimiter
    //     // console.log(`UNID: ${evt.target.dataset.unid}`);
    //     console.log(`UNID: ${evt.target.getAttribute("data-unid")}`);
    //     console.log(`View events are: ${JSON.stringify(this.viewEvents)}`);
    //     console.log(`ViewList event matched: View component '${viewId}', element ${elementId}`);
    //
    //     let events = this.viewEvents[viewId];
    //     let elementEvent = events[elementId];
    //     if(elementEvent !== undefined && elementEvent[0] === evt.type) {
    //         console.log(`ViewList '${evt.type}' event for component '${viewId}' element ${elementId}`);
    //         // Note viewId ALWAYS the same as modelId - i.e. one-to-one correspondence.
    //         let view = this.views[viewId];
    //         if(view !== undefined) {
    //             view[elementEvent[1]](evt);
    //
    //             // DELETE A VIEW
    //             // this.views[viewId]._destroy(); // Always call private life-cycle method first.
    //             // delete this.views[viewId];
    //             // this.collection.emit("view-remove", viewId);
    //         }
    //     }
    //
    //     // let modelId = this.views[viewId].model._id;
    //     // console.log("Have model id: " + modelId);
    //
    //
    // }

    // template(model, params) {return JSON.stringify(model);}

    // _renderFragment(doInsert=false, fragment=null) {
    //
    //     let element = document.createElement(this.tag);
    //     element.id = this.id + "-" + this._id;
    //     element.classList.add(this.id); // We add the id as a class because here - it will not be mutated/mangled.
    //     element.classList.add(...this.classList); // We add any remaining classes.
    //
    //     // Collect events
    //     let viewEvents = {};
    //
    //     // Now we add any sub-views
    //     for(let id in this.views) {
    //         let view = this.views[id];
    //         viewEvents[view._id] = view._renderFragment(false, element);
    //     }
    //
    //     // Are we a top-level view?
    //     if(!this._parent && !fragment) {
    //         // YES - without passed fragment or parent
    //         fragment = document.createDocumentFragment();
    //     }
    //     fragment.appendChild(element);
    //
    //     if(doInsert === true) {
    //         jQuery(this.target).append(fragment);
    //
    //         // We don't even think about whether to add a listener if this fragment isn't being inserted into the DOM.
    //         if(!this._parent) {
    //
    //             // We set the viewEvents lookup
    //             this.viewEvents = viewEvents;
    //
    //             // Add top-level event listener
    //             element.addEventListener("click", this._handleEvents.bind(this), false);
    //         }
    //     }
    //     return viewEvents;
    // }

    /**
     *
     * @returns {string|*|string}
     * @private
     */
    _render() {

        let classList = [this.id]; // We add the id as a class because here - it will not be mutated/mangled.
        classList.push(...this.classList); // We add any remaining classes.

        let elementOpen = `<${this.tag} id="${this.id + "-" + this._id}" class="${classList.join(" ")}">`;
        let elementClose = "</" + this.tag + ">";
        // let elementBody = this.template(this.baseModel, 0);
        let elementBody = "";

        // First we make any element ids in this View - unique.
        // elementBody = elementBody.replace(/(?:id)="([^"]*)"/gi, `id="$1-${this._id}"`);    // Matches class="sfasdf" or id="dfssf"
        elementBody = elementBody.replace(/(?:id)="([^"]*)"/gi, `id="$1-${this._id}" data-unid="${this._id}"`);    // Matches class="sfasdf" or id="dfssf"
        // console.log("CONTENT: " + JSON.stringify(element.html));

        // Are we a top-level view?
        // Collect events
        this.viewEvents = {};

        // Now we add any sub-views
        let elementChildren = "";
        for(let id in this.views) {
            let view = this.views[id];
            this.viewEvents[view._id] = view.events();
            elementChildren += view._render(false, elementChildren);
        }

        this.markup = elementOpen + elementBody + elementChildren + elementClose;
        // console.log("MARKUP: " + JSON.stringify(markup.html));

        this.emit("rendered"); // Relay the event forward

        return this.markup;
    }

    /**
     *
     * @private
     */
    _insert() {
        // jQuery(this.target).append(markup);
        console.log(`Appending to ${this.target}`);
        this.$el = jQuery(this.markup).appendTo(this.target).get(0);
        if(this.$el === undefined) {throw new Error("Unable to find DOM target to append to.");}
        // We don't even think about whether to add a listener if this fragment isn't being inserted into the DOM.
        if(!this._parent) {
            // Add top-level event listener
            this.$el.addEventListener("click", this._handleEvents.bind(this), false);
        }
    }

    _deferAppend(html) {
        this.deferred.push(html);
    }

    _resolveDeferred() {
        if(this.deferred.length > 0) {
            jQuery(this.$el).append(this.deferred.shift());
        }
    }

    _renderDefer(doInsert=false, markup=null) {

        let classList = [this.id]; // We add the id as a class because here - it will not be mutated/mangled.
        classList.push(...this.classList); // We add any remaining classes.

        let elementOpen = `<${this.tag} id="${this.id + "-" + this._id}" class="${classList.join(" ")}">`;
        let elementClose = "</" + this.tag + ">";
        // let elementBody = this.template(this.baseModel, 0);
        let elementBody = "";

        // First we make any element ids in this View - unique.
        elementBody = elementBody.replace(/(?:id)="([^"]*)"/gi, `id="$1-${this._id}"`);    // Matches class="sfasdf" or id="dfssf"
        // console.log("CONTENT: " + JSON.stringify(element.html));

        // Collect events
        let viewEvents = {};

        if(doInsert === true) {
            let html = elementOpen + elementBody + elementClose;
            this.$el = jQuery(html).appendTo(this.target).get(0);

            // start deferred markup handling
            // intervalID = window.setInterval(this._resolveDeferred.bind(this), 500);
            console.time("deferred");
            let intervalID = setInterval(function() {
                if(this.deferred.length > 0) {
                    jQuery(this.$el).append(this.deferred.shift());
                } else {
                    clearInterval(intervalID);
                    // console.log("Deferred timer self-terminated.");
                    console.timeEnd("deferred");
                }
            }.bind(this), 300);
        }

        // Now we add any sub-views
        let elementChildren = {html: ""};
        for(let id in this.views) {
            let view = this.views[id];
            viewEvents[view._id] = view._render(false, elementChildren);

            if(doInsert === true && elementChildren.html.length > 20000) {
                this._deferAppend(elementChildren.html);
                elementChildren.html = "";
            }
        }
        if(elementChildren.html.length > 0) {
            this._deferAppend(elementChildren.html);
            elementChildren.html = "";
        }

        // Are we a top-level view?
        if(!this._parent && !markup) {
            // YES - without passed fragment or parent
            markup = {html: ""};
        }

        if(doInsert === true) {

            // We don't even think about whether to add a listener if this fragment isn't being inserted into the DOM.
            if(!this._parent) {

                // We set the viewEvents lookup
                this.viewEvents = viewEvents; // Note: Array NOT just a single object!

                // Add top-level event listener
                this.$el.addEventListener("click", this._handleEvents.bind(this), false);
            }
        } else {
            markup.html += elementOpen + elementBody + elementChildren.html + elementClose;
            // console.log("MARKUP: " + JSON.stringify(markup.html));
        }
        return viewEvents;
    }

}

// Exports
module.exports = ViewList;

//
//
//
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
// const View = require("./View");
// class MyView extends View {
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
// //
// // let myView = new MyView(myModel);
// //
// // myModel.on("change", function() {
// //     console.log(myView.markup);
// // });
// //
// // myModel.fetch();
// //
//
//
//
//
// // MODEL COLLECTION
// const ModelList = require("./ModelList");
// class MyModelList extends ModelList {
//     initialize() {
//         this.baseClass = MyModel;
//         this.url = "http://localhost:8080/entity";
//     }
// }
// let myModelList = new MyModelList();
//
// // VIEW COLLECTION
// class MyViewList extends ViewList {
//     initialize() {
//         this.baseClass = MyView;
//         this.useDOM = false;
//         this.id = "my-list";
//         this.tag = "div";
//         this.classList = ["container"];
//     }
// }
// let myViewList = new MyViewList(myModelList);
//
// myViewList.on("rendered", function() {
//     console.log(myViewList.markup);
// });
// myModelList.fetch();
