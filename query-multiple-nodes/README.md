# Query Multiple Nodes 

## Function

* This helper utility queries takes in array of active nodes and queries certain data from multiple BigchainDB nodes and verifies certain condition on that data. If that condition satisfies then, overall confidence level is incremented using the confidence level contribution from the node matching the condition, and new node is queried and tested similarly. This process continues till either required confidence level is achieved or all nodes have been queried. 


## Main components of this utility are -

#### bdb-active-nodes.json
* array of ip addresses for the active BigchainDB nodes in the given network.

#### queryMultipleNodes() in queryNodes.js
* queries multiple nodes calculating confidence level contributed by each queried node until required confidence level is reached or all nodes are queried (in that case if required confidence level is not reached then it returns confidence level calculated till now)

#### isFoundInNode() in queryNodes.js
* used for querying data from given node either using driver methods or mongo queries
* should return true/false depending on the condition tested on the fetched data
 
#### CONFIDENCE_NEEDED in queryNodes.js
* indicates the required confidence level from the given network.


## Installation & Usage

* execute `npm install` in the home directory.
* execute `npm test` to run given test indicating sample usage.