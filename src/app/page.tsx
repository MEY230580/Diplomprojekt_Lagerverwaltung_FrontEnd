import * as React from 'react';
import Sidebar  from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Grid from "./components/Grid";

const Home: React.FC = () => {
  return (
      <div>
        <Sidebar />
        <TopBar />
        <Grid />
      </div>
  );
};
export default Home;