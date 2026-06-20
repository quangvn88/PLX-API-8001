const crypto = require("crypto");

const TICKS_AT_UNIX_EPOCH = 621355968000000000n;
const TICKS_PER_MILLISECOND = 10000n;

function getUtcNowTicks() {
  return (
    BigInt(Date.now()) * TICKS_PER_MILLISECOND +
    TICKS_AT_UNIX_EPOCH
  ).toString();
}

function generateHmacSha512Result(secretKey, data, nonce = getUtcNowTicks()) {
  if (!secretKey) {
    throw new Error("SecretKey is empty!");
  }

  if (!data) {
    throw new Error("Data is empty!");
  }

  const message = data + nonce;
  const signature = crypto
    .createHmac("sha512", Buffer.from(secretKey, "utf8"))
    .update(Buffer.from(message, "utf8"))
    .digest("hex")
    .toUpperCase();

  return {
    data,
    nonce,
    signature,
    text: `Data: ${data}\nX-Nonce: ${nonce}\nX-Signature: ${signature}`,
  };
}

function parseArgs(argv) {
  const result = {};

  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    const next = argv[index + 1];

    if (current === "--secretKey") {
      result.secretKey = next;
      index += 1;
    } else if (current === "--data") {
      result.data = next;
      index += 1;
    } else if (current === "--nonce") {
      result.nonce = next;
      index += 1;
    }
  }

  return result;
}

if (require.main === module) {
  try {
    const args = parseArgs(process.argv.slice(2));
    const output = generateHmacSha512Result(
      args.secretKey,
      args.data,
      args.nonce,
    );

    console.log(output.text);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  HMAC_SHA512: generateHmacSha512Result,
  generateHmacSha512Result,
  getUtcNowTicks,
};
