# Query Multiple Nodes 

## Function

This example shows how to query multiple nodes in a BigchainDB network for a particular asset. Based on the response from all the nodes, the final confidence level of the network is calculated. The response is returned with the data and the confidence level. This is primarily helpful when the end-users are not directly hosting their own node but are querying remote nodes in a network. With this approach, they can query multiple remote nodes.

## Components

#### bdb-active-nodes.json

Array of ip addresses for the active BigchainDB nodes in the given network.

#### queryMultipleNodes() in queryNodes.js

This function queries multiple nodes calculating confidence level contributed by each node until required confidence level is reached or all nodes are queried.

#### isFoundInNode() in queryNodes.js

Used for querying data from given node either using driver methods or mongo queries. Should return true/false depending on the condition tested on the fetched data.
 
#### CONFIDENCE_NEEDED in queryNodes.js

Indicates the required confidence level from the given network.

## Installation & Usage

* execute `npm install` in the home directory.
* execute `npm test` to run given test indicating sample usage.

Can be used in existing applications as a reusable code library.
