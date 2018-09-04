const queryMultipleNodes = require('./dist/queryNodes').default;
/* list all the active bigchaindb nodes in the json below */
const nodesInNetwork = require('./bdb-active-nodes.json');
  
var assert = require('assert');
describe('query mulitple nodes', function() {
 
    it('should return confidence level of 100', function(done) {
        queryMultipleNodes("any data to search in bdb node", nodesInNetwork, 0, 0)
        .then((confidenceLevel) => {
            assert.equal(confidenceLevel, 100);
        })
        .finally(done);
    });

});
