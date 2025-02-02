import * as React from 'react';
import Sidebar  from "./components/Sidebar/Sidebar";
import TopBar from "./components/TopBar/TopBar";
import GetProducts from "@/app/components/ProductsAPI/GetProducts";
//import Grid from "./components/Grid/Grid";


export default function Home() {
  return (
      <div>
        <Sidebar />
        <TopBar />
        <GetProducts />
      </div>
  );
}