(function() {
  var Label, LabelObject, TextObject, pxtoinch, root,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  pxtoinch = function(px) {
    return px / 96.0;
  };

  LabelObject = (function() {

    function LabelObject(label, props) {
      this.label = label;
      this.props = props;
      this.el = $('<div />').addClass('label-object');
      this.el.data('object', this);
      this.type = 'base';
    }

    LabelObject.prototype.updateDimensions = function(w, h) {
      console.log('udateddim', w, h);
      this.el.css('width', w + 'in');
      return this.el.css('height', h + 'in');
    };

    LabelObject.prototype.serialize = function() {
      var k, pos, r, v, _ref;
      r = {
        type: this.type
      };
      _ref = this.props;
      for (k in _ref) {
        v = _ref[k];
        r[k] = v;
      }
      r['width'] = pxtoinch(this.el.width());
      r['height'] = pxtoinch(this.el.height());
      pos = this.el.position();
      r['x'] = pxtoinch(pos.left);
      r['y'] = pxtoinch(pos.top);
      return r;
    };

    return LabelObject;

  })();

  TextObject = (function(_super) {

    __extends(TextObject, _super);

    function TextObject(label, props) {
      this.label = label;
      this.props = props;
      TextObject.__super__.constructor.call(this, this.label, this.props);
      this.type = 'text';
      this.el.addClass('text');
      this.el.text(this.props.text);
      this.updateDimensions(this.props.width, this.props.height);
      this.updateProps(this.props);
    }

    TextObject.prototype.updateProps = function(props) {
      if (props['font-size']) {
        this.props['font-size'] = props['font-size'];
        this.el.css('font-size', this.props['font-size'] + 'in');
      }
      if (props['align']) {
        this.props['align'] = props['align'];
        this.el.css('text-align', this.props['align']);
      }
      if (props['font']) {
        this.props['font'] = props['font'];
        return this.el.css('font-family', this.props['font']);
      }
    };

    TextObject.prototype.incrementFontSize = function(dir) {
      var fs;
      fs = this.props['font-size'];
      fs += dir * 0.1;
      return this.updateProps({
        'font-size': fs
      });
    };

    TextObject.prototype.serialize = function() {
      var r;
      r = TextObject.__super__.serialize.call(this);
      r['text'] = this.el.text();
      return r;
    };

    return TextObject;

  })(LabelObject);

  Label = (function() {

    function Label(el, width, height) {
      var _this = this;
      this.el = el;
      this.width = width;
      this.height = height;
      this.el.addClass('labelcanvas');
      this.el.bind('click', function() {
        return _this.unselectAll();
      });
      this.setWidth(this.width);
      this.setHeight(this.height);
    }

    Label.prototype.setWidth = function(inches) {
      this.el.css('width', inches + 'in');
      return this.width = inches;
    };

    Label.prototype.setHeight = function(inches) {
      this.el.css('height', inches + 'in');
      return this.height = inches;
    };

    Label.prototype.serialize = function() {
      var els, objects, sobj, to;
      objects = (function() {
        var _i, _len, _ref, _results;
        _ref = this.el.find('.label-object');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          els = _ref[_i];
          to = $(els).data('object');
          _results.push(to.serialize());
        }
        return _results;
      }).call(this);
      return sobj = {
        width: this.width,
        height: this.height,
        objects: objects
      };
    };

    Label.prototype.addText = function(txt) {
      var to,
        _this = this;
      console.log('object added', this.width, this.height);
      to = new TextObject(this, {
        text: txt,
        'font-size': 1,
        'font': 'Helvetica',
        width: this.width - 0.5,
        height: this.height - 0.5
      });
      to.el.draggable({
        start: function() {
          return _this.objectClicked(to);
        }
      });
      to.el.resizable({
        start: function() {
          return _this.objectClicked(to);
        }
      });
      to.el.bind('click', function(evnt) {
        evnt.stopPropagation();
        return _this.objectClicked(to);
      });
      return this.el.append(to.el);
    };

    Label.prototype.unselectAll = function() {
      return this.el.find('.label-object').removeClass('selected');
    };

    Label.prototype.getSelectedObject = function() {
      return this.el.find('.selected').data('object');
    };

    Label.prototype.objectClicked = function(obj) {
      var to;
      this.unselectAll();
      obj.el.addClass('selected');
      to = obj.el.data('object');
      return console.log('Found obj', to);
    };

    return Label;

  })();

  root = window || this;

  root.Label = Label;

  root.TextObject = TextObject;

  root.LabelObject = LabelObject;

}).call(this);
