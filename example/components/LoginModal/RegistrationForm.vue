<template>
  <div>
    <form class="text-left" v-if="!isComplite">
      <ul class="form-group">
        <li
          v-for="(error, index) in validator.errors"
          v-bind:key="index">
          <small
            class="form-text text-muted"
            v-for="(msg, index) in error.msgs"
            v-bind:key="index">{{msg}}</small>
        </li>
      </ul>
      <div class="form-group">
        <label>{{this.getLocalMsg('SGN_LABEL_USERNAME')}}</label>
        <input
          type="text"
          class="form-control"
          v-bind:class="{'text-danger':isUsernameErrors,'is-invalid':isUsernameErrors}"
          v-model="username"
          :placeholder="this.getLocalMsg('SGN_PLACEHOLDER_USERNAME')"
          @blur="checkUsername(username)">
          <ul v-if="isUsernameErrors">
            <li
            class="form-text text-danger"
            v-for="(error, index) in validator.getErrors('username')"
            v-bind:key="index">
                &nbsp;{{ error }}
            </li>
          </ul>
      </div>
      <div class="form-group">
        <label>{{this.getLocalMsg('SGN_LABEL_EMAIL')}}</label>
        <input
          type="email"
          name="email"
          class="form-control"
          v-bind:class="{'text-danger':isMailErrors,'is-invalid':isMailErrors}"
          :placeholder="this.getLocalMsg('SGN_PLACEHOLDER_EMAIL')"
          v-model="email"
          @blur="checkMail(email)">
          <ul v-if="isMailErrors">
            <li
            class="form-text text-danger"
            v-for="(error, index) in validator.getErrors('email')"
            v-bind:key="index">
                &nbsp;{{ error }}
            </li>
          </ul>
      </div>
      <div class="form-group">
        <label>{{this.getLocalMsg('SGN_LABEL_PASS')}}</label>
        <input
          type="password"
          name="password"
          class="form-control"
          v-bind:class="{'text-danger':isPassErrors,'is-invalid':isPassErrors}"
          :placeholder="this.getLocalMsg('SGN_PLACEHOLDER_PASS')"
          v-model="password"
          @blur="checkPassword(password)">
      </div>
      <div class="form-group">
        <input
          type="password"
          class="form-control"
          :placeholder="this.getLocalMsg('SGN_PLACEHOLDER_PASS2')"
          v-model="password2"
          @blur="checkPassword(password, password2)">
        <small id="emailHelp" class="form-text text-muted">{{this.getLocalMsg('SGN_TEXT_PASSAGAIN')}}</small>
      <ul class="form-group">
        <li
        class="form-text text-danger"
        v-for="(error, index) in validator.getErrors('pass')"
        v-bind:key="index">
            &nbsp;{{ error }}
        </li>
      </ul>
    </div>
      <div class="form-group" >
        <button
          v-if="isDisabled"
          type="button"
          class="btn btn-primary"
          disabled>{{this.getLocalMsg('SGN_LABEL_REGST')}}</button>
        <button
          v-if="isEnabled"
          type="button"
          class="btn btn-primary"
          @click="register">{{this.getLocalMsg('SGN_LABEL_REGST')}}</button>
      </div>
    </form>
    <div class="statusWork" v-if="isComplite">
      <div class="soccess">
        <h5 class="card-title text-success">{{statusCompliteMsg.title}}</h5>
        <p class="card-text">{{statusCompliteMsg.body}}</p>
        <p class="card-text">{{statusCompliteMsg.extra}}</p>
      </div>

      <div class="error hide"></div>
    </div>
  </div>
</template>

<script>

import validator from 'vue-m-validator';

// -----libs:
import ajax from '@/library/ajax';

export default {
  name: 'RegistrationForm',
  data () {
    return {
      isFirstRun: true,
      isComplite: false,
      username: '',
      email: '',
      password: '',
      password2: '',
      statusCompliteMsg: {
        title: '',
        body: '',
        extra: ''
      },
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
        msg: this.getLocalMsg('SGN_VALIDATION_USERNAMEREQ')
      };
      /* eslint-disable-next-line */
      const RULE_2_REGEXP = new RegExp('^[a-zA-Z0-9_-]+$');
      const RULE_2 = {
        expression: !(RULE_2_REGEXP.test(USERNAME)),
        name: 'username',
        msg: this.getLocalMsg('SGN_VALIDATION_USERNAMEVALID')
      };
      const RULE_3 = {
        expression: USERNAME.length > 128,
        name: 'username',
        msg: this.getLocalMsg('SGN_VALIDATION_USERNAMELONG')
      };
      const RULE_4 = {
        expression: USERNAME.length < 3 && USERNAME.length !== 0,
        name: 'username',
        msg: this.getLocalMsg('SGN_VALIDATION_USERNAMESHORT')
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
        msg: this.getLocalMsg('SGN_VALIDATION_EMAILREQ')
      };
      /* eslint-disable-next-line */
      const RULE_2_REGEXP = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$');
      const RULE_2 = {
        expression: !(RULE_2_REGEXP.test(MAIL)),
        name: 'email',
        msg: this.getLocalMsg('SGN_VALIDATION_EMAILVALID')
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
        msg: this.getLocalMsg('SGN_VALIDATION_PASSREQ')
      };
      const RULE_2 = {
        expression: pass !== pass2,
        name: 'pass',
        msg: this.getLocalMsg('SGN_VALIDATION_PASSMATCH')
      };
      validator
        .addRule(RULE_1)
        .addRule(RULE_2);
      this.notFirst();
    },
    formDataClean () {
      this.username = '';
      this.email = '';
      this.password = '';
      this.password2 = '';
    },
    checkForm () {
      this.checkUsername(this.username);
      this.checkMail(this.email);
      this.checkPassword(this.password, this.password2);
    },
    showCompliteStatus (objMsg) {
      this.statusCompliteMsg = objMsg;
      this.isComplite = true;
    },
    sendData (sendDataObject) {
      ajax
        .request({
          address: 'http://rest/test_registration',
          method: 'POST'
        })
        .complete((e) => {
          let responce = JSON.parse(e);
          if (responce.status === true) {
            this.formDataClean();
            this.showCompliteStatus({
              title: 'Registration success',
              body: 'You can login now ^_^',
              extra: 'Good luck!'
            });
          }
          // console.log(e, responce);
        })
        .error((e) => { console.log(e); })
        .send(sendDataObject);
    },
    register () {
      this.checkForm();
      if (this.validator.errors.length === 0) {
        this.sendData({
          'username': this.username,
          'email': this.email,
          'password': this.password
        });
      }
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
  components: {  }
};
</script>
