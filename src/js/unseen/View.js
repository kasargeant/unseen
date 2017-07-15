/**
 * @file View.js
 * @description The View class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports
const EventEmitter = require("event-emitter");
const jQuery = require("jquery");
const walk = require("./walk");

/**
 * The View class.
 * @class
 */
class View {

    /**
     * @param parent
     * @param id
     * @constructor
     */
    constructor(parent=null, id=0) {

        // Set internally (or by parent).
        this._parent = parent;
        this._id = id;          // View ID

        // Set by user (or default).
        this.base = null;
        this.id = "view";       // HTML Element ID
        this.target = "main";
        this.tag = "div";
        this.classList = [];
        this.initialize();  // LIFECYCLE CALL: INITIALIZE

        // Calculated from previous internal/user properties.
        this.views = null;
        this.el = "";

        // Adds internal events listener used by the ModelCollection to signal this ViewCollection on update.
        this.on("change", function(args) {
            console.log(`View #${this._id}: Model/Collection #${args} changed.`);
            this._emit("change"); // Relay the event forward
        });
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // LIFECYCLE METHODS
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * @override
     */
    initialize() {
        // Lifecycle method.
    }

    /**
     * @override
     */
    finalize() {

    }

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

    _emit(eventType) {
        if(this._parent !== null) {
            this._parent.emit(eventType, this._id);
        }
    }

    template(model, params) {return "";}

    style() {
        return "";
    }

    _render(doInsert=false, fragment=null) {

        let element = document.createElement(this.tag);
        element.id = this.id;
        element.classList.add(this.id); // We add the id as a class because here - it will not be mutated/mangled.
        element.classList.add(...this.classList); // We add any remaining classes.
        element.innerHTML = this.template(this.base, 0);
        // First we make any element ids in this View - unique.
        walk(element, function(node) {
            // console.log("node", node); // DEBUG ONLY
            if(node.id !== null) {
                node.id = node.id + "-" + this._id;
            }
        }.bind(this));

        // Collect events
        let viewEvents = this.events();


        // Now we add any sub-views
        if(this.views !== null) {
            for(let id in this.views) {
                let view = this.views[id];
                viewEvents[view._id] = view._render(false, element);
            }
        }

        // Are we a top-level view?
        if(this._parent === null && fragment === null) {
            // YES - without passed fragment or parent
            fragment = document.createDocumentFragment();
        }
        fragment.appendChild(element);

        if(doInsert === true) {
            jQuery(this.target).append(fragment);
        }
        return viewEvents;
    }

    _renderMarkup(doInsert=false, markup=null) {

        let classList = [this.id]; // We add the id as a class because here - it will not be mutated/mangled.
        classList.push(...this.classList); // We add any remaining classes.


        let elementOpen = `<${this.tag} id="${this.id + "-" + this._id}" class="${classList.join(" ")}">`;
        let elementClose = "</" + this.tag + ">";
        let element = {html: this.template(this.base, 0)};

        // First we make any element ids in this View - unique.
        // let matches = content.match(/(?:id|class)="([^"]*)"/gi);    // Matches class="sfasdf" or id="dfssf"
        // console.log("MATCHES: " + JSON.stringify(matches));
        element.html = element.html.replace(/(?:id)="([^"]*)"/gi, `id="$1-${this._id}"`);    // Matches class="sfasdf" or id="dfssf"
        // console.log("CONTENT: " + JSON.stringify(element));

        // Collect events
        let viewEvents = this.events();

        // Now we add any sub-views
        if(this.views !== null) {
            for(let id in this.views) {
                let view = this.views[id];
                viewEvents[view._id] = view._renderMarkup(false, element);
            }
        }

        // Close the element's tag
        element.html = elementOpen + element.html + elementClose;

        // Are we a top-level view?
        if(markup === null) {
            // YES - without passed fragment or parent
            markup = {html: ""};
        }
        markup.html += element.html;
        // console.log("MARKUP: " + JSON.stringify(markup.html));

        if(doInsert === true) {
            jQuery(this.target).append(markup.html);
        }
        return viewEvents;
    }
}

EventEmitter(View.prototype);

// Exports
module.exports = View;



