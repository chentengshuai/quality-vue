<template>
  <!--  <el-select-->
  <!--    v-model="innerValue"-->
  <!--    filterable-->
  <!--    remote-->
  <!--    reserve-keyword-->
  <!--    clearable-->
  <!--    placeholder="请输入关键词"-->
  <!--    :remote-method="remoteMethod"-->
  <!--    :loading="loading"-->
  <!--    @change="modelChange"-->
  <!--    @clear="clearSelect">-->
  <!--    <el-option-->
  <!--      v-for="item in options"-->
  <!--      :key="item.account"-->
  <!--      :label="item.label"-->
  <!--      :value="item.account">-->
  <!--    </el-option>-->
  <!--  </el-select>-->
  <el-input v-model="innerValue" @focus="onFocus" @keydown.native="onKeyDown">

  </el-input>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'dateInput',
  props: {
    value: {
      default: ''
    },
    defaultLogin: {
      default: false
    },
    valueFormat: {
      default: 'timestamp'
    }
  },
  data() {
    return {
      innerValue: '',
      isDateTime: true,
      regex: /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$/,
      currentPosStart: 0,
      currentPosEnd: 0,
      ctrl: {},
    }
  },
  watch: {
    value(val) {
      this.setModel();
    },
    innerValue(val) {
      if (this.valueFormat === 'timestamp') {
        this.$emit('input', new Date(this.innerValue).getTime());
      } else {
        this.$emit('input', this.innerValue)
      }
    },
  },
  mounted() {
    this.setModel();
  },
  methods: {
    setModel() {
      if (this.value) {
        this.transform(this.value, this.isDateTime)
      } else {
        this.innerValue = null;
      }
    },

    setValue(value) {
      this.innerValue = value;
      if (this.valueFormat === 'timestamp') {
        this.$emit('input', new Date(this.innerValue).getTime());
      } else {
        this.$emit('input', this.innerValue)
      }
    },

    onFocus(event) {
      console.log(event);
      this.ctrl = event.target;
      let text = this.ctrl.value;
      if (this.ctrl.readOnly || this.ctrl.disabled) {
        return;
      }
      if (!text) {
        const today = new Date();
        if (this.isDateTime) {
          text = this.dateFormat(today, 'yyyy-MM-dd hh:mm:ss').substring(0, 19).replace('T', ' ');
        } else {
          text = this.dateFormat(today, 'yyyy-MM-dd').substring(0, 10);
        }
        this.setValue(text);
        // this.setCaretPosition(0, 1);
      } else {
        this.getCaretPosition();
        if (this.currentPosEnd !== 1) {
          this.setCaretPosition(0, 1);
        }
      }
    },

    onKeyDown(event) {
      console.log(event);
      if (event.keyCode !== 9) {  //不屏蔽tab键
        event.preventDefault();
      }
      if (event.keyCode === 37 || event.keyCode === 39) {
        this.getCaretPosition();
        if (event.keyCode === 37) {
          this.setCaretPosition(this.currentPosStart - 1, this.currentPosEnd - 1);
        }
        if (event.keyCode === 39) {
          this.setCaretPosition(this.currentPosStart + 1, this.currentPosEnd + 1);
        }
        return;
      }
      // const text = element.val();
      let text = this.ctrl.value;
      if (!text) {
        const today = new Date();
        if (this.isDateTime) {
          text = this.dateFormat(today, 'yyyy-MM-dd hh:mm:ss').substring(0, 19).replace('T', ' ');
        } else {
          text = this.dateFormat(today, 'yyyy-MM-dd').substring(0, 10);
        }
        this.setValue(text);
        this.setCaretPosition(0, 1);
      }
      if (event.keyCode === 38 || event.keyCode === 40) {
        this.getCaretPosition();
        const oldDate = this.convertDateFromString(text);
        let oper = 0;
        if (event.keyCode === 38) {
          oper = 1;
        } else {
          oper = -1;
        }
        if (this.currentPosStart >= 0 && this.currentPosStart <= 3) {
          oldDate.setFullYear(oldDate.getFullYear() + oper);
        } else if (this.currentPosStart >= 5 && this.currentPosStart <= 6) {
          oldDate.setMonth(oldDate.getMonth() + oper);
        } else if (this.currentPosStart >= 8 && this.currentPosStart <= 9) {
          oldDate.setDate(oldDate.getDate() + oper);
        } else if (this.currentPosStart >= 11 && this.currentPosStart <= 12) {
          oldDate.setHours(oldDate.getHours() + oper);
        } else if (this.currentPosStart >= 14 && this.currentPosStart <= 15) {
          oldDate.setMinutes(oldDate.getMinutes() + oper);
        } else if (this.currentPosStart >= 17 && this.currentPosStart <= 18) {
          oldDate.setSeconds(oldDate.getSeconds() + oper);
        }
        this.setValue(this.dateFormat(oldDate, 'yyyy-MM-dd hh:mm:ss'));
        setTimeout(() => {
          this.setCaretPosition(this.currentPosStart, this.currentPosEnd);
        });

        return;
      }
      if (event.keyCode === 8) {
        return;
      }
      const code = String.fromCharCode((96 <= event.keyCode && event.keyCode <= 105) ? event.keyCode - 48 : event.keyCode);
      const codeNum = Number(code);
      if (isNaN(codeNum)) {
        return;
      }
      let textToBe1 = '';
      let textToBe2 = '';
      let textToBe = '';
      this.getCaretPosition();
      if (this.currentPosStart > 0) {
        textToBe1 = text.substr(0, this.currentPosStart);
      }
      if (this.currentPosEnd > 0) {
        textToBe2 = text.substr(this.currentPosEnd, text.length - this.currentPosEnd);
      }
      textToBe = textToBe1 + code + textToBe2;
      let match = this.regex.exec(textToBe);
      if (!match) {
        if (this.currentPosStart === 5 || this.currentPosStart === 8 || this.currentPosStart === 11
          || this.currentPosStart === 14 || this.currentPosStart === 17) {
          if (this.currentPosEnd > 0 && this.currentPosEnd < text.length) {
            textToBe2 = text.substr(this.currentPosEnd + 1, text.length - this.currentPosEnd - 1);
            textToBe = textToBe1 + code + '0' + textToBe2;
            match = this.regex.exec(textToBe);
            if (!match) {
              textToBe = textToBe1 + code + '1' + textToBe2;
              match = this.regex.exec(textToBe);
              if (!match) {
                return;
              }
            }
            this.setValue(textToBe);
          } else {
            return;
          }
        } else {
          return;
        }
      } else {
        const matchOrign = this.regex.exec(text);
        if (!matchOrign) {
          const thisDay = (text instanceof Date) ? text : Date.parse(text);
          if (thisDay != null && thisDay instanceof Date) {
            if (this.isDateTime) {
              text = this.dateFormat(thisDay, 'yyyy-MM-dd hh:mm:ss').substring(0, 19).replace('T', ' ');
            } else {
              text = this.dateFormat(thisDay, 'yyyy-MM-dd').substring(0, 10);
            }
            this.setValue(text);
            this.setCaretPosition(0, 1);
          }
        }
      }
      this.setValue(textToBe);
      setTimeout(() => {
        this.setCaretPosition(this.currentPosStart + 1, this.currentPosEnd + 1);
      })
    },

    getCaretPosition() {
      // if (!this.ctrl.setSelectionRange) {
      //   this.ctrl.focus();
      //   this.ctrl.setSelectionRange(-this.ctrl.value.length, -this.ctrl.value.length);
      //   // const sel = document.getSelection().setSelectionRange();
      //   // sel.moveStart ('character', -this.ctrl.value.length);
      //   this.currentPosStart = this.ctrl.text.length;
      //   // sel.moveEnd ('character', -this.ctrl.value.length);
      //   this.currentPosEnd = this.ctrl.text.length;
      // } else
      if (this.ctrl.selectionStart || this.ctrl.selectionStart === '0') {
        this.currentPosStart = this.ctrl.selectionStart;
        this.currentPosEnd = this.ctrl.selectionEnd;
      }
      if (this.currentPosStart === this.currentPosEnd) {
        this.currentPosEnd += 1;
      }
    },

    setCaretPosition(posStart, posEnd) {
      posStart = parseInt(posStart);
      posEnd = parseInt(posEnd);
      if (posStart < 0) {
        posStart = 0;
      }
      if (posStart >= this.ctrl.value.length) {
        posStart = this.ctrl.value.length - 1;
      }
      if (posEnd > this.ctrl.value.length) {
        posEnd = this.ctrl.value.length;
      }
      if (posEnd <= posStart) {
        posEnd = posStart + 1;
      }
      const str = this.ctrl.value.substr(posStart, 1);
      const num = Number(str);
      if (str == ' ' || isNaN(num)) {
        if (posStart > this.currentPosStart) {
          posStart += 1;
          posEnd += 1;
        } else if (posStart < this.currentPosStart) {
          posStart -= 1;
          posEnd -= 1;
        }

      }
      if (posStart == posEnd) {
        if (posStart > this.currentPosStart) {
          if (posStart >= this.ctrl.value.length) {
            posStart = this.ctrl.value.length - 1;
            posEnd = this.ctrl.value.length;
          } else {
            posEnd = posStart + 1;
          }
        } else {
          if (posStart == 0) {
            posStart = 0;
            posEnd = 1;
          } else {
            posEnd = posStart;
            posStart -= 1;
          }
        }
      }
      if (Math.abs(posEnd - posStart) > 1) {
        posStart = posEnd;
        posEnd += 1;
      }
      this.currentPosStart = posStart;
      this.currentPosEnd = posEnd;
      if (this.ctrl.setSelectionRange) {
        this.ctrl.focus();
        this.ctrl.setSelectionRange(posStart, posEnd);
      } else if (this.ctrl.createTextRange) {
        const range = this.ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', posEnd);
        range.moveStart('character', posStart);
        range.select();
      }
    },

    convertDateFromString(dateString) {
      if (dateString) {
        return new Date(dateString.replace(/-/g, '/'));
      }
    },

    transform(value, isDateTime) {
      if (!value) {
        return null;
      }
      let viewValue;
      const type = typeof (value);
      debugger;
      if (type === 'number') {
        const datee = new Date(value);
        viewValue = this.dateFormat(datee, 'yyyy-MM-dd hh:mm:ss').substring(0, 19).replace('T', ' ');
      } else if (!(value instanceof Date)) {
        if (value.indexOf('-') > 0) {
          this.innerValue = value;
          // this._renderer.setProperty(this._elementRef.nativeElement, 'value', value);
          return;
        } else {
          const year = value.substring(0, 4);
          const month = value.substring(4, 6);
          const day = value.substring(6, 8);
          const hour = value.substring(8, 10);
          const min = value.substring(10, 12);
          const sec = value.substring(12, 14);
          viewValue = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
        }
      } else {
        const yyyy = value.getFullYear();
        const mm = value.getMonth() < 9 ? '0' + (value.getMonth() + 1) : (value.getMonth() + 1);
        const dd = value.getDate() < 10 ? '0' + value.getDate() : value.getDate();
        const hh = value.getHours() < 10 ? '0' + value.getHours() : value.getHours();
        const min = value.getMinutes() < 10 ? '0' + value.getMinutes() : value.getMinutes();
        const ss = value.getSeconds() < 10 ? '0' + value.getSeconds() : value.getSeconds();
        viewValue = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + ss;
      }
      if (!isDateTime) {
        viewValue = value.toISOString().substring(0, 10);
      }
      this.innerValue = viewValue;
      // this._renderer.setProperty(this._elementRef.nativeElement, 'value', viewValue);
    },

    dateFormat(date, fmt) {
      const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds(), // 毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
      }
      return fmt;
    },
  }
}
</script>
