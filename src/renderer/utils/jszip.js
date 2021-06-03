/* eslint-disable */
"use strict";

import _zipStream from './zip-stream'
import _streamsaver from 'streamsaver'
_streamsaver.mitm = "https://cloud.cdn-qn.hzmantu.com/Utils/mitm.html"

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return !!right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Zip = /*#__PURE__*/function () {
  function Zip() {
    _classCallCheck(this, Zip);

    _defineProperty(this, "_name", '');
  }

  _createClass(Zip, [{
    key: "downZip",
    value: function downZip(photoArr) {
      // 去重
      photoArr = [...new Set(photoArr)]
      var zipName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "file";
      var cb = arguments.length > 2 ? arguments[2] : undefined;

      var _this = this;

      _this._name = zipName;
      var fileStream = _streamsaver.createWriteStream("".concat(zipName, ".zip"));
      var readableZipStream = new _zipStream({
        start: async function start(ctrl) {
          for (const url of photoArr) {
            await _this._addStream(url, ctrl);
          }
          ctrl.close()
        }
      })

      if (window.WritableStream && readableZipStream.pipeTo) {
        return readableZipStream.pipeTo(fileStream).then(function () {
          cb && cb(fileStream);
        });
      }

      window.writer = fileStream.getWriter();
      var reader = readableZipStream.getReader();

      var pump = function pump() {
        return reader.read().then(function (res) {
          return res.done ? writer.close() : writer.write(res.value).then(pump);
        });
      };

      pump();
    }
  }, {
    key: "_addStream",
    value: async function _addStream(url, ctrl) {
      var res = await fetch(url);
      var stream = function stream() {
        return res.body;
      };

      var fileName = this._getFileName(url);

      var name = "/".concat(this._name, "/") + fileName;
      ctrl.enqueue({
        name: name,
        stream: stream
      });
    }
  }, {
    key: "_getFileName",
    value: function _getFileName(url) {
      var indexPoint = url.lastIndexOf('/') + 1;
      return url.substring(indexPoint).split('?')[0];
    }
  }]);

  return Zip;
}();

export default Zip