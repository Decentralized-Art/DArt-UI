import React from "react";
import { Injected } from "../utils/web3-connectors";
import { useWeb3React } from "@web3-react/core";
import { AppBar, Grid, Typography, Button } from "@material-ui/core";

const styles = {
    appbar: {
      background: "transparent",
      boxShadow: "none",
      backdropFilter: "blur(15px)",
      marginTop: 10,
    },
  };

const Canvas_titlebar = () => {
    const { account, activate } = useWeb3React();
    return (
      <AppBar position="static" style={styles.appbar}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography variant="h2" color="textPrimary">
              DArt
            </Typography>
          </Grid>
          <Button style={{backgroundColor:"black",color:"white"}}>Create Merge Request</Button>
        </Grid>
      </AppBar>
    );
  };
  
  export default Canvas_titlebar;
  