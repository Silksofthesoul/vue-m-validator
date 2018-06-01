<template>
  <div class="todo-tracker" @click.stop.self.prevent="closeMe">
    <div class="row justify-content-sm-center" style="width:100%;">
      <div class="col-sm-4">
        <div class="card todo-tracker-modal">
          <h5 class="card-header">
            <div class="row">
              <div class="col-10 col-sm-10 col-md-10 col-lg-10 pt-2 text-left">Sign in / Sign up</div>
              <div class="col-2 col-sm-2 col-md-2 col-lg-2"><button type="button" class="btn btn-light" style="float: right;" @click="closeMe"><font-awesome-icon icon="times" /></button></div>
            </div>
          </h5>
          <ul class="nav nav-tabs mt-2 px-2" role="tablist">
            <li class="nav-item">
              <div
                class="nav-link"
                v-bind:class="{active: isLogin}"
                @click="setLogin"
                data-toggle="tab" role="tab">
                  Login
              </div>
            </li>
            <li class="nav-item">
              <div
                class="nav-link"
                v-bind:class="{active: isRegistration}"
                @click="setRegistration"
                data-toggle="tab"
                role="tab">
                  Registration
              </div>
            </li>
          </ul>
          <div class="tab-content">
            <transition name="fade-element">
              <div
                class="tab-pane fade"
                role="tabpanel"
                v-bind:class="{active: isLogin, show: isLogin}"
                v-if="isLogin">
                <div class="card-body">
                  <login-form></login-form>
                </div>
              </div>
            </transition>
            <transition name="fade-element">
              <div
                class="tab-pane fade"
                role="tabpanel"
                v-bind:class="{active: isRegistration, show: isRegistration}"
                v-if="isRegistration">
                  <div class="card-body">
                    <registration-form></registration-form>
                  </div>
                </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// -----styles:
import '@/assets/less/components/login-modal.less';

// -----vue components:
import LoginForm from '@/components/LoginModal/LoginForm';
import RegistrationForm from '@/components/LoginModal/RegistrationForm';

export default {
  name: 'LoginModal',
  data () {
    return {
      isLogin: true,
      isRegistration: false,
    };
  },
  methods: {
    closeMe () {
      this.$emit('close');
    },
    setLogin () {
      this.isLogin = true;
      this.isRegistration = false;
    },
    setRegistration () {
      this.isRegistration = true;
      this.isLogin = false;
    }
  },
  computed: { },
  components: {
    LoginForm,
    RegistrationForm
  }
};
</script>
