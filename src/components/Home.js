import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import Titlebar from "./Titlebar";
import { ethers } from "ethers";
import ipfs from "./ipfs";
import { Typography } from "@material-ui/core";
import { useWeb3React } from "@web3-react/core";
import backgroundH from "../assets/source.gif";
import { MAIN_CONTRACT_ADDRESS } from "../info";
import { MAIN_CONTRACT_ABI } from "../Abi/Main";
import TextField from '@material-ui/core/TextField';
import {Button, Dialog,DialogContent,DialogTitle} from "@material-ui/core";

import { ThreeIdConnect, EthereumAuthProvider } from '3id-connect';

const Ceramic = require("@ceramicnetwork/http-client").default;
// const { Ed25519Provider } = require("key-did-provider-ed25519");
const threeIdConnect = new ThreeIdConnect();

const CERAMIC_URL = "https://ceramic-clay.3boxlabs.com";

const Home = () => {
  const { account, library } = useWeb3React();
  const [isOpenOwn, setIsOpenOwn] = useState(false);
  const [isOpenUser, setIsOpenUser] = useState(false);
  const [isRegistered, setIsRegistered] = useState(null);
  const [isImg, setImg] = useState(false);
  const [hash,setHash] = useState(false);
  const [userHash,setUserHash] = useState(false);
  const [user1,setUser1] = useState("");
  const [user1From,setUser1From] = useState("");
  const [user1To,setUser1To] = useState("");
  const [user2,setUser2] = useState("");
  const [user2From,setUser2From] = useState("");
  const [user2To,setUser2To] = useState("");
  const [valid,setValid] = useState(false);
  const [canvWidth,setWidth] = useState(500);
  const [canvHeight,setHeight] = useState(500);
  const ceramic = null;
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
  },[account,isRegistered,library]);
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
          <DialogTitle>Add wallet addresses of upto 2 collaborators<br></br>(Canvas Size: 2000x1000)</DialogTitle>
          <DialogContent>
          <form noValidate autoComplete="off">
          <input type="text" name="Address1" placeholder="Address1" onChange={event => setUser1(event.target.value)} />
          <input type="text" name="From" placeholder="From" onChange={event => setUser1From(event.target.value)}/>
          <input type="text" name="To" placeholder="To" onChange={event => setUser1To(event.target.value)}/><br></br>
          <input type="text" name="Address2" placeholder="Address2" onChange={event => setUser2(event.target.value)} />
          <input type="text" name="From" placeholder="From" onChange={event => setUser2From(event.target.value)}/>
          <input type="text" name="To" placeholder="To" onChange={event => setUser2To(event.target.value)}/><br></br>
        </form>
      
        <Button
          style={{
            left: '40%',
            backgroundColor: "black",
            color: "white",
          }} onClick={async () => {
            // const tx = await mainContract.registerUser(
              
            // );
            console.log("Submit clicked!");
            fetch("http://127.0.0.1:5000/init",{
              method: "GET",
              mode:"cors",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            }).then(data => data.json())
            .then(async data => {
              const addresses = await window.ethereum.enable();
              console.log(addresses);
              const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0]);
              await threeIdConnect.connect(authProvider);
              const didProvider = await threeIdConnect.getDidProvider();
              
              // Connect to the local Ceramic node
              const ceramic = new Ceramic(CERAMIC_URL);
              // Authenticate the Ceramic instance with the provider
            
              await ceramic.setDIDProvider(didProvider);
            
              // ceramic.close();
              console.log("Ceramic:",ceramic)
              const jsonSchema = {
                "type": "object",
                "$schema": "http://json-schema.org/draft-07/schema#",
                "required": [
                  "hash",
                  "address1",
                  "address2",
                  "add1Start",
                  "add1End",
                  "add2Start",
                  "add2End"
                ],
                "properties": {
                  "hash": {
                    "type": "string"
                  },
                  "address1": {
                    "type": "string"
                  },
                  "address2":{
                    "type": "String"
                  },
                  "add1Start":{
                    "type" : "Array"
                  },
                  "add1End":{
                    "type" : "Array"
                  },
                  "add2Start":{
                    "type" : "Array"
                  },
                  "add2End":{
                    "type" : "Array"
                  }
                },
                "additionalProperties": false
              };
              console.log(ceramic.did.id);
              console.log(user1,user2,user1From,user1To,user2From,user2To);
              const schema_doc = await ceramic.createDocument('tile', { content: jsonSchema })
              console.log(schema_doc);
              const new_doc = await ceramic.createDocument('tile',{
                metadata: 
                  { controllers: [ceramic.did.id],
                  family: "doc family"},
                content: {
                  title: "Init",
                  img: data["hash"],
                  address1: user1,
                  address2: user2,
                  add1Start: user1From,
                  add1End: user1To,
                  add2Start: user2From,
                  add2End: user2To 
                }
              });
              await ceramic.pin.add(new_doc.id.toString());
              console.log("id:",new_doc.id.toString());
              setHash(new_doc.id.toString());
              console.log(data["hash"]);
            }).catch(error => console.log(error))
          }} 
           size="large" variant="outlined"> <h3>Submit</h3></Button>
          {hash !== false && <div><h4>Share this hash with your friends: {hash}</h4> </div>}
          </DialogContent>
          </Dialog>
          <Button
          style={{
            position: "absolute",
            left: '50%',
            top: '30%',
            backgroundColor: "black",
            color: "white",
          }} onClick={() => setIsOpenUser(true)} size="large" variant="outlined" onClose={() => setIsOpenUser(false)}> <h3>Join your team</h3></Button>
          <Button
          style={{
            position: "absolute", //kjzl6cwe1jw148drw5xsg8wewqpsznsx0am4btu67rdvfxek67avfqoccmdgdhq
            left: '40%',
            top: '50%',
            backgroundColor: "black",
            color: "white",
          }} onClick={() => setImg(true)} size="large" variant="outlined" onClose={() => setImg(false)}> <h3>View Image</h3></Button>

          <Dialog open={isOpenUser} onClose={() => setIsOpenUser(false)}>
          <DialogTitle>Add Ceramic hash:</DialogTitle>
          <DialogContent>
          <form noValidate autoComplete="off">
            Ceramic hash:<TextField onChange={async event => {
              setUserHash(event.target.value);
              var uhash = event.target.value;
              const addresses = await window.ethereum.enable();
              const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0]);
              await threeIdConnect.connect(authProvider);
              const didProvider = await threeIdConnect.getDidProvider();
              
              const ceramic = new Ceramic(CERAMIC_URL);
            
              await ceramic.setDIDProvider(didProvider);
            
              const exis_doc = await ceramic.loadDocument(uhash);
              var res = exis_doc.content;
              console.log(res["address1"]);
              console.log(addresses[0]);
              let end1 = res["add1End"].split(",");
              let start1 = res["add1Start"].split(",");
              let end2 = res["add2End"].split(",");
              let start2 = res["add2Start"].split(",");
              let ht = parseInt(end1[1])-parseInt(start1[1]);
              let wt = parseInt(end1[0])-parseInt(start1[0]);
              if (res["address1"].toLowerCase()===addresses[0]){
                  setHeight(ht);
                  setWidth(wt);
                  setValid(true);
                  console.log("canvas:",canvWidth,canvHeight);
              }else if (res["address2"].toLowerCase()===addresses[0]){
                  setHeight(ht);
                  setWidth(wt);
                  setValid(true);
              }else{
                console.log("Not authenticated");
              }
              }} id="outlined-basic" label="Hash" variant="outlined" size="small"/>
          </form>
          <br></br>
          {valid !== false && <Link to={{
              pathname:"/canvas",
              canvasProps:{
                hash: userHash,
                height: {canvHeight},
                width: {canvWidth}
              }}}>
          <Button
            style={{
              left: '30%',
              height: '40px',
              backgroundColor: "black",
              color: "white",
            }} onClick={async () => {
                          
            }}
            size="large" variant="outlined"> <h4>Go to Drawing</h4></Button>
            </Link>}
          </DialogContent>
          </Dialog>

          <Dialog open={isImg} onClose={() => setImg(false)}>
          <DialogTitle>Add Ceramic hash:</DialogTitle>
          <DialogContent>
          <form noValidate autoComplete="off">
            Ceramic hash:<TextField onChange={async event => {
              setUserHash(event.target.value);
              var uhash = event.target.value;
              const addresses = await window.ethereum.enable();
              const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0]);
              await threeIdConnect.connect(authProvider);
              const didProvider = await threeIdConnect.getDidProvider();
              
              const ceramic = new Ceramic(CERAMIC_URL);
            
              await ceramic.setDIDProvider(didProvider);
            
              const exis_doc = await ceramic.loadDocument(uhash);
              var res = exis_doc.content;
              console.log(res["img"]);
              setUserHash(res["img"]);
              
              }} id="outlined-basic" label="Hash" variant="outlined" size="small"/>
          </form>
          <br></br>
          <Link to={{
              pathname:"http://localhost:8080/ipfs/"+userHash,
              }} target="_blank">
          <Button
            style={{
              left: '30%',
              height: '40px',
              backgroundColor: "black",
              color: "white",
            }} size="large" variant="outlined"> <h4>Go to Image</h4></Button>
            </Link>
          </DialogContent>
          </Dialog>
            
        </div>
        </>
);

};

export default Home;


