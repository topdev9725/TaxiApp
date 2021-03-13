import React, {useEffect} from 'react';
import { Link,Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import EditIcon from '@material-ui/icons/Edit';
import toastr from 'toastr';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';
import Rating from '@material-ui/lab/Rating';
import { Container } from 'react-bootstrap';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
    fontWeight: "bold",
    maxWidth: "100%"
  },
}));

const backStyle = {
    position: "absolute",
    top: 15,
    left: 20,
    zIndex: 900,
    color: "#b5b5b5"
  }

const addStyle = {
    position: "absolute",
    top: 15,
    right: 20,
    zIndex: 900,
    color: "#0981fd"
  }

// var ratings = '';

export default function Driver() {
  const classes = useStyles();
  const [dense, setDense] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [drivers, setDrivers] = React.useState([]);
  const [ratings, setRatings] = React.useState([]);
  const [driverid, setDriverId] = React.useState('');
  const [adddriver, setAddDriver] = React.useState(false);
  const [isdriverview, setIsDriverView] = React.useState(false);
  const [isdriverhistory, setIsDriverHistory] = React.useState(false);
  const [isdriveredit, setIsDriverEdit] = React.useState(false);

  useEffect(() => {

    var requestOptions = {
      method: 'GET',  
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': JSON.parse(localStorage["appState"]).user.access_token,
      },
    };
    
    fetch("/api/getalldriver", requestOptions)
      .then(response => response.text())
      .then(result => {
        setIsLoaded(true)
        setDrivers(JSON.parse(result).drivers)
        setRatings(JSON.parse(result).ratings)
      })
      .catch(error => {
        console.log("driver manage")
        console.log('error', error)
      });
  
  }, []);

  const driverdelete = (driver_id) => {
    $.ajax({
        method: "POST",
        url: "api/driverdelete",
        headers: {"Authorization": JSON.parse(localStorage["appState"]).user.access_token},
        data: {
          driver_id: driver_id
        },
        success: function(result){
            toastr.success('Successfully removed!')
            location.reload()
        },
        error: function(error) {
          console.log(error)
          toastr.error('Failed!')
        }
    });
  };

  const driveredit = (driver_id) => {
    setIsDriverEdit(true)
    setDriverId(driver_id)
  };

  const driverview = (driver_id) => {
    setIsDriverView(true)
    setDriverId(driver_id)
  };

  const driverhistory = (driver_id) => {
    setIsDriverHistory(true)
    setDriverId(driver_id)
  };

  const addDriver = () => {
    setAddDriver(true)
  };

  if(!localStorage["appState"]) {
    return <Redirect to="/" />
  }

  if(isdriveredit) {
    return <Redirect to={{pathname: '/driveredit', driver_id: driverid}} />
  }

  if(isdriverhistory) {
    return <Redirect to={{pathname: '/driverhistory', driver_id: driverid}} />
  }

  if(adddriver) {
    return <Redirect to='/addDriver' />
  }

  if(isdriverview) {
    return <Redirect to={{pathname: '/driverview', driver_id: driverid}} />
  }

  if (!isLoaded) {
      return <div>Loading...</div>
  } else{
      return (
        <div className={classes.root}>
            <Link to="/">
                  <ArrowBackIosIcon style={backStyle}/>
            </Link>
            <PersonAddIcon style={addStyle} onClick={() => addDriver()}/>
            <Container>
              <Grid item xs={12} md={6} className="text-center">
                <Typography variant="h4" className={classes.title} style={{margin:"70px 0px 20px"}}>
                  Driver Management
                </Typography>
                <div className={classes.demo}>
                  <List dense={dense}>
                  {drivers.map((driver, index) => ( 
                      <ListItem key={index}  style={{background: index % 2 == 1?'':'#f5f5f5', borderBottom: '1px solid #dddddd'}}>
                        <ListItemAvatar>
                          <Avatar alt="Remy Sharp" src={driver.photo == null? "assets/images/users/default.png" : "assets/images/users/a" + driver.photo} className={classes.small} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={driver.name}
                          secondary={<Rating name="size-small" defaultValue={5} size="small" readOnly/>}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="edit" onClick={() => driverview(driver.id)}>
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton edge="end" aria-label="edit" onClick={() => driveredit(driver.id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" aria-label="edit" onClick={() => driverhistory(driver.id)}>
                            <DirectionsCarIcon />
                          </IconButton>
                          {/* <IconButton edge="end" aria-label="delete" onClick={() => driverdelete(driver.id)}>
                            <DeleteIcon />
                          </IconButton> */}
                        </ListItemSecondaryAction>
                      </ListItem>
                  ))}
                  </List>
                </div>
              </Grid>
            </Container>
        </div>
      );
  }
}