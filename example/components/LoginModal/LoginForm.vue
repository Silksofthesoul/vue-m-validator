<template>
  <div>
    <serverSideValidation></serverSideValidation>
    <form class="text-left"  v-if="!isComplite">
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
          <ul>
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
          disabled>{{this.getLocalMsg('SGN_LABEL_LOGIN')}}</button>
        <button
          v-if="isEnabled"
          type="button"
          class="btn btn-primary"
          @click="login">{{this.getLocalMsg('SGN_LABEL_LOGIN')}}</button>
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

import serverSideValidation from '@/components/LoginModal/serverSideValidation';

export default {
  name: 'LoginForm',
  data () {
    return {
      isFirstRun: true,
      isComplite: false,
      email: '',
      password: '',
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
      /* eslint-disable-next-line */
      const RULE_3 = {
        expression: !(MAIL === 'ad@ad.ad'),
        name: 'email',
        msg: 'email rule3'
      };
      validator
        .addRule(RULE_1)
        .addRule(RULE_2);
      // .addRule(RULE_3);
      this.notFirst();
    },
    checkPassword (pass) {
      const RULE_1 = {
        expression: !pass || pass === '',
        name: 'pass',
        msg: this.getLocalMsg('SGN_VALIDATION_PASSREQ')
      };
      validator
        .addRule(RULE_1);
      this.notFirst();
    },
    formDataClean () {
      this.email = '';
      this.password = '';
    },
    checkForm () {
      this.checkMail(this.email);
      this.checkPassword(this.password);
    },
    showCompliteStatus (objMsg) {
      this.statusCompliteMsg = objMsg;
      this.isComplite = true;
    },
    sendData (sendDataObject) {
      ajax
        .request({
          address: 'https://rest/test_login',
          method: 'POST'
        })
        .complete((e) => {
          let responce = JSON.parse(e);
          if (responce.status === true) {
            this.formDataClean();
            this.showCompliteStatus({
              title: 'Login success',
              body: `Hello ${responce.data.username}!`,
              extra: 'Glad to see you!'
            });
          }
          this.$store.commit('LoginData/login', {
            login: responce.data.username,
            token: responce.api_token,
            lastLogin: responce.data.updated_at
          });
          this.$store.commit('UserData/updateLogin', {
            token: responce.api_token,
            lastLogin: responce.data.updated_at
          });
          // this.sync.synchronizationLocalToRemote(this.$store);
        })
        .error((e) => { console.log(e); })
        .send(sendDataObject);
    },

    login () {
      this.checkForm();
      if (this.validator.errors.length === 0) {
        this.sendData({
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
    }
  },
  components: {
    serverSideValidation
  }
};
</script>
