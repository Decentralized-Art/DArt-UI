import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Titlebar from "./Titlebar";
import { ethers } from "ethers";
import { Typography } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import backgroundH from "../assets/source.gif";
import { MAIN_CONTRACT_ADDRESS } from "../info";
import { MAIN_CONTRACT_ABI } from "../Abi/Main";
import TextField from '@material-ui/core/TextField';
import {Button, Dialog,DialogContent,DialogTitle} from "@material-ui/core";

const Home = () => {
  const { account, library } = useWeb3React();
  const [isOpenOwn, setIsOpenOwn] = useState(false);
  const [isOpenUser, setIsOpenUser] = useState(false);
  const [isRegistered, setIsRegistered] = useState(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  var mainContract = null;

  useEffect(() => {
    const operation = async () => {
      const signer = library.getSigner(account);
      mainContract = new ethers.Contract(
        MAIN_CONTRACT_ADDRESS,
        MAIN_CONTRACT_ABI,
        signer
      );
      const registrationStatus = await mainContract.isAddressRegistered(
        account
      );
      if (registrationStatus) {
        console.log(`${account} is registered`);
      } else {
        console.log(`${account} is not registred`);
      }
      setIsRegistered(registrationStatus);
    }
  },[account,isRegistered,library,needsRefresh]);
    return (
        <>
          <Titlebar />
          <div
            style={{
              position: "absolute",
              top: '20%',
              left: '20%',
              height: '40vw',
              width: '60vw',
              backgroundImage: `url(${backgroundH})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
                    // backgroundColor: "green",
            }}>
            <Typography variant="h2">
            Collaborate with your friends in building Decentralized artwork!
          </Typography>
          <Button
          style={{
            position: "absolute",
            left: '20%',
            top: '30%',
            backgroundColor: "black",
            color: "white",
          }} onClick={() => setIsOpenOwn(true)} size="large" variant="outlined"> <h3>Set up Canvas now!</h3></Button>
          <Dialog fullWidth={true} open={isOpenOwn} onClose={() => setIsOpenOwn(false)}>
          <DialogTitle>Add wallet addresses of upto 3 collaborators(Canvas Size: 2000x1000)</DialogTitle>
          <DialogContent>
          <form noValidate autoComplete="off">
          <input type="text" name="Address1" placeholder="Address1" />
          <input type="text" name="From" placeholder="From"/>
          <input type="text" name="To" placeholder="To"/><br></br>
          <input type="text" name="Address2" placeholder="Address2" />
          <input type="text" name="From" placeholder="From"/>
          <input type="text" name="To" placeholder="To"/><br></br>
        </form>
      
        <Button
          style={{
            left: '40%',
            backgroundColor: "black",
            color: "white",
          }} onClick={async () => {
            const tx = await mainContract.registerUser(
              
            );
            var buffer = new Uint8ClampedArray(2000 * 1000 * 4);
            
          }}
           size="large" variant="outlined"> <h3>Submit</h3></Button>
          
          </DialogContent>
          </Dialog>
          <Button
          style={{
            position: "absolute",
            left: '50%',
            top: '30%',
            backgroundColor: "black",
            color: "white",
          }} onClick={() => setIsOpenUser(true)} size="large" variant="outlined"> <h3>Join your team</h3></Button>
          <Dialog open={isOpenUser} onClose={() => setIsOpenUser(false)}>
          <DialogTitle>Add image hash:</DialogTitle>
          <DialogContent>
          <form noValidate autoComplete="off">
            Image hash:<TextField id="outlined-basic" label="Hash" variant="outlined" size="small"/>
          </form>
      
          <Link to="/canvas">
          <Button
            style={{
              left: '30%',
              height: '40px',
              backgroundColor: "black",
              color: "white",
            }} onClick={async () => {
                          
            }}
            size="large" variant="outlined"> <h4>Go to Drawing</h4></Button>
            </Link>
          </DialogContent>
          </Dialog>
            
        </div>
        </>
);

};

export default Home;


