import Board from "@components/Board";
import Header from "@components/Header";
import Sidebar from "@components/Sidebar";
import React, { useEffect, useState } from 'react';
import { InfinitySpin } from "react-loader-spinner";
import { useBoards } from "@src/context";
export default function Home() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [user, setUser] = useState(null);
  const {getLoaderStatus} = useBoards();
  return (
  <div className="h-screen">
      <>
        <Header sidebarVisible={showSidebar} />
        <div className="flex board-height">
          <Sidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
          <Board />

          {getLoaderStatus()?(<>
            <div style={{position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'}}>
            <InfinitySpin 
              width='200'
              color="#635fc7"
              />
            </div>
          </>):(<></>)}
          
         
        </div>
      </>
  </div>
);
}