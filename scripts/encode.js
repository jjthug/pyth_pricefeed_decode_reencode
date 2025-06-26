function encodePriceUpdate(header, priceUpdates) {
    const numUpdates = priceUpdates.length.toString(16).padStart(2, '0');
    const updatesHex = priceUpdates.join('');
    return header + numUpdates + updatesHex;
}
module.exports = { encodePriceUpdate };