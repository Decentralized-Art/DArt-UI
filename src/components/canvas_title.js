import React from "react";

import { AppBar, Grid, Typography} from "@material-ui/core";

const styles = {
    appbar: {
      background: "blue",
      boxShadow: "none",
      backdropFilter: "blur(15px)",
      marginTop: 0,
    },
  };

const CanvasTitlebar = (props) => {
    
    return (
      <AppBar position="static" style={styles.appbar}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Typography variant="h2" color="textPrimary">
              DArt
            </Typography>
          </Grid>
          <Grid
            container
            item
            xs={12}
            sm={6}
            spacing={2}
            alignItems="center"
            justify="flex-end"
          >
              <Grid item>
                <h3>{props.titleProps.location.canvasProps.hash}</h3>
              </Grid>
          </Grid>
          
        </Grid>
      </AppBar>
    );
  };
  
  export default CanvasTitlebar;
  