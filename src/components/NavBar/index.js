import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { Button, TextField } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from '../../assets/logo-branco.png'
import { logout } from '../../services/auth';
import * as UserLoggedActions from '../../store/actions/userLogged';
import * as CampusActions from '../../store/actions/campus';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import api from '../../services/api';
import MenuItemList from "../Menu"

function NavBar() {
  const classes = useStyles();
  let history = useHistory();

  const [state, setState] = useState({ left: false });
  const [userAdm, setUserAdm] = useState(false); 
  const [showDrawer, setShowDrawer] = useState(false); 
  const [isLogged, setIsLogged] = useState(false);
  const [url, setUrl] = useState('')
  const [anchorEl, setAnchorEl] = useState(null);

  const userLogged = useSelector(state => state.userLogged.userLogged);
  const campusUserLogged = useSelector(state => state.campus.campus);
  const dispatch = useDispatch();

  const handleClick = (event, url) => {
    setAnchorEl(event.currentTarget);
    setUrl(url)
  };
  const handleClose = () => { setAnchorEl(null) };

  function setUserAndCampus() {
    dispatch(CampusActions.setCampus(''));
    dispatch(UserLoggedActions.setUserLogged(''));
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return

    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    verifyIfIsLogged()
  }, [userLogged])

  async function verifyIfIsLogged() {
    await api.get('/userLogged')
    .then(response => {
        if(userLogged?.id) {
            setIsLogged(true)
            if(userLogged.function == 'adm') {
                setUserAdm(true)
            }
            else {
                setUserAdm(false)
            }
        }
    })
    .catch(error => {
        logout()
    })
}

  async function handleLogout(e) {
    e.preventDefault();
    setUserAndCampus()
    
    await logout()
    .then(() => history.push("/"))
    .catch(() => handleLogout(e))        
  }

  function showMenu(x) {
    if (x.matches) { // If media query matches
        if(!showDrawer) {
          setShowDrawer(true)
        }
    }
    else {
        if(showDrawer) {
          setShowDrawer(false)
        }
    }
  }

  const x = window.matchMedia("(max-width: 750px)")
  showMenu(x) // Call listener function at run time
  x.addListener(showMenu) // Attach listener function on state changes

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (<>
    <Drawer anchor={"left"} open={state["left"]} onClose={toggleDrawer("left", false)}>
      {list("left")}
    </Drawer>

    <MenuItemList anchorEl={anchorEl} handleClose={handleClose} url={url} userAdm={userAdm}/>

    <div className={classes.root}>
      <AppBar className={classes.nav} position="static">
        <Toolbar>
         {showDrawer && (
            <IconButton onClick={toggleDrawer("left", true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
         )}
          <div>
            <img className={classes.image} src={Logo} alt="Logo da UNESPAR"/>
          </div>
          <div className={classes.containerButtons}>
            {!showDrawer && (<>
              <div>
                <Button style={{ marginRight: 10, color: '#FFF' }} aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => handleClick(e, 'new')}>
                  Novo
                </Button>
              </div>

              <div>
                <Button style={{ marginRight: 10, color: '#FFF' }} aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => handleClick(e, 'edit')}>
                  Editar
                </Button>
              </div>

              <div>
                <Button style={{ marginRight: 10, color: '#FFF' }} aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => handleClick(e, 'delete')}>
                  Excluir
                </Button>
              </div>

              <div>
                <Button style={{ marginRight: 10, color: '#FFF' }} aria-controls="simple-menu" aria-haspopup="true" onClick={(e) => handleClick(e, 'view')}>
                  Visualizar
                </Button>
              </div>
            </>)}
          </div>
          
          <Button color="inherit" onClick={handleLogout}>Sair</Button>
        </Toolbar>
      </AppBar>
    </div>
  </>);
}

const useStyles = makeStyles((theme) => ({
  image: {
    height: 70,
  },
  nav: {
    backgroundColor: "#042963"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  containerButtons: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 25
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default NavBar;
