import React from 'react';
import { DrizzleProvider } from "@drizzle/react-plugin";

import DAppContainer from "./DAppContainer";
import drizzleOptions from "./drizzleOptions";

function App() {
  return (
    <DrizzleProvider options={drizzleOptions}>
      <DAppContainer />
    </DrizzleProvider>
  );
}

export default App;
