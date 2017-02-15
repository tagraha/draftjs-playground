(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("components/App.jsx", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

var _custom = require('./custom');

var _custom2 = _interopRequireDefault(_custom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    var decorator = new _draftJs.CompositeDecorator([{
      strategy: findLinkEntities,
      component: Link
    }]);

    _this.state = {
      editor: false,
      editorState: _draftJs.EditorState.createEmpty(decorator)
    };
    _this.onChange = _this._onChange.bind(_this);
    _this.onBoldClick = _this._onBoldClick.bind(_this);

    _this.onAddLink = _this._addLink.bind(_this);
    _this.removeLink = _this._removeLink.bind(_this);

    //custom block style
    _this.myBlockRendererFn = _this._myBlockRendererFn.bind(_this);

    //image
    _this.confirmImage = _this._confirmImage.bind(_this);

    _this.logState = _this._logState.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: '_onBoldClick',
    value: function _onBoldClick() {
      var _this2 = this;

      this.onChange(_draftJs.RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
      setTimeout(function () {
        return _this2.refs.editor.focus();
      }, 0);
    }
  }, {
    key: '_onChange',
    value: function _onChange(editorState) {
      this.setState({ editorState: editorState });
    }
  }, {
    key: '_addLink',
    value: function _addLink() {
      var _this3 = this;

      var editorState = this.state.editorState;

      var contentState = editorState.getCurrentContent();
      var contentSelection = editorState.getSelection();

      var start = contentSelection.getStartOffset();
      var end = contentSelection.getEndOffset();

      var anchorKey = contentSelection.getAnchorKey();
      var currentContentBlock = contentState.getBlockForKey(anchorKey);
      var selectedText = currentContentBlock.getText().slice(start, end);

      console.log('contentState -> ', contentState);
      console.log('getSelection -> ', this.state.editorState.getSelection().getEndOffset());
      console.log('selectedText -> ', selectedText);

      var contentStateWithEntity = contentState.createEntity('LINK', 'MUTABLE', { href: 'http://www.betotally.com' });
      var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      var newEditorState = _draftJs.EditorState.set(editorState, { currentContent: contentStateWithEntity });

      this.setState({
        editorState: _draftJs.RichUtils.toggleLink(newEditorState, newEditorState.getSelection(), entityKey)
      });

      setTimeout(function () {
        _this3.logState();
        _this3.refs.editor.focus();
      }, 0);
    }
  }, {
    key: '_removeLink',
    value: function _removeLink(e) {
      e.preventDefault();
      var editorState = this.state.editorState;

      var selection = editorState.getSelection();
      if (!selection.isCollapsed()) {
        this.setState({
          editorState: _draftJs.RichUtils.toggleLink(editorState, selection, null)
        });
      }
    }
  }, {
    key: '_logState',
    value: function _logState() {
      var content = this.state.editorState.getCurrentContent();
      console.log((0, _draftJs.convertToRaw)(content));
    }
  }, {
    key: '_confirmImage',
    value: function _confirmImage(e) {
      var _this4 = this;

      e.preventDefault();
      var _state = this.state,
          editorState = _state.editorState,
          urlValue = _state.urlValue,
          urlType = _state.urlType;

      var contentState = editorState.getCurrentContent();
      var contentStateWithEntity = contentState.createEntity('image', 'IMMUTABLE', { src: 'http://res.cloudinary.com/betotally/image/upload/v1486889904/t4qfq4euk8t2vqbbpry2.jpg' });
      var entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      var newEditorState = _draftJs.EditorState.set(editorState, { currentContent: contentStateWithEntity });

      this.setState({
        editorState: _draftJs.AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '),
        showURLInput: false,
        urlValue: ''
      }, function () {
        setTimeout(function () {
          return _this4.refs.editor.focus();
        }, 0);
      });
    }
  }, {
    key: '_myBlockRendererFn',
    value: function _myBlockRendererFn(contentBlock) {
      var type = contentBlock.getType();
      if (type === 'atomic') {
        return {
          component: _custom2.default,
          editable: true,
          props: {
            foo: 'bar'
          }
        };
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.setState({ editor: true });
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { id: 'content' },
        _react2.default.createElement(
          'h5',
          null,
          'Time to ',
          _react2.default.createElement(
            'a',
            { href: 'https://facebook.github.io/react/' },
            'React'
          ),
          '.'
        ),
        _react2.default.createElement(
          'button',
          { onClick: this.onBoldClick },
          'BOLD'
        ),
        _react2.default.createElement(
          'button',
          { onClick: this.onAddLink },
          'LINK'
        ),
        _react2.default.createElement(
          'button',
          { onClick: this.removeLink },
          'REMOVE LINK'
        ),
        _react2.default.createElement(
          'button',
          { onClick: this.confirmImage },
          'Image'
        ),
        this.state.editor && _react2.default.createElement(_draftJs.Editor, {
          editorState: this.state.editorState,
          blockRendererFn: mediaBlockRenderer,
          onChange: this.onChange,
          ref: 'editor'
        })
      );
    }
  }]);

  return App;
}(_react2.default.Component);

exports.default = App;


function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(function (character) {
    var entityKey = character.getEntity();
    return entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK';
  }, callback);
}

function mediaBlockRenderer(block) {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false
    };
  }

  return null;
}

var Link = function Link(props) {
  var _props$contentState$g = props.contentState.getEntity(props.entityKey).getData(),
      url = _props$contentState$g.url;

  return _react2.default.createElement(
    'a',
    { href: url, style: styles.link },
    props.children
  );
};

var Image = function Image(props) {
  return _react2.default.createElement('img', { src: props.src, style: styles.media, width: '200', height: '200' });
};

var Media = function Media(props) {
  var entity = props.contentState.getEntity(props.block.getEntityAt(0));

  var _entity$getData = entity.getData(),
      src = _entity$getData.src;

  var type = entity.getType();

  var media = void 0;
  if (type === 'image') {
    media = _react2.default.createElement(Image, { src: src });
  }

  return media;
};

var styles = {
  root: {
    fontFamily: '\'Georgia\', serif',
    padding: 20,
    width: 600
  },
  buttons: {
    marginBottom: 10
  },
  urlInputContainer: {
    marginBottom: 10
  },
  urlInput: {
    fontFamily: '\'Georgia\', serif',
    marginRight: 10,
    padding: 3
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10
  },
  button: {
    marginTop: 10,
    textAlign: 'center'
  },
  link: {
    color: '#3b5998',
    textDecoration: 'underline',
    fontSize: 14
  }
};

});

require.register("components/custom/index.js", function(exports, require, module) {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MediaComponent = function (_React$Component) {
  _inherits(MediaComponent, _React$Component);

  function MediaComponent() {
    _classCallCheck(this, MediaComponent);

    return _possibleConstructorReturn(this, (MediaComponent.__proto__ || Object.getPrototypeOf(MediaComponent)).apply(this, arguments));
  }

  _createClass(MediaComponent, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          block = _props.block,
          contentState = _props.contentState;
      var foo = this.props.blockProps.foo;

      var data = contentState.getEntity(block.getEntityAt(0)).getData();
      return _react2.default.createElement(
        'figure',
        null,
        ' or some other content using this data.'
      );
    }
  }]);

  return MediaComponent;
}(_react2.default.Component);

});

require.register("initialize.js", function(exports, require, module) {
'use strict';

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _App = require('components/App');

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
  _reactDom2.default.render(_react2.default.createElement(_App2.default, null), document.querySelector('#app'));
});

});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map