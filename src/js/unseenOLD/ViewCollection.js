class ViewCollection {
    constructor(views) {
        this.views = views;
    }

    render() {
        let markup = "";
        for(let view of this.views) {
            markup += view._render();
        }
        // if(this.useDOM === true) {
        //     this._insert();
        // }
        console.log(markup);
    }
}

// Exports
module.exports = ViewCollection;