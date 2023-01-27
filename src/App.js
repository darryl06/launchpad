import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, Route, Routes } from "react-router-dom";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import "./App.css";
import Web3ReactManager from "./components/Web3ReactManager";
import { SUPPORTED_CHAIN_IDS } from "./connectors";
import Connection from "./pages/Connection";
import Footer from "./components/Footer/Footer";
import Navigation from "./components/Navbar";
import Account from "./pages/account";
import Home from "./pages/home.js";
import Launchpad from "./pages/launchpad.js";
import LaunchpadInfo from "./pages/launchpadInfo";
import Locker from "./pages/locker";
import LockerInfo from "./pages/lockerInfo";
import LockToken from "./pages/lockToken";
import Publish from "./pages/publish";
import { fetchContract } from "./redux/contract/contractAction";
import * as s from "./styles/global";

function App() {
  const dispatch = useDispatch();
  const { active, chainId, account, error } = useWeb3React();

  const [isAvailableNetwork, setIsAvailableNetwork] = useState(true);

  const isLockerEnabled = process.env.REACT_APP_ENABLE_LOCKER === 'true';

  useEffect(() => {
    fetchContract(chainId);
  }, [dispatch, account, chainId]);

  useEffect(() => {
    if (error && error instanceof UnsupportedChainIdError) {
      return setIsAvailableNetwork(false);
    }

    if (chainId) {
      // const lowerAcc = account?.toLowerCase()
      // const appAdmin = wordpressData?.wpAdmin
      //   ? wordpressData?.wpAdmin?.toLowerCase() === lowerAcc
      //   : admin && admin !== ZERO_ADDRESS
      //   ? admin.toLowerCase() === lowerAcc
      //   : true

      // const accessToStorageNetwork = appAdmin && chainId === STORAGE_NETWORK_ID

      // const networkIsFine =
      //   !wordpressData?.wpNetworkIds?.length
      //   || accessToStorageNetwork
      //   || wordpressData.wpNetworkIds.includes(chainId);

      setIsAvailableNetwork(
        Boolean(SUPPORTED_CHAIN_IDS.includes(Number(chainId))
        // && networkIsFine
      ))
    }
  }, [
    chainId,
    // domainDataTrigger,
    // wordpressData,
    // admin,
    account,
    error,
  ])

  useEffect(() => {
    if (chainId) {
      dispatch(fetchContract(chainId));
    }
  }, [chainId]);

  return (
    <Web3ReactManager>
      <s.Screen>
        {/* <s.Container ai="center">
          <div
            style={{
              border: "1px solid var(--secondary)",
              marginBottom: 30,
              width: "92%",
            }}
          />
        </s.Container> */}
        {active ? (
          <>
            <Navigation />
            <s.Container ai="center">
              <s.Container w="85%" style={{ minHeight: 600 }}>

                <Outlet />
                <Routes>
                  <Route path="/" element={<Launchpad />} />
                  <Route path="/launchpad" element={<Launchpad />} />
                  <Route
                    path="/home"
                    element={<Home />}
                  />
                  <Route path="/launchpad/:idoAddress" element={<LaunchpadInfo />} />
                  <Route path="/publish" element={<Publish />} />
                  <Route path="/lock" element={<LockToken />} />
                  <Route path="/account" element={<Account />} />
                  { isLockerEnabled && <Route path="/locker" element={<Locker />} /> }
                  { isLockerEnabled && <Route path="/locker/:lockerAddress" element={<LockerInfo /> } /> }
                </Routes>
                <s.SpacerLarge />
                <s.SpacerLarge />
                <s.SpacerLarge />
              </s.Container>
              <Footer />
            </s.Container>
          </>
        ) : (
          <Connection
            isAvailableNetwork={isAvailableNetwork}
          />
        )}
      </s.Screen>
    </Web3ReactManager>
  );
}

export default App;
