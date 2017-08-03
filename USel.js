module.exports = (function () {
    /**
    *@param {string} selector , all CSS selector or '#' to identify an id tag attribute
    *@return on elements property a collection of node that match selector or first node that match id tag attribute (#)
    */
    function U(selector){
        var that = this;
            if (!selector) return this;
            if(typeof selector !=='string' && !_isElement(selector))return this;
            if (selector.length == 0) return this;

            function _setClass(ele, ind, arr) {
                var stringaClassi = ele.getAttribute('class');
                if (stringaClassi) {
                    var elencoClassi = stringaClassi.split(' ');
                    if (elencoClassi.indexOf(that.className) == -1) {
                        stringaClassi = stringaClassi + ' ' + that.className;
                        ele.setAttribute('class', stringaClassi);
                    }
                } else { ele.setAttribute('class', that.className); }
            }
            function _remClass(ele, ind, arr) {
                var stringaClassi = ele.getAttribute('class');
                if (stringaClassi) {
                    var elencoClassi = stringaClassi.split(' ');
                    if (elencoClassi.indexOf(that.className) != -1) {
                        elencoClassi.splice(elencoClassi.indexOf(that.className), 1);
                        stringaClassiNew = elencoClassi.join(' ');
                        if (stringaClassiNew) {
                            ele.setAttribute('class', stringaClassiNew);
                        }
                    }

                }
            }
            function _generateAttribute(tag, attribute) {
                if (Array.isArray(attribute)) {
                    attribute.forEach(function (e, a, i) {
                        if (!typeof e === 'object') throw new Error('attribute array element isn\'t an object');
                        tag.setAttribute(e.attr, e.value);
                    });
                    return tag;
                }
                if (typeof attribute === 'object') {
                    tag.setAttribute(attribute.attr, attribute.value);
                    return tag;
                }
                return tag;
            }
            function _isElement(obj) {
                try {
                    return obj instanceof HTMLElement;
                }
                catch(e){
                    return (typeof obj==="object") &&
                      (obj.nodeType===1) && (typeof obj.style === "object") &&
                      (typeof obj.ownerDocument ==="object");
                }
            }
            

            if (typeof selector === 'string') {
                if (selector.search('#') == 0) {
                    selector = selector.replace('#', '');
                    this.elements = document.getElementById(selector);
                } else {
                    this.elements = document.querySelectorAll(selector);
                }
            }
            //if (_isElement(selector)) {
            //    this.elements = selector;
            //}
            /**
            *@param {string} className, name of class to set on elements that match selector
            */
            this.addClass = function (className) {
                that.className = className;
                if (that.elements) {
                    if (that.elements.length) {
                        for (var i = 0; i < that.elements.length; i++) {
                            _setClass(that.elements[i], i, that.elements);
                        }
                        that.className = undefined;
                        return that;
                    }
                    _setClass(that.elements, 0, 0);
                }
                that.className = undefined;
                return that;
            }
            /**
            *@param {string} className, name of class to remove on elements that match selector
            */
            this.removeClass = function (className) {
                that.className = className;
                if (that.elements) {
                    if (that.elements.length) {
                        for (var i = 0; i < that.elements.length; i++) {
                            _remClass(that.elements[i], i, that.elements);
                        }
                        that.className = undefined;
                        return that;
                    }
                    _remClass(that.elements, 0, 0);
                }
                that.className = undefined;
                return that;
            }
            /**
            / get and set
            *@param {string} name, name of attribute to set on elements that match selector
            *@param {string} value, value of attribute to set on elements that match selector
            */
            this.attr = function (name, value) {
                if (value != undefined) {
                    if (that.elements) {
                        if (that.elements.length) {
                            for (var i = 0; i < that.elements.length; i++) {
                                that.elements[i].setAttribute(name, value);
                            }
                            return that;
                        }
                        that.elements.setAttribute(name, value);
                    }
                } else {
                    if (that.elements) {
                        if (that.elements.length) {
                            return that.elements[0].getAttribute(name);
                        }
                        return that.elements.getAttribute(name);
                    }
                }
                return that;
            }
            /**
            *@param {string} name, name of attribute to remove on elements that match selector
            */
            this.removeAttr = function (name) {
                if (that.elements) {
                    if (that.elements.length) {
                        for (var i = 0; i < that.elements.length; i++) {
                            that.elements[i].removeAttribute(name);
                        }
                    } else {
                        that.elements.removeAttribute(name);
                    }
                }
                return that;
            }
            /**
            *@param {string} event, event to bind on elements that match selector
            *@param {function} Function, function to be done on event occur 
            *
            */
            this.on = function (event, Function) {
                if (that.elements) {
                    if (that.elements.length) {
                        for (var i = 0; i < that.elements.length; i++) {
                            that.elements[i].addEventListener(event, Function);
                        }
                        return that;
                    } 
                    that.elements.addEventListener(event, Function);
                }
                return that;
            }
            /**
            *create a new tag and append it on elements that match selector
            *
            *@param {Object} setter, object that describe new tag that function return
            *@param {string} setter.tag, name of tag ex. 'div, text, input, span, etc'
            *@param {Object|Object[]} setter.attribute, object {attr:'name of attribute', value:'value of attribute'} or array of that object to set on new tag
            *
            */
            this.create = function (setter) {
                if (that.elements) {
                    if (setter.tag != 'text') {
                        var tag = document.createElement(setter.tag);
                        if (setter.attribute) tag = _generateAttribute(tag, setter.attribute);

                        if (that.elements.length) {
                            for (var i = 0; i < that.elements.length; i++) {
                                var eTag = tag.cloneNode(false);
                                that.elements[i].appendChild(eTag);
                            }
                            return that;
                        }
                        that.elements.appendChild(tag);
                        return that;
                    }
                    var tag = document.createTextNode(setter.value);
                    if (that.elements.length) {
                        for (var i = 0; i < that.elements.length; i++) {
                            var eTag = tag.cloneNode(false);
                            that.elements[i].appendChild(eTag);
                        }
                        return that;
                    }
                    that.elements.appendChild(tag);

                    return that;
                }
                return that;
            }
            
            /**
            *set css rule on elements that match selector
            *
            *@param {Object} setter, object {"css rule": "css value"} ex.{border: "1px solid red', position:'relative'}
            */
            this.css = function (setter) {
                for (prop in setter) {
      
                    if (that.elements) {
                        if (that.elements.length) {
                            for (var i = 0; i < that.elements.length; i++) {
                                that.elements[i].style[prop] = setter[prop];
                            }
                        }
                    }
                }
                return that;
            }
            return this;
    }
    return U; 
 })();

