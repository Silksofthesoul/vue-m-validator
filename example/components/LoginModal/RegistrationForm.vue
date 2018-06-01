<template>
  <form class="text-left">
    <ul class="form-group">
      <li
        v-for="error in validator.errors">
        <small
          class="form-text text-muted"
          v-for="msg in error.msgs">{{msg}}</small>
      </li>
    </ul>
    <div class="form-group">
      <label>Username</label>
      <input
        type="text"
        class="form-control"
        v-bind:class="{'text-danger':isUsernameErrors,'is-invalid':isUsernameErrors}"
        v-model="username"
        placeholder="Enter username"
        @blur="checkUsername(username)">
        <ul v-if="isUsernameErrors">
          <li
          class="form-text text-danger"
          v-for="error in validator.getErrors('username')">
              &nbsp;{{ error }}
          </li>
        </ul>
    </div>
    <div class="form-group">
      <label>Email address</label>
      <input
        type="email"
        name="email"
        class="form-control"
        v-bind:class="{'text-danger':isMailErrors,'is-invalid':isMailErrors}"
        placeholder="Enter email"
        v-model="email"
        @blur="checkMail(email)">
        <ul v-if="isMailErrors">
          <li
          class="form-text text-danger"
          v-for="error in validator.getErrors('email')">
              &nbsp;{{ error }}
          </li>
        </ul>
    </div>
    <div class="form-group">
      <label>Password</label>
      <input
        type="password"
        name="password"
        class="form-control"
        v-bind:class="{'text-danger':isPassErrors,'is-invalid':isPassErrors}"
        placeholder="Password"
        v-model="password"
        @blur="checkPassword(password)">
    </div>
    <div class="form-group">
      <input
        type="password"
        class="form-control"
        placeholder="Password again"
        v-model="password2"
        @blur="checkPassword(password, password2)">
      <small id="emailHelp" class="form-text text-muted">Type password again</small>
        <li
        class="form-text text-danger"
        v-for="error in validator.getErrors('pass')">
            &nbsp;{{ error }}
        </li>
      </ul>
    </div>
    <div class="form-group" >
      <button
        v-if="isDisabled"
        type="button"
        class="btn btn-primary"
        disabled>Registration</button>
      <button
        v-if="isEnabled"
        type="button"
        class="btn btn-primary"
        @click="register">Registration</button>
    </div>
  </form>
</template>

<script>
import validator from 'vue-data-validator';

export default {
  name: 'RegistrationForm',
  data () {
    return {
      isFirstRun: true,
      username: '',
      email: '',
      password: '',
      password2: '',
      validator: validator
    };
  },
  created () {
    validator.reset();
  },
  methods: {
    notFirst () {
      this.isFirstRun = false;
    },
    checkUsername (_username) {
      const USERNAME = _username.trim();
      const RULE_1 = {
        expression: !USERNAME || USERNAME === '',
        name: 'username',
        msg: 'username field required'
      };
      const RULE_2 = {
        expression: /[\d\-\+\\\.\,\/\(\)\*\&\^\%\$\#\@\!\~\?\{\}\;\:\<\>\|]/.test(USERNAME),
        name: 'username',
        msg: 'username is not valid'
      };
      const RULE_3 = {
        expression: USERNAME.length > 128,
        name: 'username',
        msg: 'username is too long'
      };
      const RULE_4 = {
        expression: USERNAME.length < 3 && USERNAME.length !== 0,
        name: 'username',
        msg: 'username is too short'
      };

      validator
        .addRule(RULE_1)
        .addRule(RULE_2)
        .addRule(RULE_3)
        .addRule(RULE_4);
      this.notFirst();
    },

    checkMail (_mail) {
      const MAIL = _mail.trim();
      const RULE_1 = {
        expression: !MAIL || MAIL === '',
        name: 'email',
        msg: 'email field required'
      };
      const RULE_2 = {
        expression: !(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(MAIL)),
        name: 'email',
        msg: 'email is not valid'
      };

      validator
        .addRule(RULE_1)
        .addRule(RULE_2);
      this.notFirst();
    },
    checkPassword (pass, pass2) {
      const RULE_1 = {
        expression: !pass || pass === '',
        name: 'pass',
        msg: 'pass field required'
      };
      const RULE_2 = {
        expression: pass !== pass2,
        name: 'pass',
        msg: 'Passwords do not match'
      };
      validator
        .addRule(RULE_1)
        .addRule(RULE_2);
      this.notFirst();
    },
    checkForm () {
      this.checkUsername(this.username);
      this.checkMail(this.email);
      this.checkPassword(this.password, this.password2);
    },
    register () {
      this.checkForm();
      console.log('registration');
    }
  },
  computed: {
    isDisabled () {
      return this.isFirstRun === true || this.validator.errors.length > 0;
    },
    isEnabled () {
      return this.isFirstRun === false && this.validator.errors.length === 0;
    },
    isMailErrors () {
      let errors = this.validator.getErrors('email');
      return errors && errors.length > 0;
    },
    isPassErrors () {
      let errors = this.validator.getErrors('pass');
      return errors && errors.length > 0;
    },
    isUsernameErrors () {
      let errors = this.validator.getErrors('username');
      return errors && errors.length > 0;
    }
  },
  components: { }
};
</script>
