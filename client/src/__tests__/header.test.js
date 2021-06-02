import Header from '../components/Header/Header';
import React from 'react';
import renderer from 'react-test-renderer';
import {BrowserRouter as Router} from 'react-router-dom';
describe('Header', () => {
 
  test('loggined snapshot renders', () => {
    const component = renderer.create(<Router><Header isLogined={true}/></Router>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })

  test('not loggined snapshot renders', () => {
    const component = renderer.create(<Router><Header isLogined={false}/></Router>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })
});
