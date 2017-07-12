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

class View {
    constructor(model, parent=null, id=0) {

        this._parent = parent;
        this._id = id;

        this.target = "main";
        this.tag = "section";

        this.model = model;
        this.model.parent = this;

        this.el = "";

        this.subViews = null;
        this.fragment = null;

        this.on("change", function(args) {
            console.log(`View #${this._id}: Model/Collection #${args} changed.`);
            this._emit("change"); // Relay the event forward
        });
    }

    _emit(eventType) {
        if(this._parent !== null) {
            this._parent.emit(eventType, this._id);
        }
    }

    template(model, params) {return JSON.stringify(model);}

    render() {
        // Render view for single model
        this.el = this.tag;
        for(let i = 0; i < this.model.length; i++) {
            let model = this.model.get(i); // Note if the 'model' IS a single model... it returns itself
            this.el += this.template(model, i);
        }
        this.el += "</" + this.tag + ">";
        return this.el;
    }

    renderTree() {
        // Render view for single model
        this.el = document.createElement(this.tag);
        for(let i = 0; i < this.model.length; i++) {
            let model = this.model.get(i); // Note if the 'model' IS a single model... it returns itself
            this.el.appendChild(this.template(model, i));
        }
        return this.el;
    }

    renderFragment() {
        // Render view for single model
        this.fragment = document.createDocumentFragment();
        for(let i = 0; i < this.model.length; i++) {
            let model = this.model.get(i); // Note if the 'model' IS a single model... it returns itself
            let element = document.createElement(this.tag);
            element.innerHTML = this.template(model, i);
            this.fragment.appendChild(element);
        }
        return this.fragment;
    }

    // render() {
    //
    //     // Render view for single model
    //     if(this.subViews === null) {
    //         this.el = this.template(this.model);
    //     } else {
    //         for(let i = 0; i < this.subViews.length; i++) {
    //             this.el += this.subViews.render();
    //         }
    //     }
    //     return this.el;
    // }
    //
    // renderFragment() {
    //
    //     this.fragment = document.createDocumentFragment();
    //     let element = null;
    //
    //     // Render view for single model
    //     if(this.subViews === null) {
    //         element = document.createElement(this.tag);
    //         element.innerHTML = this.template(this.model);
    //         this.fragment.appendChild(element);
    //     } else {
    //         for(let i = 0; i < this.subViews.length; i++) {
    //             element = document.createElement(this.tag);
    //             element.innerHTML = this.subViews.render();
    //             this.fragment.appendChild(element);
    //         }
    //     }
    //     return this.fragment;
    // }
}

EventEmitter(View.prototype);

// Exports
module.exports = View;



