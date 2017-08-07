customElements.define("fancy-tabs", class extends HTMLElement {
    constructor() {
        super(); // always call super() first in the ctor.

        // Attach a shadow root to <fancy-tabs>.
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.innerHTML = `
        <style>
            #panels { 
                width: 200px; 
                height: 100px; 
                border: 1px solid red; 
            }
        </style>
        <div id="panels">
            <slot id="panelsSlot"></slot>
        </div>
    `;
    }
});


class CustomTag extends HTMLElement {
    constructor() {
        super(); // always call super() first in the ctor.

        // Collate markup
        let markup = this.style();
        markup += this.structure();

        // Attach a shadow root to <fancy-tabs>.
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.innerHTML = markup;
    }

    /**
     * @override
     */
    style() {}

    /**
     * @override
     */
    structure() {}
}



class FancyTabs extends CustomTag {
    constructor() {
        super();
    }

    style(model) {
        return `
            <style>
                #panels { 
                    width: 200px; 
                    height: 100px; 
                    border: 1px solid red; 
                }
            </style>
        `;
    }

    structure(model) {
        return `
            <div id="panels">
                <slot id="panelsSlot"></slot>
            </div>
        `;
    }
}


customElements.define("fancy-tabs", FancyTabs);
