/*
# Created by S2DesignsTeam © 2035 (Phobetor1999 AKA ㊙️anonimo㊙️).
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
*/

/*📎DOCUMENTATION
* Author:      ㊙️anonimo㊙️
* Description: The Base Component class used as Base for the further Gui components defined elsewhere.
* last modify: 2024-05-19
* ClassName:   BaseComponent
* Version:     0.0.001
*/
export class BaseComponent {
    /*📎DOCUMENTATION
    * Author:      ㊙️anonimo㊙️
    * Description: The class constructor.
    * last modify: 2024-05-19
    * Parameters:  [optional] properties => properties of the component
    *              [optional] cssFileUrl => the css style url of the component
    */   
    constructor(properties = {}, cssFileUrl = null) {

        if (this.constructor === BaseComponent) {
            throw new Error("BaseComponent is an abstract class and cannot be instantiated directly.");
        }
        
        this.className                 = this.constructor.name;
        this.props                     = [];
        this.parentId                  = ""; // Dichiarazione della variabile di classe
        this.container                 = null;
        this.properties                = properties;
        this.htmlSegment               = "";
        
        this.cssStyles                 = "";
        this.cssFileUrl                = cssFileUrl;
        
        this.scriptUrls                = [];
        this.childComponentsCollection = [];

        // Creates a container element for this GUI Component
        this.container                 = document.createElement("SPAN");
        this.container.innerHTML       = this.htmlSegment;
        this.container.setAttribute("id", this.className);	    
    }

    /*📎DOCUMENTATION
    * Author:      ㊙️anonimo㊙️
    * Description: A 'placeholder' method to be used to add inizialization to the GUI Component.
    *              This method has to be overrided inside upper level component class implementing this Base Component class.
    * last modify: 2024-05-19
    * MethodName:  initialize
    */        
    initialize() {}

    /*📎DOCUMENTATION
    * Author:      ㊙️anonimo㊙️
    * Description: A 'placeholder' method to be used to add event listeners to the GUI Component.
    *              This method has to be overrided inside upper level component class implementing this Base Component class.
    * last modify: 2024-05-19
    * MethodName:  addEventListeners
    * Parameters:  [required] container => the component's container to which add the events listeners
    */
    addEventListeners(container) {}
    
    /*📎DOCUMENTATION
    * Author:       ㊙️anonimo㊙️
    * Description:  This method adds or updates a global property
    * last modify:  2024-05-24
    * MethodName:   setProperty
    * Parameters:   [required] nameOrObject ==========> It could ne a string (the property name) or an object.
    *               [optional][default = null] value => The property value.
    */
    setProperty = (nameOrObject, value = null) => {
        switch (typeof nameOrObject) {
                
            case "string":
                /*
                * if the 1st parameter is a string uses directly the name and the value parameters.
                */
                this.props[nameOrObject] = value;
                break;
                
            case "object":
                if (nameOrObject !== null) {
                    /*
                    * if the 1st parameter is an object, extracts its name and its value.
                    */
                    Object.keys(nameOrObject).forEach(key => {
                        this.props[key] = nameOrObject[key];
                    });
                } else {
                    throw new Error('Invalid parameter: nameOrObject must not be null');
                }
                break;
                
            default:
                throw new Error('Invalid parameter: nameOrObject must be either a string or an object');
        }
    };  
    
    /*📎DOCUMENTATION
    * Author:       ㊙️anonimo㊙️
    * Description: 
    * last modify:  2024-05-24
    * FunctionName: getProperty
    */
    getProperty = (propertyName) => { return this.props[propertyName]; };
    
    /*📎DOCUMENTATION
    * Author:      ㊙️anonimo㊙️
    * Description: This method loads the css style defined inside the file passed with the 'url' parameter.
    * last modify: 2024-05-19
    * MethodName:  loadCss
    * Parameters:  [required] url =>  URL of the css to be applied to this component.
    */   
    loadCss(url) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.setAttribute('data-component', this.constructor.name);
            link.rel     = 'stylesheet';
            link.href    = url;
            link.onload  = () => resolve();
            link.onerror = () => reject(`Could not load CSS file: ${url}`);
            document.head.appendChild(link);
        });
    }

    /*📎DOCUMENTATION
    * Author:      ㊙️anonimo㊙️
    * Description: This method adds the script defined inside the file passed with the 'url' parameter.
    * last modify: 2024-05-19
    * MethodName:  loadScript
    * Parameters:  [required] url => URL of the script to be added.
    */
    loadScript(url) {
        this.scriptUrls.push(url);
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.setAttribute('data-component', this.constructor.name);
            script.src     = url;
            script.onload  = () => resolve();
            script.onerror = () => reject(`Could not load script: ${url}`);
            document.body.appendChild(script);
        });
    }
    
    /*📎DOCUMENTATION
    * Author:      ㊙️anonimo㊙️
    * Description: Method to add a child component.
    * last modify: 2024-05-19
    * MethodName:  addChildComponent
    * Parameters:  [required] childComponent => child component to be added.
    */
    addChildComponent(childComponent) {
        this.childComponentsCollection.push(childComponent);
    }
    
    /*📎DOCUMENTATION
    * Author:      ㊙️anonimo㊙️
    * Description: Method to add a child component.
    * last modify: 2024-05-19
    * MethodName:  addChildComponent
    * Parameters:  [required] childComponent => child component to be added.
    */
    removeChildComponent(childComponent) {
        childComponent.dispose();
        this.childComponentsCollection = this.childComponentsCollection.filter(comp => comp !== childComponent);
    }

    createTooltip = (elementId, tooltipText) =>{
        const element = document.getElementById(elementId);
            if (element) {
                element.setAttribute("data-tooltip", tooltipText);
                element.onmousemove = (evt) => {
                    evt.preventDefault();
                    x = 0 + evt.clientX;
                    y = 0 + evt.clientY;
                    // Make it hang below the cursor a bit.
                    y += 10;
                    /*
                    console.debug("mouse position => x:" + x + " y:" + y );
                    element.setAttribute("data-tooltipX", x + "px");
                    element.setAttribute("data-tooltipY", y + "px");
                    */
                };
            }
    };
    
    /*📎DOCUMENTATION
    * Author:      ㊙️anonimo㊙️
    * Description: This async method shows up the GUI Component inside the parent one.
    *              If the id of the parent has been passed then uses it to retrieve the parent tag
    *              otherwise it assumes that the Gui Component has to be rendered directly into the 
    *              body.
    * last modify: 2024-05-19
    * MethodName:  render
    * Parameters:  [optional][default = null] parentId => is the id of parent component containing this GUI Component
    */    
    async render(parentId = null) {
        var parent = null;
        /*
        * If the id of the parent has been passed then uses it to retrieve the parent tag
        * otherwise it assumes that the Gui Component has to be rendered directly into the 
        * body.
        */
        if (parentId) {
            this.parentId = parentId;
            parent = document.getElementById(this.parentId);
        } else {
            parent = document.body;
            if (!parent.id) { parent.id = "main"; }
            //this.parentId = parent.id;
        }    
        /*
        * Calls the 'placeholder' method to initialize this GUI Component.
        * if it is overrided by the implementing class then runs the code defined in there
        * otherwise it runs the placeholder that is empty (so it does nothing).
        */
        this.initialize();
        
        /*
        * If no parentId has been found then shows up a console error message and
        * extits the render procedure.
        */
        if (!parent) {
            console.error("Parent element with id " + this.parentId + " not found.");
            return;
        }
        
        /*
        * If has been defined a css file path related to this GUI Component 
        * proceeds to load it.
        */
        if (this.cssFileUrl) {
            try {
                await this.loadCss(this.cssFileUrl);
            } catch (error) {
                console.warn(error);
            }
        }

        /* 
        * If the component class has an style defined internally then it creates 
        * the relative DOM object appending the style defined inside the component
        * after that it places the Object inside the head section of the main HTML page.
        */
        if (this.cssStyles) {
            const style = document.createElement('style');
            style.setAttribute('data-component', this.constructor.name);
            style.textContent = this.cssStyles;
            document.head.appendChild(style);
        }

        this.container.innerHTML = this.htmlSegment;
        /* 
        * Adds the component to the parent GUI object.
        */
        parent.appendChild(this.container);

        /* 
        * Calls the 'placeholder' method to add the event liteners to this GUI Component.
        * if it is overrided by the implementing class then runs the code defined in there
        * otherwise it runs the placeholder that is empty (so it does nothing).
        */
        this.addEventListeners(this.container);

        /*
        * Renders all child components.
        */
        for (const myChildComponentIterator of this.childComponentsCollection) {
            await myChildComponentIterator.render(this.container.id);
        }
    }
    
    /*📎DOCUMENTATION
    * Author:      ㊙️anonimo㊙️
    * Description: This method is intended to be used to remove this GUI component from the HTML code.
    * last modify: 2024-05-19
    * MethodName:  dispose
    */
    async dispose() {
        if (this.container) {
            this.container.remove();
            this.container = null;

            // CSS STYLES ===============================================================
            
            /*
            * Removes the external stylesheet link associated to this component
            */
            const externalStyle = document.querySelector("link[href='${this.cssFilePath}']");
            if (externalStyle) {
                externalStyle.remove();
            }
            /*
            * Removes all internal styles associated to this component
            */
            const internalStyle = document.querySelector("style[data-component='${this.constructor.name}']");
            internalStyle.remove();

            // SCRIPTS ==================================================================
            
            /*
            * Removes all the added external scripts associated to this component
            */
            this.scriptUrls.forEach(url => {
                const externalScript = document.querySelector(`script[src="${url}"]`);
                if (externalScript) {
                    externalScript.remove();
                }
            });
            /*
            * Removes added internal scripts associated to this component
            */
            const internalScripts = document.querySelectorAll("script[data-component='${this.constructor.name}']");
            internalScripts.forEach(internaScriptIterator => {
                internaScriptIterator.remove();
            });

            // CHILD COMPONENTS =========================================================
            
            /*
            * Removes all child components (IT IS PROPAGATED TO ALL THE CHILD COMPONENTS EVEN IF THEY ARE NESTED INSIDE ANOTHER CHILD COMPONENT).
            */
            for (const myChildComponentIterator of this.childComponentsCollection) {
                await myChildComponentIterator.dispose();
            }
        }
    }
}
