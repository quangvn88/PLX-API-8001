const WRONG = "Name or password is incorrect (repeat logon)";
const WRONG_TEXT = "Tài khoản hoặc mật khẩu không chính xác";

const WRONG_MANY =
  "Password logon no longer possible - too many failed attempts";
const WRONG_MANY_TEXT = "Tài khoản bị khoá vì nhập sai mật khẩu quá nhiều";

const LOCKED = "User is locked. Please notify the person responsible";
const LOCKED_TEXT = "Tài khoản của bạn đã bị khoá";

const NOT_AUTH = "Not auth use app";
const NOT_AUTH_TEXT = "Tài khoản chưa được phân quyền sử dụng";

module.exports.sapMessage = (text) => {
  switch (text) {
    case WRONG: {
      return WRONG_TEXT;
    }
    case WRONG_MANY: {
      return WRONG_MANY_TEXT;
    }
    case LOCKED: {
      return LOCKED_TEXT;
    }
    case NOT_AUTH: {
      return NOT_AUTH_TEXT;
    }
    default: {
      return text;
    }
  }
};

module.exports.sapMessageErr = (err) => {
  const messageError = err.message;
  if (messageError.includes("401")) {
    return 'Tài khoản đã đổi mật khẩu'
  } else {
    return 'Lỗi API'
  }
}
