import React,{createRef, useState} from 'react';
import CanvasDraw from "react-canvas-draw";
import {CirclePicker} from "react-color";
import ipfs from "./ipfs";
import { useScreenshot, createFileName} from 'use-react-screenshot'
import { ThreeIdConnect, EthereumAuthProvider } from '3id-connect';

const Ceramic = require("@ceramicnetwork/http-client").default;
// const { Ed25519Provider } = require("key-did-provider-ed25519");
const threeIdConnect = new ThreeIdConnect();

const CERAMIC_URL = "https://ceramic-clay.3boxlabs.com";

var fs = require("fs");

const styles = {
    button: {backgroundColor:"green",
            color:"white",
            position:"absolute",
            left:"40%",
            top:"80%"}
  };

// class Drawing extends Component {
//     state = {
//         brushColor: "pink",
//         width: 1700,
//         height: 600
//     };
//     handleChange = (color,event) => {
//         this.setState({brushColor: color.hex});
//     };
//   render(){
//   return (
//     <div>
//     <CanvasDraw id="canvas" brushColor={this.state.brushColor} canvasWidth={this.state.width} canvasHeight={this.state.height}/>
//     <Button style={styles.button} onClick={async () => {
        
//     }}><h2>Create Merge Request</h2></Button>
//     <CirclePicker color={this.state.brushColor} onChangeComplete={this.handleChange}/>;
//     </div>
//   );
// }
// }

const Drawing =(props) => {

    const [Color,setColor] = useState(false);
    const ref = createRef(null);
    // console.log(props);
    const width = props.drawingProps.location.canvasProps.width.canvWidth;
    const height = props.drawingProps.location.canvasProps.height.canvHeight;
    const [userHash,setUserHash] = useState(false);
    const [finalHash, setFinalHash] = useState(false);
    const [image, takeScreenshot] = useScreenshot({
        type: "image/png",
        quality: 1.0
    });
    const download = async(image, { name = "new_img", extension = "png" } = {}) => {
        
        console.log(image);
        const addresses = await window.ethereum.enable();
        const authProvider = new EthereumAuthProvider(window.ethereum, addresses[0]);
        await threeIdConnect.connect(authProvider);
        const didProvider = await threeIdConnect.getDidProvider();
        const ceramic = new Ceramic(CERAMIC_URL);
        await ceramic.setDIDProvider(didProvider);
        const exis_doc = await ceramic.loadDocument(props.drawingProps.location.canvasProps.hash);
        var res = exis_doc.content;
        await fetch("http://127.0.0.1:5000/concat",{
              method: "POST",
              mode:"cors",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                "orig_hash": res["img"],
                "new_img": image,
                "start": [0,0],
                "end": [height,width]
              })
            }).then(data => data.json())
            .then(async data => {
              setFinalHash(data["hash"]);
              console.log(data["hash"]);
              await exis_doc.change({ content: { title: "New",
              img: data["hash"],
              address1: res["address1"],
              address2: res["address2"],
              add1Start: res["add1Start"],
              add1End: res["add1End"],
              add2Start: res["add2Start"],
              add2End: res["add2End"] }})

            }).catch(error => console.log(error))
        
      };
    const getImage = () => {
        takeScreenshot(ref.current).then(download);
        console.log(width,height);      
        console.log(props.drawingProps.location.canvasProps.hash);  
    };
      return (
        <div>
        <div ref={ref}>
        <CanvasDraw brushColor={Color} canvasWidth={width} canvasHeight={height}/>
        </div>
        <button style={styles.button} onClick={getImage}><h2>Create Merge Request</h2></button>
        <CirclePicker color="pink" onChangeComplete={(color,event) => setColor(color.hex)}/>;
        </div>
      );
    }

export default Drawing;
