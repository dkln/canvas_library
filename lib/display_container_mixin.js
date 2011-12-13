(function() {
  var DisplayContainerMixin;

  DisplayContainerMixin = (function() {

    function DisplayContainerMixin() {}

    DisplayContainerMixin.addChild = function(child) {
      if (child.parent) child.parent.removeChild(child);
      if (this.stage) this.stage.childrenChanged = true;
      this.determineAncestors(child);
      child.stage = this.stage;
      child.translatedObjects = [child].concat(child.ancestors).reverse();
      this.children.push(child);
      return this;
    };

    DisplayContainerMixin.removeChild = function(child) {
      var i;
      i = this.children.indexOf(child);
      if (i === -1) {
        throw 'Child object not found in DisplayList';
      } else {
        if (this.stage) this.stage.childrenChanged = true;
        this.children.splice(i, 1);
        child.parent = null;
        child.ancestors = null;
        child.translatedObjects = null;
        return this;
      }
    };

    DisplayContainerMixin.determineAncestors = function(child) {
      var theParent;
      child.parent = this;
      child.ancestors = [];
      theParent = this;
      while (theParent) {
        child.ancestors.push(theParent);
        theParent = theParent.parent;
      }
      return true;
    };

    return DisplayContainerMixin;

  })();

  this.CanvasLibrary || (this.CanvasLibrary = {});

  this.CanvasLibrary.DisplayContainerMixin = DisplayContainerMixin;

}).call(this);
