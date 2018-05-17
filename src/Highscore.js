import React, {Component} from 'react';
import firebase from './firebase.js';
import ProfileComponent from './ProfileComponent.js';
import './Highscore.css';
import SportQuestions from './sportQuestions.js';

class Highscore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: true,
      quizClicked:true,
      topPlayers: '',
      key: this.props.firebaseKey,
    }
  }
  goBack = (val) => {
    if(val === "quiz"){
      this.setState({quizClicked: false})
    }else{
      this.setState({clicked: false})

    }
  }
  componentDidMount() {
    console.log(this.state)
    console.log(this.props)
    let highScoreList = [];
    firebase.database().ref('users/').once("value", snapshot => {
      highScoreList = [];
      // let self = this;
      snapshot.forEach(function(childSnapshot) {
        // let childKey = childSnapshot.key;
        let childData = childSnapshot.val();
        let highScoreUser = {
          nickname: childData.profile.nickname,
          ranking: childData.profile.ranking,
        }
        highScoreList.push(highScoreUser);
      })
      function compare(a, b) {
        if (a.ranking < b.ranking)
          return -1;
        if (a.ranking > b.ranking)
          return 1;
        return 0;
      }
      highScoreList.sort(compare);
      highScoreList.reverse();
      this.setState({topPlayers: highScoreList});
    });
  }
  render() {

    const profile = this.props.profile;
    let topTen = [];
    for (let i = 0; i < this.state.topPlayers.length; i++) {
      topTen.push(this.state.topPlayers[i])
    }
    if (!this.state.clicked) {
      return (<div>
        <ProfileComponent profile={profile} list={this.state.topPlayers} firebaseKey={this.props.firebaseKey} nickname={this.props.nickname}/>
      </div>)
    }else if(!this.state.quizClicked){

      return (<div>
          <SportQuestions fromWhatPage={"highscore"} />
        </div>
      )

    } else {
      return (<div>

          <div className="buttons">
            <button className="btn" onClick={e => this.goBack("profile")}>Back to profile</button>
          </div>
        

        <div className="container">
        <h1 className="headerForTopPlayers">Top players</h1>
        </div>
        <div className="container">
        <ol className="topPlayers">
          {topTen.map(d => <li key={d.nickname}>{d.nickname + " - " + d.ranking + "%"}</li>)}
        </ol>
        </div>
      </div>)

    }
  }
}

export default Highscore;
