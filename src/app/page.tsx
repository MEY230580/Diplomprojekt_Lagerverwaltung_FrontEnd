import * as React from 'react';
import Sidebar  from "./components/Sidebar/Sidebar";
import TopBar from "./components/TopBar/TopBar";
import Grid from "./components/Grid/Grid";


export default function Home() {
  return (
      <div>
        <Sidebar />
        <TopBar />
        <Grid />
      </div>
  );
}