import {render, fireEvent, act, waitFor} from '@testing-library/react';
import {renderHook} from '@testing-library/react-hooks';
import {Router, MemoryRouter} from 'react-router-dom';
import Register from '../pages/Register/Register'
import {createBrowserHistory} from 'history';
import React from 'react';
import { useHttp } from '../hooks/HttpHook';
describe("register",()=>{
    const history = createBrowserHistory();
    
    it("renders correctly", ()=>{
        const {queryByTestId, queryByPlaceholderText} = render(<Router history={history}><Register/></Router>);
        expect(queryByTestId("register")).toBeTruthy();
        expect(queryByPlaceholderText("Пароль")).toBeTruthy();
    })
    
    it("shows validation errors",async ()=>{
        const {queryByPlaceholderText, queryByText, queryByTestId} = render(<Router history={history}><Register/></Router>);
        const nameInput = queryByPlaceholderText("Ім'я");
        const emailInput = queryByPlaceholderText("Email");
        const phoneInput = queryByPlaceholderText("Номер телефону");
        const passInput = queryByPlaceholderText("Пароль");
        const sumbitBtn = queryByText("Зареєструватись");
        global.fetch = jest.fn();
        
        fireEvent.change(nameInput, {target:{value:"name"}});
        fireEvent.click(sumbitBtn);
        await waitFor(()=>{
            const error = queryByTestId("register-errros");
            expect(error.innerHTML).toBe("Введіть електронну пошту");
        })
        fireEvent.change(emailInput, {target:{value:"email"}});
        fireEvent.click(sumbitBtn);
        await waitFor(()=>{
            const error = queryByTestId("register-errros");
            expect(error.innerHTML).toBe("Введіть телефон");
        })
        fireEvent.change(phoneInput, {target:{value:"+38 (067) 123-45-67"}});
        fireEvent.click(sumbitBtn);
        await waitFor(()=>{
            const error = queryByTestId("register-errros");
            expect(error.innerHTML).toBe("Введіть пароль");
        })
        fireEvent.change(passInput, {target:{value:"pass"}});
        fireEvent.click(sumbitBtn);
        await waitFor(()=>{
            expect(global.fetch).toBeCalledWith("http://localhost/api/v1/user/registration/", 
            {"body": "{\"username\":\"name\",\"email\":\"email\",\"phone_number\":\"+380671234567\",\"password\":\"pass\"}","headers": {"Content-Type": "application/json"}, "method": "POST"});
            })
        })

        it('redirects to next page', async ()=>{
            global.fetch = jest.fn().mockReturnValueOnce(Promise.resolve({
                ok:true,
                json:() => Promise.resolve({token:{access:"test", refresh:"test"}, next_page:"verify-sms-code"}),
            })).mockReturnValueOnce(Promise.resolve({
                ok:true,
                json:() => Promise.resolve({token:{access:"test", refresh:"test"}, next_page:"home"}),
            }))
            const pushSpy = jest.spyOn(history, 'push');
            const {queryByPlaceholderText, queryByText} = render(
            <Router history={history}>
                <Register />
            </Router>);
            
            const nameInput = queryByPlaceholderText("Ім'я");
            const emailInput = queryByPlaceholderText("Email");
            const phoneInput = queryByPlaceholderText("Номер телефону");
            const passInput = queryByPlaceholderText("Пароль");
            const sumbitBtn = queryByText("Зареєструватись");
            fireEvent.change(nameInput, {target:{value:"name"}});
            fireEvent.change(emailInput, {target:{value:"email"}});
            fireEvent.change(phoneInput, {target:{value:"+38 (067) 123-45-67"}});
            fireEvent.change(passInput, {target:{value:"pass"}});
            fireEvent.click(sumbitBtn);
            await waitFor(()=>{
                expect(pushSpy).toHaveBeenCalledWith("/verify");
            })
            fireEvent.click(sumbitBtn);
            await waitFor(()=>{
                expect(pushSpy).toHaveBeenCalledWith("/");
            })
        })

        it('prints request error to the console', async ()=>{
            global.fetch = jest.fn().mockReturnValue(Promise.resolve({
                ok:false,
                json:() => Promise.resolve({token:{access:"test", refresh:"test"}, next_page:"verify-sms-code"}),
            }))
            const consoleSpy = jest.fn();
            global.console.log = consoleSpy;
            const {queryByPlaceholderText, queryByText} = render(
                <Router history={history}>
                    <Register />
                </Router>);
                console.log(history);
                const nameInput = queryByPlaceholderText("Ім'я");
                const emailInput = queryByPlaceholderText("Email");
                const phoneInput = queryByPlaceholderText("Номер телефону");
                const passInput = queryByPlaceholderText("Пароль");
                const sumbitBtn = queryByText("Зареєструватись");
                fireEvent.change(nameInput, {target:{value:"name"}});
                fireEvent.change(emailInput, {target:{value:"email"}});
                fireEvent.change(phoneInput, {target:{value:"+38 (067) 123-45-67"}});
                fireEvent.change(passInput, {target:{value:"pass"}});
                fireEvent.click(sumbitBtn);
                
                await waitFor(()=>{
                    expect(consoleSpy).toHaveBeenCalledTimes(1);
                })
        })
    })