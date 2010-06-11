/**
 * HTML Canvas Library 
 * @author D Lawson <webmaster@altovista.nl>
 *
 */
var canvaslib = {  
  // source: http://michaux.ca/articles/class-based-inheritance-in-javascript
  extend: function(subclass, superclass) {
    function DummyClass() {}
    DummyClass.prototype = superclass.prototype;
    subclass.prototype = new DummyClass();
    subclass.prototype.constructor = subclass;
    subclass.superclass = superclass;
    subclass.superproto = superclass.prototype;
  }
};
