import React, {useEffect, Fragment} from 'react';
import s from './Home.module.css';
import Card from '../../components/Card/Card'
import {NavLink, useHistory} from 'react-router-dom';
import AllProducts from "../AllProducts/AllProducts";
import Popular from "../Popular/Popular";
import Saved from "../Saved/Saved";

function Home(){
    const history = useHistory();

    const showComponent = (location) => {
        console.log(location);
        switch (location.pathname) {
            case '/products/popular': return <Popular/>;
            case '/products/all': return <AllProducts/>;
            case '/products/saved': return <Saved/>;
        }
    }

    useEffect(()=>{
        
    },[])
    return(
        <Fragment>
            <div className={s.TopText}>
                <h1>Швидко. Просто. Безпечно</h1>
            </div>
            <div className={s.Home}>
                <div className={s.topBar}>
                    <ul className={s.list}>
                        <li>
                            <NavLink activeClassName={s.active} exact to="/products/popular">
                                <div className={s.listItem}>
                                    <h3>Популярні</h3>
                                    <div className={s.count}>
                                        <p>999</p>
                                    </div>
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName={s.active} to="/products/all">
                                <div className={s.listItem}>
                                    <h3>Усі оголошення</h3>
                                    <div className={s.count}>
                                        <p>2</p>
                                    </div>
                                </div>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink activeClassName={s.active} to="/products/saved">
                                <div className={s.listItem}>
                                    <h3>Збережені</h3>
                                </div>
                            </NavLink>
                        </li>
                    </ul>
                    </div>
            </div>
            {showComponent(history.location)}
        </Fragment>
    )
}

export default Home;