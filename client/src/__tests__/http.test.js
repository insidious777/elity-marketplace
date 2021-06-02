import {useHttp} from '../hooks/HttpHook';
import React from 'react';
import * as localizate from '../localization/localization';
import {renderHook} from '@testing-library/react-hooks';
import { act } from 'react-test-renderer';
describe('Http Hook', ()=>{
    const testToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjE4NzcxMTc1LCJqdGkiOiIxY2M0ZDJjNGUyZTc0N2UxYWMxZTE5ODU4YTgzN2RjNCIsInVzZXJfaWQiOjEsInNjb3BlIjoibWFpbiJ9.mw_-EZEWgXNPVYQ6y27sqD6-P7LlYbgELIIHHpzkwnw'
    let realUseContext;
    let useContextMock;
    const fetchRefreshToken = jest.fn(()=>'fsdfsd');
    beforeEach(() => {
        realUseContext = React.useContext;
        useContextMock = React.useContext = jest.fn(()=>{
            return{fetchRefreshToken}
        })
    });
    
    afterEach(() => {
        React.useContext = realUseContext;
    });

    it("should throw error if request failed", async ()=>{
        localizate.default = jest.fn();
        global.fetch = jest.fn(async ()=>{
            return Promise.resolve({
                 ok:false,
                 json:() => Promise.resolve({ errors:['error','error'] }),
             })
         })
         const { result } = renderHook(() => useHttp());
         await act(async()=>{
             await result.current.request()
         })
         expect(localizate.default).toBeCalledTimes(2);
         expect(result.current.msg).not.toBeNull();
         expect(result.current.msg).toBe('Something wrong');
      })

    it("should get data from request", async () => {
        const { result } = renderHook(() => useHttp());
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok:true,
                json:() => Promise.resolve({ data:'data' }),
            })
        );
        let data;
        await act(async()=>{
            data = await result.current.request('http://test.com');
        })
        expect(data).toStrictEqual({data:'data'});
        expect(fetch).toBeCalledTimes(1);
      })


      it("should loading while request", async ()=>{
        const { result } = renderHook(() => useHttp());
        global.fetch = jest.fn(async ()=>{
           return setTimeout(()=>
            Promise.resolve({
                ok:true,
                json:() => Promise.resolve({ data:'data' }),
            }),1000)
        })
        expect(result.current.loading).toBe(false);
        await act(async()=>{
            setTimeout(()=>{
                expect(result.current.loading).toBe(true);
            },200)
            await result.current.request();
        })
        expect(result.current.loading).toBe(false);
      })

      it("should get data with unvalid token", async () => {
          window.localStorage.__proto__.getItem = jest.fn(()=>{
            return JSON.stringify({token: testToken, refreshToken: testToken})
        });
        global.fetch = jest.fn()
        .mockReturnValueOnce(Promise.resolve({
            ok: false,
            status: 401,
            json:() => Promise.resolve({
                "errors":[
                    {
                        "code": "ACCESS_TOKEN_MISSMATCH",
                    }
                ]
            }),
        }))
        .mockReturnValueOnce(Promise.resolve({
            ok:true,
            json:() => Promise.resolve({
                data: 'data'
            }),
        }))
        
        const http = renderHook(() => useHttp());
        let data;
        await act(async()=>{
            const testBody = {data:'data'};
            const expectedSettings = {
                body:JSON.stringify(testBody), 
                method:"POST", 
                headers:{
                    "Authorization": `Bearer ${testToken}`,
                    "Content-Type": "application/json"
                }
            }
            await http.result.current.request('test.com',"POST",testBody)
            expect(fetchRefreshToken).toBeCalledTimes(1);
            expect(global.fetch).toBeCalledWith('test.com',expectedSettings);
            expect(await http.result.current.request()).toStrictEqual({data: "data"});
        })
      })
      
    })
