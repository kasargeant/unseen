/**
 * @file Unseen.js
 * @description The Unseen class.
 * @author Kyle Alexis Sargeant <kasargeant@gmail.com> {@link https://github.com/kasargeant https://github.com/kasargeant}.
 * @copyright Kyle Alexis Sargeant 2017
 * @license See LICENSE file included in this distribution.
 */

"use strict";

// Imports

// Component
class Unseen {

    /**
     *
     * @param {Object} definition - The data definition to use as design structure, and default values.
     * @returns {Model} - A Model class for the given data definition.
     * @example
     * let MyModel = Unseen.makeModel({
     *      a: "hi",
     *      b: "ho",
     *      c: 3
     * });
     *
     * let myModel = new MyModel({
     *      a: "hing",
     *      b: "hong"
     * });
     *
     * console.log(myModel.c);
     */
    static makeModel(definition) {

        let _keys = Object.keys(definition);

        let Model = function(record, parent) {
            this._parent = parent;
            this._defaults = definition;
            this._record = {};

            for(let key of _keys) {

                Object.defineProperty(this, key, {
                    get: function() { return this._record[key]; },
                    set: function(value) { this._record[key] = value; }
                });

                this._record[key] = record[key] || this._defaults[key];
            }
        };

        Model.prototype._dump = function() {
            return JSON.stringify(this._record);
        };

        return Model;
    }

    /**
     *
     * @param {Model} ModelClass - The Model class to use for the Collection.
     * @returns {Collection} - The Collection class for the given Model type.
     * @example
     * const PointCollection = Unseen.makeCollection(Unseen.makeModel({x: 0, y: 0}));
     * let pointCollection = new PointCollection([
     *      {x: 10, y: 20},
     *      {x: 11, y: 20},
     *      {x: 14, y: 19}
     * ]);
     * let point1 = pointCollection.get(1);
     * console.log(point1.x);
     */
    static makeCollection(ModelClass) {

        function Collection(records=[]) {
            this.models = [];
            for(let i = 0; i < records.length; i++) {
                this.models.push(new ModelClass(records[i], this));
            }
            Object.defineProperty(this, "length", {
                get: function() { return this.models.length; }
            });
        }

        Collection.prototype.add = function(record) {
            let model = new ModelClass(record, this);
            this.models.push(model);
        };

        Collection.prototype.get = function(idx) {
            return this.models[idx];
        };

        Collection.prototype.set = function(records) {
            for(let i = 0; i < records.length; i++) {
                this.models.push(new ModelClass(records[i], this));
            }
        };

        Collection.prototype.reset = function() {
            this.models = [];
        };

        Collection.prototype._dump = function() {
            for(let i = 0; i < this.models.length; i++) {
                console.log(this.models[i]._dump());
            }
        };

        return Collection;
    }
}

// Exports
module.exports = Unseen;
