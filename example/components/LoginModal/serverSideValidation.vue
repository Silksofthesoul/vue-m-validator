<template>
  <div>
    <form action="">
      <input type="text" v-model="email">
      <button type="button" @click="run">ok</button>
    </form>
    [{{email}}]
    <ul v-if="isErrors">
      <li
      class="form-text text-danger"
      v-for="(error, index) in validator.getErrors('test')"
      v-bind:key="index">
          &nbsp;{{ error }}
      </li>
    </ul>
  </div>
</template>

<script>

import validator from 'vue-m-validator';

// -----libs:
export default {
  name: 'serverSideValidation',
  data () {
    return {
      validator: validator,
      email: ''
    };
  },
  created () {
    validator.reset();
  },
  methods: {
    check (_mail) {
      const MAIL = _mail ? _mail.trim() : undefined;
      const RULE_1 = {
        expression: !MAIL || MAIL === '',
        name: 'test',
        msg: 'Error'
      };
      const RULE_2 = {
        expression: _mail,
        name: 'test',
        msg: 'Error'
      };
      validator
        .addRule(RULE_1)
        .serverCheck({
          address: 'http://servername/validation',
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
          error: (responce) => { console.log('Server Error', responce); }
        });
    },

    run () {
      this.check(this.email);
      if (this.validator.errors.length === 0) {
        console.log('all is fine!');
      }
    }
  },
  computed: {
    isErrors () {
      let errors = this.validator.getErrors('test');
      return errors && errors.length > 0;
    }
  },
  components: {}
};
</script>
