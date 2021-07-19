"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var path = require('path');

var dotenv = require('dotenv');

var Script = /*#__PURE__*/function () {
  function Script(config, args) {
    (0, _classCallCheck2["default"])(this, Script);
    dotenv.config({
      path: "/".concat(config.ENV_PATH, "/").concat(args.env)
    });
    this.args = args;
    this.name = args.name;
    delete args.name;
  }

  (0, _createClass2["default"])(Script, [{
    key: "initTraits",
    value: function () {
      var _initTraits = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var traits, arrayOfTraitsNames;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                this.traits = {};
                traits = process.env.TRAITS;
                arrayOfTraitsNames = traits.split(",");
                _context2.next = 5;
                return Promise.all(arrayOfTraitsNames.map( /*#__PURE__*/function () {
                  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(val) {
                    var trait, object;
                    return _regenerator["default"].wrap(function _callee$(_context) {
                      while (1) {
                        switch (_context.prev = _context.next) {
                          case 0:
                            val = val.trim();
                            _context.next = 3;
                            return Promise.resolve("./traits/".concat(val, ".js")).then(function (s) {
                              return _interopRequireWildcard(require(s));
                            });

                          case 3:
                            trait = _context.sent;
                            object = new trait[val]();
                            _context.next = 7;
                            return object.init();

                          case 7:
                            this.traits[val] = object;

                          case 8:
                          case "end":
                            return _context.stop();
                        }
                      }
                    }, _callee, this);
                  }));

                  return function (_x) {
                    return _ref.apply(this, arguments);
                  };
                }().bind(this)));

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function initTraits() {
        return _initTraits.apply(this, arguments);
      }

      return initTraits;
    }()
  }, {
    key: "run",
    value: function () {
      var _run = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return Promise.all([this.logger.info("Starting script ".concat(this.name, "...")), this.main(this.args)]);

              case 3:
                _context3.next = 10;
                break;

              case 5:
                _context3.prev = 5;
                _context3.t0 = _context3["catch"](0);
                console.log('Error!', _context3.t0);
                _context3.next = 10;
                return this.logger.error("Error! ".concat(_context3.t0));

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this, [[0, 5]]);
      }));

      function run() {
        return _run.apply(this, arguments);
      }

      return run;
    }()
  }]);
  return Script;
}();

exports["default"] = Script;
