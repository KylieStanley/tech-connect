import React from 'react'
import { SearchScreen, mapStateToProps } from '../SearchScreen'
import { shallow, mount } from 'enzyme'
import { Input } from 'react-native-elements'
import { SearchBar, ButtonGroup } from 'react-native-elements'
import { getAllUsers, getUsersFilter } from '../apiCalls'
import { ActivityIndicator, Text } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { LinearGradient } from 'expo'



const mockUsers = [{name: 'Kaylee'}, {name: 'Kylie'}]
jest.mock('../apiCalls')
getAllUsers.mockImplementation(() => mockUsers)
getUsersFilter.mockImplementation(() => mockUsers)


import renderer from 'react-test-renderer'


describe('SearchScreen', () => {
  let wrapper
  let onPressEvent
  let navigation

  beforeEach(() => {
    navigation = { navigate: jest.fn() };
    onPressEvent = jest.fn()
    wrapper = shallow(<SearchScreen user={{api_key: 1234}} updateUser={jest.fn()} navigation={navigation} />)
  })

  it('should match the snapshot', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('renders the snapshot', () => {
    const tree = renderer.create(
      <SearchScreen />
      ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should get all users when loaded and set it in state', () => {
    wrapper.instance().componentDidMount()
    expect(getAllUsers).toHaveBeenCalled()
  })


  it('should set state of allUSers', async () => {
    await wrapper.instance().componentDidMount()
    expect(wrapper.instance().state.allUsers).toEqual(mockUsers)
    expect(wrapper.instance().state.loading).toEqual(false)
  })

  it('should update the selected index when a button in the group is pressed', () => {
    const spy = jest.spyOn(wrapper.instance(), 'updateIndex')
    wrapper.instance().forceUpdate()
    wrapper.find(ButtonGroup).simulate('press')
    expect(spy).toHaveBeenCalled()
  })

  it('should set the search string in state on change of the input', () => {
    wrapper.find(SearchBar).simulate('changeText', 'Backend')
    wrapper.instance().forceUpdate()
    expect(wrapper.instance().state.search).toEqual('Backend')
  })

  it('should display the activity indicator if the results are loading', () => {
    expect(wrapper.find(ActivityIndicator).length).toBe(1)
  })

  it('should get the user info when viewProfile is called', () => {
    wrapper.instance().viewProfile()
    expect(getAllUsers).toHaveBeenCalled()
  })

  it('should navigate to the Profile page for the user when clicked', async () => {
    await wrapper.instance().viewProfile()
    expect(wrapper.instance().props.navigation.navigate).toHaveBeenCalled()
  })

  it('should update the index on call of updateIndex', () => {
    wrapper.instance().updateIndex(1)
    expect(wrapper.instance().state.selectedIndex).toEqual(1)
  })

  it('should set the state of allUsers to empty and loading to true on getFilteredUsers', async () => {
    wrapper.instance().getFilteredUsers()
    expect(wrapper.instance().state.loading).toEqual(true)
    expect(wrapper.instance().state.allUsers).toEqual([])
    await getUsersFilter()
    expect(wrapper.instance().state.allUsers).toEqual(mockUsers)
    expect(wrapper.instance().state.loading).toEqual(false)
  })

  it('should set the state of allUsers to empty and loading to true on getFilteredUsers', () => {
    wrapper.instance().getFilteredUsers()
    expect(wrapper.instance().state.loading).toEqual(true)
    expect(wrapper.instance().state.allUsers).toEqual([])
  })

  it('should call getUsersFilter on search', () => {
    wrapper.instance().getFilteredUsers()
    expect(getUsersFilter).toHaveBeenCalled()
  })

  it('should display no users found if there are no users', () => {
    wrapper.instance().setState({ loading: false, allUsers: []})
    expect(wrapper.find(Text).length).toEqual(2)
    expect(wrapper.find(Text).at(1).props().children).toEqual('No users were found.')
  })

  it('should display no users found if there are no users', () => {
    wrapper.instance().setState({ loading: false, allUsers: mockUsers})
    expect(wrapper.find(Text).length).toEqual(1)
  })

  it('should update the selected index when a button in the group is pressed', () => {
    const spy = jest.spyOn(wrapper.instance(), 'getFilteredUsers')
    wrapper.instance().forceUpdate()
    wrapper = mount(<SearchScreen user={{api_key: 1234}} updateUser={jest.fn()} navigation={navigation} />)
    console.log(wrapper)
    // const Search = wrapper.find(SearchBar)
    // console.log(Search.prop('searchIcon'))
    // console.log(wrapper.find(SearchBar).props().searchIcon)
    // Search.prop('searchIcon')).find(Icon)
    // wrapper.find(SearchBar).props().searchIcon
    expect(spy).toHaveBeenCalled()
  })

   // it('should call the search function on press of the icon', () => {
   //  // wrapper.find(SearchBar.props().searchIcon).simulate('press')
   //  const spy = jest.spyOn(wrapper.instance(), 'getFilteredUsers')
   //  wrapper.instance().forceUpdate()
   //  wrapper.find(Icon).simulate('press')
   //  expect(spy).toHaveBeenCalled()
   // })

  describe('mapStateToProps', () => {
    it('should return a user object', () => {
      const mockState = {
        user: { name: 'Kylie' },
        connections: { name: 'Bob' },
        isLoading: false,
        error: ''
      }
      const expected = { user: mockState.user }
      const result = mapStateToProps(mockState)
      expect(result).toEqual(expected)
    })
  })
})
