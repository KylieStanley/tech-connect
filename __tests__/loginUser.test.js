import { loginUser } from '../thunks/loginUser'
import { isLoading, hasErrored, logInUser } from '../actions'


describe('loginUser', () => {
  let mockDispatch
  let mockUserFetch
  let mockUser
  let mockUrl

  beforeEach(() => {
    mockUserFetch = {
      id: 2,
      attributes: {
        api_key: 1234 
      }
    }

    mockUser = {
      api_key: 1234,
      id: 2,
      email: 'email@email.com'
    }

    mockUrl = 'https://tech-connect-be.herokuapp.com/api/v1/users'
    mockDispatch = jest.fn()
  })

  it('should call dispatch with the isLoading action', () => {
    const thunk = loginUser()
    thunk(mockDispatch)
    expect(mockDispatch).toHaveBeenCalledWith(isLoading(true))
  })

  it('should dispatch hasErrored with a message if the response is not ok', async () => {
    window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      ok: false,
      json: () => Promise.resolve({
        errorText: 'error'
      })
    }))

    const thunk = loginUser()   

    await thunk(mockDispatch)

    expect(mockDispatch).toHaveBeenCalledWith(hasErrored(''))
  })

  it('should dispatch isLoading(false) if the response is ok', async () => {
    window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        data: mockUserFetch
      })
    }))

    const thunk = loginUser()

    await thunk(mockDispatch)

    expect(mockDispatch).toHaveBeenCalledWith(isLoading(false))
  })

  it('should dispatch loginUser if the response is ok', async () => {

    window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        data: mockUserFetch
      })
    }))

    const thunk = loginUser(mockUser)

    await thunk(mockDispatch)

    expect(mockDispatch).toHaveBeenCalledWith(logInUser(mockUser))
  })
})