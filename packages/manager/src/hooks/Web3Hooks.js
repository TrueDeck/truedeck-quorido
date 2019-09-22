function useContract(dAppContext, name) {
//  const [ contract, setContract ] = useState({});
//
//  useEffect(() => {
    if (dAppContext.networkId) {
      const jsonInterface = require(`@contracts/${name}.json`);
      if (jsonInterface.networks) {
        const deployedNetwork = jsonInterface.networks[dAppContext.networkId];
        if (deployedNetwork && deployedNetwork.address) {
          const c = new dAppContext.lib.eth.Contract(jsonInterface.abi, deployedNetwork.address);
          return c;
//          setContract(c);
        }
      }
    }
//  }, [dAppContext, dAppContext.accounts, dAppContext.networkId]);
//  return contract;
}

export { useContract };