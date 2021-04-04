import { Web3Provider } from "@ethersproject/providers";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Web3ReactProvider } from "@web3-react/core";
import Home from "./components/Home";
import Canvas from "./components/canvas";
import "./App.css";

const App = () => {
  return (
    <Web3ReactProvider
      getLibrary={(provider, connector) => new Web3Provider(provider)}
    >
      <Router>
        <Switch>
      <Route exact path="/" component={Home}/>
      <Route exact path="/canvas" component={Canvas}/>
      <Canvas/>
      </Switch>
      </Router>

    </Web3ReactProvider>
  );
};

export default App;
