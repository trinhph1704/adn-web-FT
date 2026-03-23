import type { Rule, RuleObject } from "antd/es/form";
import type { StoreValue } from "antd/es/form/interface";

// Quy tắc xác thực cho trường họ tên
export const fullNameRules: Rule[] = [
  { required: true, message: "Vui lòng nhập họ tên" },
  { min: 2, message: "Họ tên phải có ít nhất 2 ký tự" },
];

// Quy tắc xác thực cho trường email
export const emailRules: Rule[] = [
  { required: true, message: "Vui lòng nhập email" },
  { type: "email", message: "Email không hợp lệ" },
];

// Quy tắc xác thực cho trường số điện thoại
export const phoneRules: Rule[] = [
  { required: true, message: "Vui lòng nhập số điện thoại" },
  {
    pattern: /^(0|\+84)[3|5|7|8|9][0-9]{8}$/,
    message:
      "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng số điện thoại Việt Nam",
  },
];

// Quy tắc xác thực cho trường địa chỉ
export const addressRules: Rule[] = [
  { required: true, message: "Vui lòng nhập địa chỉ" },
  { min: 5, message: "Địa chỉ phải có ít nhất 5 ký tự" },
  {
    validator: async (_: RuleObject, value: string) => {
      if (value && value.trim()) {
        const commaCount = (value.match(/,/g) || []).length;
        if (commaCount < 1) {
          throw new Error('Vui lòng chọn tỉnh/thành phố và nhập địa chỉ chi tiết');
        }
      }
    },
  },
];

// Quy tắc xác thực cho trường mật khẩu
export const passwordRules: Rule[] = [
  { required: true, message: "Vui lòng nhập mật khẩu" },
  {
    pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
    message: "Mật khẩu phải có ít nhất 6 ký tự và bao gồm cả chữ cái và số",
  },
];

// Hàm tạo quy tắc xác thực cho trường xác nhận mật khẩu
export const createConfirmPasswordValidator = (
  getFieldValue: (field: string) => StoreValue
): Rule => ({
  validator: (_: RuleObject, value: string) => {
    if (!value) {
      return Promise.reject("Vui lòng xác nhận mật khẩu");
    }
    if (value !== getFieldValue("PasswordHash")) {
      return Promise.reject("Mật khẩu không khớp");
    }
    return Promise.resolve();
  },
});

// Quy tắc xác thực cho việc chấp nhận điều khoản
export const termsValidator: Rule = {
  validator: (_: RuleObject, value: boolean) =>
    value
      ? Promise.resolve()
      : Promise.reject("Vui lòng đồng ý với điều khoản dịch vụ"),
};