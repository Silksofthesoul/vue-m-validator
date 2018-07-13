# vue-m-validator

Data Validation Library, for VueJs. Perhaps useful for other libraries/frameworks and other projects, but i created this library and using with VueJs with reactive data.

![Example with form](example/screen.png "Example with form")

## Installation
```Commandline
npm install --save vue-m-validator
```

## Use case
[example with components](https://github.com/Silksofthesoul/vue-m-validator/tree/master/example)
* Required the library to your project
```Javascript
import validator from 'vue-m-validator';
```

* Make library is reactive
```Javascript
data () {
    return {
      isFirstRun: true,
      username: '',
      email: '',
      password: '',
      password2: '',
      validator: validator
    };
}
```

* If you use many forms on page in a different components, write the hook
```Javascript
  created () {
    validator.reset();
  }
```

* And validate a form
```Javascript
  validator
    .addRule(RULE_1)
    .addRule(RULE_2)
    .addRule(RULE_N);
```
for the 'addRule' method, you should use as an argument the object that should have the following look:
```Javascript
  validator.addRule({
    expression: !USERNAME || USERNAME === ' ',
    name: 'username',
    msg: 'username field required'
  });
```


* To manually add an error, use the 'addError'
```Javascript
  validator.addError({
    expression: false,
    name: 'test',
    msg: 'FatAl err0r'
  });
```

* To manually remove the error, use the 'deleteError'
```Javascript
  validator.deleteError({
    name: 'test',
    msg: 'FatAl err0r'
  });
```

* To manually delete all messages united by the same name, use the 'deleteAllErrorByName'
```Javascript
  validator.deleteAllErrorByName('test');
```


* To perform server-side validation, try the following (additional in 1.1.0 version):
```Javascript
validator
  .addRule(RULE_1)
  .serverCheck({
    address: 'http://server/validation',
    method: 'POST',
    data: {
      name: 'test', // required parameter
      myKey: _mail
      // myKey - you can call it
      // anything and add more data,
      // for your own purposes
    },
    success: (responce) => {
      // in fact, in this callback function,
      // you can write anything. This is just an example.
      responce = JSON.parse(responce);
      if (!responce.status) {
        if (responce.errors.length === 0) {
          validator.addError({
            expression: false,
            name: 'test',
            msg: 'Unknown server error. Sorry Bro...'
          });
        } else {
          responce.errors.forEach((item, i, arr) => {
            validator.addError({
              expression: false,
              name: 'test',
              msg: item
            });
          });
        }
      } else {
        // after client verification and server-side
        // verification, if the status is returned
        // 'true', we can delete all error messages with
        // the 'name' property specified in the data to
        // be transmitted to the server.
        validator.deleteAllErrorByName('test');
      }
    },
    error: (responce) => {
      console.log('Server Error', responce);
    }
  });
```
[_see example_](https://github.com/Silksofthesoul/vue-m-validator/tree/master/example/components/LoginModal/serverSideValidation.vue)  

  When I was making an example, I used such a php code on the server side (just an example):
```PHP
  <?php
    Route::post("/validation",function(){
      header("Access-Control-Allow-Origin: *");
      header("Content-type: application/json");
      $response = [];
      $errors = [];

      if($_POST["myKey"] === ""){
        $response["status"] = false;
        $errors[] = "FROM SERVER error 0";
      }

      if($_POST["myKey"] !== "hello world"){
        $response["status"] = false;
        $errors[] = "FROM SERVER error 1";
      }
      if(count($errors)==0){
        $response["status"] = true;
      }

      $response["name"] = $_POST["name"];
      $response["errors"] = $errors;

      echo json_encode($response);
    });

  ?>
```
[_see example_](https://github.com/Silksofthesoul/vue-m-validator/tree/master/example/server-side-example/validation_get.php)

* In a templates you should use `v-model` for data and validate form data with functions
```HTML
<input
    type="text"
    v-model="username"
    @blur="checkUsername(username)">
<button
    @click="register">Registration</button>
```

* For showing all validation errors you can access the library object property 'errors'
```HTML
<ul class="form-group">
  <li
    v-for="error in validator.errors">
      <small
        class="form-text text-muted"
        v-for="msg in error.msgs">
          {{msg}}
      </small>
  </li>
</ul>
```

* To display one group message, use method 'getErrors(name)'
```HTML
<ul v-if="isUsernameErrors">
  <li
    class="form-text text-danger"
    v-for="error in validator.getErrors('username')">
      &nbsp;{{ error }}
  </li>
</ul>
```
