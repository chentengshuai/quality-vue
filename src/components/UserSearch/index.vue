<template>
  <el-select
    v-model="innerValue"
    filterable
    remote
    reserve-keyword
    clearable
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
    :disabled="defaultDisabled"
    @change="modelChange"
    @clear="clearSelect">
    <el-option
      v-for="item in options"
      :key="item.account"
      :label="item.label"
      :value="item.account">
    </el-option>
  </el-select>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'userSearch',
  props: {
    value: {
      default: ''
    },
    name: {
      default: ''
    },
    defaultLogin: {
      default: false
    }, defaultDisabled: {
      default: false
    }
  },
  data() {
    return {
      options: [],
      innerValue: '',
      innerName: '',
      clearMark: false,
      loading: false,
    }
  },
  watch: {
    value(val) {
      this.setModel();
    },
    innerValue(val) {
      this.$emit('input', this.innerValue)
    },
    innerName() {
      this.$emit('name', this.innerName)
    }
  },
  mounted() {
    this.setModel();
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        request({
          url: `/api/permission/Users/userInfoByKeyword`,
          method: 'post',
          params: {
            keyword: query
          }
        }).then(res => {
          this.loading = false;
          const tmpArr = res.data;
          tmpArr.forEach(x => {
            x.label = x.account + "(" + x.realName + ")";
          })
          this.options = tmpArr;
        });
      } else {
        this.options = [];
      }
    },
    setModel() {
      if (this.innerValue !== this.value) {
        this.innerValue = this.value;
        if (this.value) {
          this.options = [{account: this.value, label: this.value + "(" + this.name + ")"}];
        } else {
          this.innerName = null;
          const tmpInnerValue = this.$store.getters.userInfo.userAccount;
          const tmpInnerName = this.$store.getters.userInfo.userName;
          this.options = [{
            account: tmpInnerValue,
            label: tmpInnerValue + "(" + tmpInnerName + ")",
            realName: tmpInnerName
          }];
          if (this.defaultLogin) {
            this.innerValue = tmpInnerValue;
            this.innerName = tmpInnerName;
            this.$emit('input', this.innerValue)
            this.$emit('name', this.innerName)
          }
        }
      } else if (!this.value) {
        const tmpInnerValue = this.$store.getters.userInfo.userAccount;
        const tmpInnerName = this.$store.getters.userInfo.userName;
        this.options = [{
          account: tmpInnerValue,
          label: tmpInnerValue + "(" + tmpInnerName + ")",
          realName: tmpInnerName
        }];
        if (this.defaultLogin && !this.clearMark) {
          this.innerValue = tmpInnerValue;
          this.innerName = tmpInnerName;
          this.$emit('input', this.innerValue);
          this.$emit('name', this.innerName)
        }
      }
    },
    modelChange() {
      this.options.forEach(x => {
        if (x.account === this.innerValue) {
          this.innerName = x.realName;
        }
      })
    },
    clearSelect() {
      this.innerName = null;
      this.innerValue = null;
      this.clearMark = true;
    }
  }
}
</script>
