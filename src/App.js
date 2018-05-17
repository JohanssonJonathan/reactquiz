import React, {Component} from 'react';
import './App.css';
import firebase, {auth, provider, authfb} from './firebase.js';
import ProfileComponent from './ProfileComponent.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: '',
      profile: {
        user: null,
        nickname: '',
        // email: '',
        uid: '',
        loggedIn: false,
        picture: "",
        correctAnswers: 0,
        failedAnswers: 0,
        ranking: 0
      },
      key: '',
      timeForQuiz: {}
    }
    this.handleChange = this.handleChange.bind(this);
    this.loginGoogle = this.loginGoogle.bind(this);
    this.loginFb = this.loginFb.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  loginGoogle() {

    const self = this;

    auth.signInWithPopup(provider).then((result) => {
      const user = result.user;
      const userRef = firebase.database().ref('users/');
      // let existingUsers = [];
      let doesItNotExist = true;

      // console.log(user)
      let currentUser = {
        nickname: user.displayName,
        profile: {
          nickname: user.displayName,
          // mail: user.email,
          uid: user.uid,
          photo: user.photoURL,
          correctAnswers: 0,
          failedAnswers: 0,
          ranking: 0,
          // place: 0
        }
      };

      userRef.once("value", function(snapshot) {

        let newArr;
        let data = snapshot.val();
        let userKey;

        // console.log(userRef.getKey())

        if (data === null) {
          userRef.push(currentUser)
          // console.log(data.key)
        } else {
          // let keys = Object.keys(data);
          for (let key in data) {
            // console.log(data[key])
            // console.log(data)
            if (data[key].profile.uid === user.uid) {
              // console.log(key)
              userKey = key;

              let rank;
              if (data[key].profile.correctAnswers === 0 && data[key].profile.failedAnswers === 0) {
                rank = 0;
              } else {
                let plus = data[key].profile.correctAnswers + data[key].profile.failedAnswers;
                rank = (data[key].profile.correctAnswers / plus) * 100
              }

              let arr = []
              for (let key in data) {

                let plus = data[key].profile.correctAnswers + data[key].profile.failedAnswers;
                let newVal = (data[key].profile.correctAnswers / plus) * 100
                if (isNaN(newVal)) {
                  // console.log(0)
                } else {
                  // console.log(newVal.toFixed(2))
                  arr.push({
                    nickname: data[key].profile.nickname,
                    ranking: Number(newVal.toFixed(2)),
                    numberOfQuestions: plus
                  })
                }
              }

              arr.sort(function(a, b) {
                return a.ranking - b.ranking
              })

              newArr = arr.reverse();
              // console.log(newArr)

              // let place = 0;
              // for (let i = 0; i < newArr.length; i++) {

              // if (newArr[i].nickname === data[key].profile.nickname) {
              // console.log(data[key].profile.nickname)
              // console.log(i + 1)
              //     place = i + 1
              //
              //   }
              // }

              currentUser = {
                nickname: data[key].profile.nickname,
                profile: {
                  nickname: data[key].profile.nickname,
                  // mail: data[key].profile.mail,
                  uid: data[key].profile.uid,
                  photo: data[key].profile.photo,
                  correctAnswers: data[key].profile.correctAnswers,
                  failedAnswers: data[key].profile.failedAnswers,
                  ranking: rank.toFixed(2),
                  // place: place
                }
              }
              doesItNotExist = false;
              break;
            }
          }

          if (doesItNotExist) {
            // console.log("user does not exist")
            // console.log(currentUser)
            let user = userRef.push(currentUser);
            userKey = user.getKey()
            // console.log(user.getKey())
            // this.setState({key: userKey})

          } else {}

        }

        updateVal(newArr, userKey)
      }) //userReef.once

      //this
      function updateVal(newArr, firebaseKey) {

        //this fel
        // console.log(newArr)

        self.setState({
          nickname: currentUser.profile.nickname,
          profile: {
            nickname: currentUser.profile.nickname,
            // mail: currentUser.profile.mail,
            uid: currentUser.profile.uid,
            photo: currentUser.profile.photo,
            loggedIn: true,
            correctAnswers: currentUser.profile.correctAnswers,
            failedAnswers: currentUser.profile.failedAnswers,
            ranking: currentUser.profile.ranking,
            // place: currentUser.profile.place
          },
          list: newArr,
          key: firebaseKey
        });

        // console.log(self.state)
      }

    }) //signInWithPopup
  } //loginGoogle

  loginFb() {
    const self = this;
    auth.signInWithPopup(authfb).then((result) => {
      const user = result.user;
      const userRef = firebase.database().ref('users/');
      // let existingUsers = [];
      let doesItNotExist = true;

      // console.log(user)
      let currentUser = {
        nickname: user.displayName,
        profile: {
          nickname: user.displayName,
          // mail: user.email,
          uid: user.uid,
          photo: user.photoURL,
          correctAnswers: 0,
          failedAnswers: 0,
          ranking: 0,
          // place: 0
        },
        list: []
      };

      userRef.once("value", function(snapshot) {
        let newArr;
        let data = snapshot.val();
        let userKey;
        if (data === null) {
          userRef.push(currentUser)

        } else {
          // let keys = Object.keys(data);
          for (let key in data) {
            if (data[key].profile.uid === user.uid) {
              userKey = key;

              let rank;
              if (data[key].profile.correctAnswers === 0 && data[key].profile.failedAnswers === 0) {
                rank = 0;
              } else {
                let plus = data[key].profile.correctAnswers + data[key].profile.failedAnswers;
                rank = (data[key].profile.correctAnswers / plus) * 100
              }

              let arr = []
              for (let key in data) {

                let plus = data[key].profile.correctAnswers + data[key].profile.failedAnswers;
                let newVal = (data[key].profile.correctAnswers / plus) * 100
                if (isNaN(newVal)) {
                  // console.log(0)
                } else {
                  // console.log(newVal.toFixed(2))
                  arr.push({
                    nickname: data[key].profile.nickname,
                    ranking: Number(newVal.toFixed(2)),
                    numberOfQuestions: plus
                  })
                }
              }

              arr.sort(function(a, b) {
                return a.ranking - b.ranking
              })

              newArr = arr.reverse();

              // console.log(newArr)
              // let place = 0;
              // for (let i = 0; i < newArr.length; i++) {
              //
              //   if (newArr[i].nickname === data[key].profile.nickname) {
              //      // console.log(data[key].profile.nickname)
              //
              //      // console.log(i + 1)
              //     place = i + 1
              //
              //   }
              // }
              // console.log(userKey)
              currentUser = {
                profile: {
                  nickname: data[key].profile.nickname,
                  // mail: data[key].profile.mail,
                  uid: data[key].profile.uid,
                  photo: data[key].profile.photo,
                  correctAnswers: data[key].profile.correctAnswers,
                  failedAnswers: data[key].profile.failedAnswers,
                  ranking: rank.toFixed(2),
                  // place: place
                }
              }
              doesItNotExist = false;
              break;
            }
          }

          if (doesItNotExist) {
            // console.log("user does not exist")
            // console.log(currentUser)
            let user = userRef.push(currentUser);
            userKey = user.getKey()
            // console.log(user.getKey())
          } else {}

        }

        updateVal(newArr, userKey)
      }) //userReef.once

      //this
      function updateVal(newArr, firebaseKey) {

        //this fel

        self.setState({
          nickname: currentUser.profile.nickname,
          profile: {
            nickname: currentUser.profile.nickname,
            // mail: currentUser.profile.mail,
            uid: currentUser.profile.uid,
            photo: currentUser.profile.photo,
            loggedIn: true,
            correctAnswers: currentUser.profile.correctAnswers,
            failedAnswers: currentUser.profile.failedAnswers,
            ranking: currentUser.profile.ranking,
            // place: currentUser.profile.place
          },
          list: newArr,
          key: firebaseKey
        });
      }

    })
  }

  componentDidMount() {}

  render() {
    // const profile = this.props.profile;

    if (this.state.profile.loggedIn !== false) {
      return (<div>
        <ProfileComponent profile={this.state.profile} list={this.state.list} firebaseKey={this.state.key} nickname={this.state.nickname}/>
      </div>)
    }
    return (<div className="App">
      <div className="ruta"></div>
      <div className="info">
        <span className="timequiz">Time for quiz</span>
      </div>
      <div className="wrapper"></div>
      <div className="socialamedierLogIn">
        <i className="fab fa-google-plus-square btnFb" onClick={this.loginGoogle}></i>
        <i className="fab fa-facebook btnFb" onClick={this.loginFb}></i>
      </div>
    </div>)
  }
}

export default App;
