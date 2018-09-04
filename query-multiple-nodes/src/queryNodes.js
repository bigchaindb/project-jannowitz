 
 
   /**
     * since BigchainDB uses BFT based consensus, network reaches consensus as long as 2/3 of 
     * nodes have same state. So, we have selected 67% as confidence level needed. But, any 
     * value can be chosen and algorithm below will work same.
     * **/
    let CONFIDENCE_NEEDED = 100; 
 
    
    /**
     * search mulitple nodes for given data and calculate consensus in network.
     * Returns if required confidence level is reached
     * @param {object} dataToSearch - data to search in nodes
     * @param {array} nodesInNetwork - no. of active nodes in bigchaindb network 
     * @param {number} currentConfidence - (optional) current confidence level of address found
     * across network
     * @param {number} confidenceLevelPerNode - (optional) confidence level of each node in a network
     */
     const queryMultipleNodes = async (dataToSearch, nodesInNetwork, currentConfidence = 0, confidenceLevelPerNode = 0) => {
        
        if(confidenceLevelPerNode === 0){
            //how much confidence level each node can contribute
            confidenceLevelPerNode = Math.ceil(100/nodesInNetwork.length);
        }
    
        //if all nodes have been queried, respond
        if(nodesInNetwork.length == 0){
            return currentConfidence;
        }
            
        //how much confidence level we still require
        let confidenceLevelStillNeeded = CONFIDENCE_NEEDED - currentConfidence;
    
        //calculate count of nodes that fulfils our CONFIDENCE_NEEDED requirement
        let totalNodesNeededForConfidence = Math.ceil(confidenceLevelStillNeeded / confidenceLevelPerNode);
        
        //search address in needed nodes
        let listOfNodesNeeded = nodesInNetwork.slice(0, totalNodesNeededForConfidence)
       
        //remove already queried nodes
        nodesInNetwork = nodesInNetwork.slice(totalNodesNeededForConfidence);
    
        await Promise.all(listOfNodesNeeded.map(async (nodeAddress) => {
            let exists = await isFoundInNode(dataToSearch, nodeAddress);
            //if given data exists in this node, increment our confidence level
            //for this search
            if(exists){
                currentConfidence += confidenceLevelPerNode;
                console.log(`${nodeAddress} contributed ${confidenceLevelPerNode} to overall confidence.`);
                console.log(`Now, total confidence is ${currentConfidence}.`);

            }
        }));
    
        if(currentConfidence >= CONFIDENCE_NEEDED){
            return currentConfidence;
        }
        else {
            //recurse if confidence level is below confidenceNeeded to query remaining nodes
            queryMultipleNodes(dataToSearch, nodesInNetwork, currentConfidence, confidenceLevelPerNode);
        }
    }

    /**
    * search for a given data/condition in BigchainDB node
    * @param {object} dataToSearch data to search in given node
    * @returns {boolean} true if data is found else false
    */
    const isFoundInNode = async (data, nodeAddress) => {
    /*
    the whole idea for this function is to take any data stored in 
    bigchaindb node for any given node (indicated here by nodeAddress param)
    and perform some calculations on the result and return true if condition
    matches or else false

    Data could be transaction id, asset data or subset of assetdata, metadata etc.

    This function is also ideal candidate to fetch data from BigchainDB using driver 
    methods like searchAssets, getTransactionById etc. or preferably using mongo queries
    as shown in this gist - 
    https://github.com/manolodewiner/query-mongodb-bigchaindb/blob/master/queryMongo.js
    */
    
    return true;
}

export default queryMultipleNodes;