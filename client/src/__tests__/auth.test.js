import {useAuth} from '../hooks/AuthHook';
import {act, renderHook} from '@testing-library/react-hooks';

describe('Auth Hook', () => {
    const testingToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjE4NzcxMTc1LCJqdGkiOiIxY2M0ZDJjNGUyZTc0N2UxYWMxZTE5ODU4YTgzN2RjNCIsInVzZXJfaWQiOjEsInNjb3BlIjoibWFpbiJ9.mw_-EZEWgXNPVYQ6y27sqD6-P7LlYbgELIIHHpzkwnw'
    const testingRefreshToken = `${testingToken}123`;
    test('should login if token exists in localstorage', ()=>{
        window.localStorage.__proto__.getItem = jest.fn((name)=>'')
        const http = renderHook(() => useAuth());
        expect(http.result.current.token).toBe(null);
        expect(http.result.current.refreshToken).toBe(null);
        window.localStorage.__proto__.getItem = jest.fn(()=>{
            return JSON.stringify({
                token: testingToken,
                refreshToken: testingRefreshToken
            })
        });
        const newHttp = renderHook(() => useAuth());
        expect(newHttp.result.current.token).toBe(testingToken);
        expect(newHttp.result.current.refreshToken).toBe(testingRefreshToken);
    })
    
    test('should save the token to localStorage', async () => {
        window.localStorage.__proto__.setItem = jest.fn();
        const { result } = renderHook(() => useAuth());
        expect(!!result.current.token).toBe(false);

        act(()=>{
            result.current.login(testingToken);

        })
        expect(!!result.current.token).toBe(true);
        expect(window.localStorage.__proto__.setItem).toBeCalledTimes(1);
        expect(window.localStorage.__proto__.setItem.mock.calls[0][1]).toContain('token');
    });

    test('should delete the token from localStorage', async () => {
        window.localStorage.__proto__.removeItem = jest.fn();
        const { result } = renderHook(() => useAuth());
        await act(async()=>{
        await result.current.login(testingToken);
        expect(result.current.token).toBe(testingToken);
        result.current.logout();
        })
        expect(window.localStorage.__proto__.removeItem).toBeCalledTimes(1);
        expect(!!result.current.token).toBe(false);
    });

    test('should set tokens to the state', async ()=>{
        const { result } = renderHook(() => useAuth());
        await act(async ()=>{
            await result.current.login(testingToken, testingRefreshToken);
        })
        expect(result.current.token).toBe(testingToken);
        expect(result.current.refreshToken).toBe(testingRefreshToken);
    })

    test('should refresh token', async ()=>{
        global.fetch = jest.fn()
        .mockReturnValueOnce(Promise.resolve({
            ok: true,
            json:() => Promise.resolve({
                "access":testingToken
            }),
        }))
        const { result } = renderHook(() => useAuth());
        let newToken;
        await act(async ()=>{
            newToken = await result.current.fetchRefreshToken();
        })
        expect(newToken).toBe(testingToken);
    })

    
  });
