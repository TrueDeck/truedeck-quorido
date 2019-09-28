import DApp from './DApp';
import { drizzleConnect } from "@drizzle/react-plugin";

const mapStateToProps = state => {
  return {
    state: state,
    accounts: state.accounts
  };
};

const DAppContainer = drizzleConnect(DApp, mapStateToProps);

export default DAppContainer;