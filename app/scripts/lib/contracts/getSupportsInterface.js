it('Get multihash', async () => {
    const hash =  await getMultiHash(DOMAIN);
    console.log('multiHash: ', hash);
    if (hash != '0x') {
        // Decode multiHash
        let hex = hash.substring(2)
        let buf = multihash.fromHexString(hex);
        const res = multihash.toB58String(buf);
        console.log('Decoded hash: ', res);
    }
});

it('Get supportsInterface', async () => {
    const res =  await getSupportsInterface('0xe89401a1');
    console.log('support: ', res);
});

/**
 * @param {*} name 
 */
export const getMultiHash = async (name) => {
    try {
      setWeb3Provider();
      const hash = await resolver.multihash(namehash.hash(name));
      return hash;
    } catch (err) {
      console.log('getMultiHash: ', name, err);
      return 'getMultiHash not found';
    }
  }
  
  /**
   * 
   * @param {*} support 
   */
  export const getSupportsInterface = async (support) => {
    try {
      setWeb3Provider();
      const content = await resolver.supportsInterface(support);
      return content;
    } catch (err) {
      console.log('getSupportsInterface: ', support, err);
      return 'getSupportsInterface not found';
    }
  }


/**
 * 
 * @param {*} name 
 * @param {*} callback 
 */
Resolver.prototype.multihash = function(name, callback) {
    return this.resolverPromise.then(function(resolver) {
      return resolver.multihashAsync(name);
    })
  }
  
/**
 * 
 * @param {*} name 
 * @param {*} callback 
 */
Resolver.prototype.supportsInterface = function(support, callback) {
    return this.resolverPromise.then(function(resolver) {
      return resolver.supportsInterfaceAsync(support);
    })
}




function Resolver(web3, address) {
    this.web3 = web3;
    const resolverContract = web3.eth.contract(abi);
    this.resolverPromise = Promise.resolve(Promise.promisifyAll(resolverContract.at(address)));
}