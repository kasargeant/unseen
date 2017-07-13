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

class ViewCollection {
    constructor(ViewClass, modelCollection, parent=null, id=0) {

        this._parent = parent;
        this._id = id;

        this.target = "main";
        this.tag = "section";

        this.ViewClass = ViewClass;
        this.model = modelCollection;
        this.model._parent = this;
        this.views = [];

        // let i;
        // for(i = 0; i < this.model.length; i++) {
        //     let model = this.model.get(i); // Note if the 'model' IS a single model... it returns itself
        //     let view = new this.ViewClass(model, this, i);
        //     this.views.push(view);
        // }
        for(let id in this.model.models) {
            let model = this.model.models[id]; // Note if the 'model' IS a single model... it returns itself
            let view = new this.ViewClass(model, this, id);
            this.views.push(view);
        }

        this.length = this.views.length;
        this._viewCounter = this.views.length; // This provides a unique ID for every view.

        this.el = "";

        this.fragment = null;

        this.on("change", function(args) {
            console.log(`ViewCollection #${this._id}: Model/Collection #${args} changed.`);
            this._emit("change"); // Relay the event forward
        });
    }

    _emit(eventType) {
        if(this._parent !== null) {
            this._parent.emit(eventType, this._id);
        }
    }

    // template(model, params) {return JSON.stringify(model);}

    render(doInsert=false) {
        this.el = `<${this.tag} id="view-collection-${this._id}">`;
        for(let i = 0; i < this.views.length; i++) {
            this.el += this.views[i].render(false);
        }
        this.el += "</" + this.tag + ">";
        if(doInsert === true) {
            jQuery(this.target).append(this.el);
        } else {
            return this.el;
        }
    }

    renderTree(doInsert=false) {
        // Render view for single model
        this.el = document.createElement(this.tag);
        this.el.id = `view-collection-${this._id}`;
        for(let i = 0; i < this.views.length; i++) {
            this.el.appendChild(this.views[i].render(false));
        }
        if(doInsert === true) {
            jQuery(this.target).append(this.el);
        } else {
            return this.el;
        }
    }

    renderFragment(doInsert=false) {
        // Render view for single model
        this.fragment = document.createDocumentFragment();
        for(let i = 0; i < this.model.length; i++) {
            let model = this.model.get(i); // Note if the 'model' IS a single model... it returns itself
            let element = document.createElement(this.tag);
            element.innerHTML = this.template(model, i);
            this.fragment.appendChild(element);
        }
        if(doInsert === true) {
            jQuery(this.target).append(this.fragment);
        } else {
            return this.fragment;
        }
    }
}

EventEmitter(ViewCollection.prototype);

// Exports
module.exports = ViewCollection;



