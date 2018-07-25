let array = {
  getItemInObjArrByKey: (key, value, _array) => {
    if (!key && value) return;
    if (_array.length === 0) return;
    for (let i = 0; i <= _array.length; ++i) {
      if (!_array[i]) return;
      if (String(_array[i][key]) === String(value)) {
        return {
          index: i,
          object: _array[i]
        };
      }
    }
    return false;
  },
  deleteItemArrByElement: (element, _array) => {
    let counter = 0;
    while(_array[counter]){
      if(_array[counter] === element){
        _array.splice(counter, 1);
        counter = counter -1;
        continue;
      }
      counter++;
    }
  }
};

let ajax = (() => {
  let obj = {};
  obj.json2form = (json) => {
    let urlEncodedData = '';
    let urlEncodedDataPairs = [];
    for (let name in json) {
      urlEncodedDataPairs.push(
        encodeURIComponent(name) + '=' + encodeURIComponent(json[name])
      );
    }
    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
    return urlEncodedData;
  };
  obj.request = (arg) => {
    if (!arg.address) return false;
    let address = arg.address;
    let method = arg.method || 'GET';
    var XHR = ('onload' in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    obj.xhr = new XHR();
    obj.xhr.open(method, address, true);
    return obj;
  };
  obj.success = (callback) => {
    if (!callback) return false;
    obj.xhr.onload = function () {
      callback(this.responseText);
    };
    return obj;
  };
  obj.error = (callback) => {
    if (!callback) return false;
    obj.xhr.onerror = function () {
      callback(this.status);
    };
    return obj;
  };
  obj.send = (arg) => {
    let urlEncodedData = obj.json2form(arg);
    obj.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    obj.xhr.send(urlEncodedData);
  };

  return obj;
})();

export default (() => {
  let obj = { };
  obj.errors = [ ];

  obj.init = () => {
    obj.errors = [ ];
  };
  obj.reset = () => {
    obj.errors = [ ];
  };

  obj.get = (name) => {
    if (!name) return;
    if (!obj.errors.length === 0) return;
    let returnItem = array.getItemInObjArrByKey('name', name, obj.errors);
    return returnItem;
  };
  obj.addRule = (arg) => {
    if (arg.expression) {
      obj.addError(arg);
    } else {
      obj.deleteError(arg);
    }
    return obj;
  };
  obj.serverCheck = (objArg) => {
    if (!objArg || typeof objArg === 'number') return false;
    if (typeof objArg === 'string') {
      try {
        objArg = JSON.parse(objArg);
      } catch (e) {
        return false;
      }
    }
    if (
      objArg.hasOwnProperty('address') === false ||
      objArg.hasOwnProperty('data') === false) return false;
    if (objArg.hasOwnProperty('success') === false) return false;
    let address = objArg.address;
    let method = objArg.method || 'POST';
    let data = objArg.data;
    let success = objArg.success;
    let error = objArg.error || (() => { return () => { }; })();
    ajax
      .request({
        address: address,
        method: method
      })
      .success(e => success(e))
      .error(e => error(e))
      .send(data);
    return obj;
  };

  obj.getErrors = (name) => {
    let object = obj.get(name);
    let item = object && object.hasOwnProperty('object') ? object.object : undefined;
    if (!item) return;
    let messages = item.hasOwnProperty('msgs') ? item.msgs : undefined;
    if (!messages) return;
    return messages;
  };

  obj.addError = (arg) => {
    let object = obj.get(arg.name);
    let item = object && object.hasOwnProperty('object') ? object.object : undefined;
    if (item === undefined) {
      obj.errors.push({
        expression: arg.expression,
        name: arg.name,
        msgs: [arg.msg]
      });
    } else {
      let isDublicate = false;
      item.msgs.forEach((itemMsg, i, arr) => {
        if (itemMsg === arg.msg) {
          isDublicate = true;
        }
      });
      if (!isDublicate) {
        item.expression = arg.expression;
        item.msgs.push(arg.msg);
      }
    }
    return obj;
  };

  obj.emptyCheck = () => {
    let keys = [];
    obj.errors.forEach((item, i, arr) => {
      if (item.msgs.length === 0) {
        keys.push(item.name);
      }
    });
    keys.forEach((item, i, arr) => {
      let index = obj.get(item).index;
      obj.errors.splice(index, index + 1);
    });
  };
  obj.deleteError = (arg) => {
    let object = obj.get(arg.name);
    let item = object && object.hasOwnProperty('object') ? object.object : undefined;
    if (item !== undefined) {
      array.deleteItemArrByElement(arg.msg, item.msgs);
    }
    obj.emptyCheck();
    return obj;
  };

  obj.deleteAllErrorByName = (strName) => {
    let counter = 0;
    while(obj.errors[counter]){
      if(obj.errors[counter].name === strName){
        obj.errors.splice(counter, 1);
        counter = counter-1;
        continue;
      }
      counter++;
    }
    return obj;
  };

  return obj;
})();
