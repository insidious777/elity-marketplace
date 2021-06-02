import React, {Fragment, useState, useRef, useContext} from 'react';
import s from './Header.module.css'
import {NavLink, Link, useHistory} from 'react-router-dom';
import logo from '../../assets/img/logo.png';
import {AuthContext} from '../../context/AuthContext';
function Header(props){
    const [navStyle, setNavStyle] = useState({});
    const [sideBar, setSideBar] = useState(false);
    const [userMenuShown, setUserMenuShown] = useState(false);
    const history = useHistory();
    const sideBarButton = useRef(null);
    const {logout} = useContext(AuthContext);
    const closeSideBar = () => {
        sideBarButton.current.checked = false;
    }

    const logoutHandler = () => {
        logout();
        history.push('/login');
    }

    const sidebarHandler = (e) => {
        if(e.target.checked){
            setNavStyle({position:"fixed", transition: "all .5s",top:'0px'});
            setSideBar(true);
            setUserMenuShown(true);
        } 
        else {
            setNavStyle({});
            setSideBar(false);
            setUserMenuShown(false);
        }
    }
    return(
        <Fragment>
    
                <nav className={s.navigation} style={navStyle}>
                <input ref={sideBarButton} type="checkbox" id={s.check} onClick={sidebarHandler}/>
                <label htmlFor={s.check} className={s.checkbtn}>
                <i className="fas fa-bars"></i>
                </label>
                <Link to="/auction" className={s.logo}><img src={logo} alt="logo" /></Link>
                <ul className={s.list}>
                    {sideBar?null:<li><Link className={s.link} onClick={closeSideBar} to="/auction">Головна</Link></li>}
                    <div className={s.bottomButtons}>
                    {props.isLogined?
                    <li><Link className={s.createLot} onClick={closeSideBar} to="/create/lot">Створити оголошення</Link></li>:
                    <li><Link className={s.loginBut} onClick={closeSideBar} to="/login">Вхід</Link></li>}
                    {props.isLogined?
                    <div className={s.userBar}>
                        <i className={s.alert+" fas fa-star"}></i>
                        <img alt="img" src="https://icons-for-free.com/iconfiles/png/512/business+costume+male+man+office+user+icon-1320196264882354682.png" className={s.userIcon}/>
                       <div onClick={()=>{setUserMenuShown(!userMenuShown)}}>
                           {userMenuShown?<i  className={s.menuButton + " fas fa-chevron-up"}></i>:<i className="fas fa-chevron-down"></i>}
                        </div>
                       {userMenuShown?
                       <div className={s.userDropMenu}>
                           <h3>Мій кабінет</h3>
                           <div className={s.userDropMenuItem}><i className="fas fa-layer-group"></i><p>Оголошення</p></div>
                           <div className={s.userDropMenuItem}><i className="far fa-file-alt"></i><p>Мої документи</p></div>
                           <div className={s.userDropMenuItem}><i className="far fa-bell"></i><p>Усі сповіщення</p></div>
                           <div className={s.userDropMenuItem}><i className="fas fa-cog"></i><p>Налаштування</p></div>
                           <div className={s.logout} onClick={logoutHandler}><i className="fas fa-sign-out-alt"></i><p>Вийти</p></div>
                       </div>:null}
                    </div>:
                    <Link className={s.registerBut} onClick={closeSideBar} to="/register">Реєстрація</Link>}
                    </div>
                </ul>
                </nav>
                <div className={s.fakeDiv}></div>
        </Fragment>
    )
}

export default Header;