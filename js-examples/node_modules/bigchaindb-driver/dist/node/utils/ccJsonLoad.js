'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = ccJsonLoad;

var _buffer = require('buffer');

var _bs = require('bs58');

var _bs2 = _interopRequireDefault(_bs);

var _cryptoConditions = require('crypto-conditions');

var _cryptoConditions2 = _interopRequireDefault(_cryptoConditions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Loads a crypto-condition class (Fulfillment or Condition) from a BigchainDB JSON object
 * @param {Object} conditionJson
 * @returns {cc.Condition} Ed25519 Condition (that will need to wrapped in an Output)
 */
function ccJsonLoad(conditionJson) {
    if ('hash' in conditionJson) {
        var condition = new _cryptoConditions2.default.Condition();
        condition.type = conditionJson.type_id;
        condition.bitmask = conditionJson.bitmask;
        condition.hash = _buffer.Buffer.from(_bs2.default.decode(conditionJson.hash));
        condition.maxFulfillmentLength = parseInt(conditionJson.max_fulfillment_length, 10);
        return condition;
    } else {
        var fulfillment = void 0;

        if (conditionJson.type === 'threshold-sha-256') {
            fulfillment = new _cryptoConditions2.default.ThresholdSha256();
            fulfillment.threshold = conditionJson.threshold;
            conditionJson.subconditions.forEach(function (subconditionJson) {
                var subcondition = ccJsonLoad(subconditionJson);
                if ('getConditionUri' in subcondition) {
                    fulfillment.addSubfulfillment(subcondition);
                } else if ('serializeUri' in subcondition) {
                    fulfillment.addSubcondition(subcondition);
                }
            });
        }

        if (conditionJson.type === 'ed25519-sha-256') {
            fulfillment = new _cryptoConditions2.default.Ed25519Sha256();
            fulfillment.publicKey = _buffer.Buffer.from(_bs2.default.decode(conditionJson.public_key));
        }
        return fulfillment;
    }
}