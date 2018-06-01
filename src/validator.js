import array from '@/library/array';
export default (() => {
  let obj = {};
  obj.errors = [ ];

  obj.init = () => {
    obj.errors = [];
  };
  obj.reset = () => {
    obj.errors = [];
  };

  obj.get = (name) => {
    // let returnItem = {};
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
    let index = object && object.hasOwnProperty('index') ? object.index : undefined;
    if (item !== undefined) {
      array.deleteItemArrByElement(arg.msg, item.msgs);
    }
    obj.emptyCheck();
  };

  return obj;
})();
