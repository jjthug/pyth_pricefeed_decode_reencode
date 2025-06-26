function getStringBytes(str, offset, len) {
  return str.substring(offset * 2, (offset + len) * 2);
}

function extractPriceUpdate(payload, offset) {
  let msg_size = getStringBytes(payload, offset, 2);
  msg_size = parseInt(msg_size, 16);

  offset += 2;
  offset += msg_size;

  let proofSize = getStringBytes(payload, offset, 1);
  proofSize = parseInt(proofSize, 16);

  offset += 1;
  offset += proofSize * 20;

  return offset;
}

const MAGIC = "504e4155";
const MAJOR = "01";
const MINOR = "00";

function extractValuesFromUpdatePayload(payload) {
  let offset = 0;

  let magic = getStringBytes(payload, offset, 4);
  if (magic !== MAGIC) throw "Wrong magic";
  offset += 4;

  let major = getStringBytes(payload, offset, 1);
  if (major !== MAJOR) throw "Wrong major";
  offset += 1;

  let minor = getStringBytes(payload, offset, 1);
  if (minor !== MINOR) throw "Wrong minor";
  offset += 1;

  let trailing_header_size = getStringBytes(payload, offset, 1);
  trailing_header_size = parseInt(trailing_header_size, 16);
  offset += 1;
  offset += trailing_header_size;

  offset += 1; // extra

  let msg_size = getStringBytes(payload, offset, 2);
  msg_size = parseInt(msg_size, 16);
  offset += 2;
  offset += msg_size;

  const header = getStringBytes(payload, 0, offset);

  let numUpdates = getStringBytes(payload, offset, 1);
  numUpdates = parseInt(numUpdates, 16);
  offset += 1;

  const priceUpdates = [];
  for (let i = 0; i < numUpdates; i++) {
    const startOffset = offset;
    offset = extractPriceUpdate(payload, offset);
    const segmentLength = offset - startOffset;
    priceUpdates.push(getStringBytes(payload, startOffset, segmentLength));
  }

  return { header, priceUpdates };
}

module.exports = { extractValuesFromUpdatePayload };