import { drizzleConnect } from "@drizzle/react-plugin"

import Admin from "@components/Admin"

const mapStateToProps = state => {
  return {
    state: state,
    accounts: state.accounts,
  }
}

const AdminContainer = drizzleConnect(Admin, mapStateToProps)

export default AdminContainer
