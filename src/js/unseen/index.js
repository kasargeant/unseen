// // Use custom elements API v1 to register a new HTML tag and define its JS behavior
// // using an ES6 class. Every instance of <fancy-tab> will have this same prototype.
// customElements.define('fancy-tabs', class extends HTMLElement {
//     constructor() {
//         super(); // always call super() first in the ctor.
//
//         // Attach a shadow root to <fancy-tabs>.
//         const shadowRoot = this.attachShadow({mode: 'open'});
//         shadowRoot.innerHTML = `
//       <style>#tabs { border: 1px solid red; }</style> <!-- styles are scoped to fancy-tabs! -->
//       <div id="tabs">...</div>
//       <div id="panels">...</div>
//     `;
//     }
// });


// // Use custom elements API v1 to register a new HTML tag and define its JS behavior
// // using an ES6 class. Every instance of <fancy-tab> will have this same prototype.
// customElements.define("fancy-tabs", class extends HTMLElement {
//     constructor() {
//         super(); // always call super() first in the ctor.
//
//         // Attach a shadow root to <fancy-tabs>.
//         const shadowRoot = this.attachShadow({mode: "open"});
//         shadowRoot.innerHTML = `
//         <style>
//             #panels {
//                 width: 200px;
//                 height: 100px;
//                 border: 1px solid red;
//             }
//         </style>
//         <div id="panels">
//             <slot id="panelsSlot"></slot>
//         </div>
//     `;
//     }
// });

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

class CustomTag extends HTMLElement {
    constructor() {
        super(); // always call super() first in the ctor.

        this.el = "";

        this.initialize();

        // Collate markup
        // let markup = this.style();
        // markup += this.structure();

        // Attach a shadow root to <fancy-tabs>.
        // const shadowRoot = this.attachShadow({mode: "open"});
        // shadowRoot.innerHTML = "";


        setTimeout(function() {
            let div = document.createElement('div');
            div.classList.add('ripple');
            this.appendChild(div);

        }.bind(this), 4000);
    }

    connectedCallback() {
        this.name = this.getAttribute("name") || this.name;
        console.log("NAME: " + this.name);
        console.log(this.name);
        this.render();
        this.publish();
    }

    render() {
        this.el = this.style() + this.structure();
    }

    publish() {

        // Attach a shadow root to <fancy-tabs>.
        const shadowRoot = this.attachShadow({mode: "open"});
        shadowRoot.innerHTML = this.el;
        // this.innerHTML = this.el;
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

    initialize() {
        // console.log("INIT CALLED!");
        // this.name = this.getAttribute("data-name");
        // console.log(this.name);
    }

    style(model) {
        return `
            <style>
                :host {
                    display: inline-block;
                    width: 650px;
                    contain: content;
                }
                #panels {
                    width: 200px;
                    height: 100px;
                    border: 1px solid green;
                }
                ::slotted(h2) {
                    margin: 0;
                    font-weight: 300;
                    color: red;
                }

            </style>
        `;
    }

    structure(model) {

        return `
            <div id="panels">
                <h1>${this.name}</h1>
                <slot name="panelsSlot"></slot>
            </div>
        `;
    }
}


customElements.define("fancy-tabs", FancyTabs);

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
//
// // Create a class for the element
// class XProduct extends HTMLElement {
//     constructor() {
//         // Always call super first in constructor
//         super();
//
//         // Create a shadow root
//         var shadow = this.attachShadow({mode: 'open'});
//
//         // Create a standard img element and set it's attributes.
//         var img = document.createElement('img');
//         img.alt = this.getAttribute('data-name');
//         img.src = this.getAttribute('data-img');
//         img.width = '150';
//         img.height = '150';
//         img.className = 'product-img';
//
//         // Add the image to the shadow root.
//         shadow.appendChild(img);
//
//         // Add an event listener to the image.
//         img.addEventListener('click', () => {
//             window.location = this.getAttribute('data-url');
//         });
//
//         // Create a link to the product.
//         var link = document.createElement('a');
//         link.innerText = this.getAttribute('data-name');
//         link.href = this.getAttribute('data-url');
//         link.className = 'product-name';
//
//         // Add the link to the shadow root.
//         shadow.appendChild(link);
//     }
// }
//
// // Define the new element
// customElements.define('x-product', XProduct);