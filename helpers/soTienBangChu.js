const DIGIT_WORDS = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

function unitWord(unit, ten) {
  if (unit === 1 && ten >= 2) return "mốt";
  if (unit === 5 && ten >= 1) return "lăm";
  return DIGIT_WORDS[unit];
}

function readGroup3(n, isLeadingGroup) {
  const hundred = Math.floor(n / 100);
  const ten = Math.floor((n % 100) / 10);
  const unit = n % 10;
  const words = [];

  if (hundred > 0 || !isLeadingGroup) {
    words.push(`${DIGIT_WORDS[hundred]} trăm`);
  }

  if (ten === 0) {
    if (unit !== 0) {
      words.push(words.length > 0 ? `linh ${unitWord(unit, ten)}` : unitWord(unit, ten));
    }
  } else if (ten === 1) {
    words.push(unit !== 0 ? `mười ${unitWord(unit, ten)}` : "mười");
  } else {
    words.push(unit !== 0 ? `${DIGIT_WORDS[ten]} mươi ${unitWord(unit, ten)}` : `${DIGIT_WORDS[ten]} mươi`);
  }

  return words.join(" ");
}

function groupName(index) {
  const base = ["", "nghìn", "triệu"][index % 3];
  const tySuffix = " tỷ".repeat(Math.floor(index / 3));
  return `${base}${tySuffix}`.trim();
}

// Chuyển số nguyên không âm thành chữ tiếng Việt (dùng cho số tiền trên chứng từ).
module.exports.numberToVietnameseWords = (value) => {
  const num = Math.trunc(Math.abs(Number(value) || 0));
  if (num === 0) return "không";

  const groups = [];
  let remaining = num;
  while (remaining > 0) {
    groups.push(remaining % 1000);
    remaining = Math.floor(remaining / 1000);
  }

  const parts = [];
  let firstNonzeroFound = false;
  for (let i = groups.length - 1; i >= 0; i--) {
    const groupVal = groups[i];
    if (groupVal === 0) continue;

    const text = readGroup3(groupVal, !firstNonzeroFound);
    firstNonzeroFound = true;
    const name = groupName(i);
    parts.push(name ? `${text} ${name}` : text);
  }

  const sentence = parts.join(" ").replace(/\s+/g, " ").trim();
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
};

// Số tiền bằng chữ kèm đơn vị tiền tệ, ví dụ: "Ba trăm tám mươi sáu tỷ đồng"
module.exports.soTienBangChu = (value, currencySuffix = "đồng") => {
  const words = module.exports.numberToVietnameseWords(value);
  return `${words} ${currencySuffix}`.trim();
};
