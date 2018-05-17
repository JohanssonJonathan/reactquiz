import React, {Component} from 'react';
import firebase from './firebase.js';
import AddQuestionsFiction from './AddQuestionsFiction.js';
import ProfileComponent from './ProfileComponent.js';
import Quiz from './quiz.js';
import "./App.css"
import "./quiz.css"

class FictionQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: true,
      scorePage: false,
      topPlayers: '',
      writeQuestion: true,
      backToProfile: true,
      backToQuiz: true,
      timeLeft: 30,
      isPlaying: false,
      tenQuestions: [],
      backgroundA: "",
      backgroundB: "",
      backgroundC: "",
      backgroundD: "",
      currentQuestion: 0,
      lastVal: "",
      totalAnswers: [],
      totalCorrectAnswers: 0,
      totalFailedAnswers: 0,
      nickname: this.props.nickname,
      handleChange:true,
      divClass : "Row",
      profile : {},
      wichState:true,
      disabledBtn: '',
      displayPlay: "show",
      displayCreate: "showCreate"
    }
      this.clickedButton = this.clickedButton.bind(this);
      this.startTimer = this.startTimer.bind(this);
      this.resetTimer = this.resetTimer.bind(this);
      this.stopTimer = this.stopTimer.bind(this);
  }

  // sendQuestion = () => {
  //   this.setState({clicked: false})
  //   const questionRef = firebase.database().ref('questions/genre/sport/');
  //   let theQuestions;
  //   questionRef.once("value", function(snapshot) {
  //     questionRef.push(theQuestions)
  //   });
  // }

  getQuestions = () => {

    if(this.state.displayPlay === "show"){
      this.setState({
        displayPlay:"none"
      })
    }else{

      this.setState({
        displayPlay:"show"
      })
    }

    if(this.state.displayCreate === "showCreate"){
      this.setState({
        displayCreate:"noneCreate"
      })
    }else{
      this.setState({
        displayCreate:"showCreate"
      })
    }
      this.startTimer()
    this.setState({clicked: false, currentQuestion: 0, totalCorrectAnswers: 0, totalFailedAnswers: 0, handleChange:false, wichState:false})

    let fictionQuestions = [];
    let ten = [];
    let self = this;
    var ref = firebase.database().ref("questions/genre/fiction/");
    ref.once("value", function(snapshot) {
      let obj = snapshot.val()
      for (let element in obj) {

        fictionQuestions.push(obj[element])
      }

      shuffleArray(fictionQuestions)
      function shuffleArray(fictionQuestions) {

        for (let i = fictionQuestions.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [fictionQuestions[i], fictionQuestions[j]] = [fictionQuestions[j], fictionQuestions[i]];
        }
      }
      for (let y = 0; y < 10; y++) {
        ten.push(fictionQuestions[y])
      }
      putState(ten)
    }, function(error) {
    });

    function putState(ten) {
      self.setState({tenQuestions: ten})

    }

      this.setState({
      isButtonDisabled: true
    });

  }

  componentDidUpdate() {



    if (this.state.currentQuestion === 10 && this.state.totalAnswers.length === 10) {

      this.setState({
        displayPlay:"show",
        displayCreate:"showCreate"
      })
      let correct = 0;
      let wrong = 0;

      for (let i = 0; i < this.state.totalAnswers.length; i++) {
        if (this.state.totalAnswers[i] === true) {
          correct++
        } else {
          wrong++
        }
      }

      let rank;

      let databaseCorrect;
      let databaseWrong;
      let self = this;

      firebase.database().ref('users/' + this.props.firebaseKey).once("value", function(snapshot) {
        let Obj = snapshot.val();

        databaseCorrect = Obj.profile.correctAnswers;
        databaseWrong = Obj.profile.failedAnswers;


        function loopFunc(val) {
          firebase.database().ref('users/').once("value", function(snapshot) {

            let helaDatabasen = snapshot.val()
            // let newArr;
            let arr = []

            for (let element in helaDatabasen) {
              let namn = helaDatabasen[element].profile.nickname
              let profilen = helaDatabasen[element].profile.ranking
              // let length = helaDatabasen[element].profile.ranking.length
              arr.push({nickname: namn, ranking: Number(profilen)})
            }

            arr.sort(function(a, b) {
              return a.ranking - b.ranking
            })

            // newArr = arr.reverse();
            // let place = 0;
            // for (let element in helaDatabasen) {
            //   for (let i = 0; i < newArr.length; i++) {
            //     if (newArr[i].nickname === helaDatabasen[element].profile.nickname) {
            //       place = i + 1
            //     }
            //   }
            // }
            function callback(){
              self.setState({
                  handleChange:true,
                  nickname: self.state.nickname,
                  profile: {
                    nickname: self.state.nickname,
                    photo: self.props.profile.photo,
                    correctAnswers: databaseCorrect + correct,
                    failedAnswers: databaseWrong + wrong,
                    uid: self.props.profile.uid,
                    ranking: rank.toFixed(2),
                    // place: place,
                  }
              })
            }
              if(val === "finnsInte"){
                let plus = correct + wrong;
                rank = (correct / plus) * 100;
                firebase.database().ref('users/' + self.props.firebaseKey).set({
                  nickname: self.state.nickname,
                  profile: {
                    // nickname: self.state.nickname,
                    photo: self.props.profile.photo,
                    correctAnswers: databaseCorrect + correct,
                    failedAnswers: databaseWrong + wrong,
                    uid: self.props.profile.uid,
                    ranking: rank.toFixed(2),
                    // place: place,
                  }
                },callback());
              }else{
                let totalCorrect = databaseCorrect + correct;
                let totalFail = databaseWrong + wrong;
                let plus = totalCorrect + totalFail;
                rank = (totalCorrect / plus) * 100

                firebase.database().ref('users/' + self.props.firebaseKey + "/").set({
                  nickname: self.props.nickname,
                  profile: {
                    nickname: self.props.nickname,
                    photo: self.props.profile.photo,
                    correctAnswers: databaseCorrect + correct,
                    failedAnswers: databaseWrong + wrong,
                    uid: self.props.profile.uid,
                    ranking: rank.toFixed(2),
                    // place: place,
                  }

                },callback());
              }
          })
        }
        if (databaseCorrect === 0 && databaseWrong === 0) {
          loopFunc("finnsInte")
        } else {
          loopFunc()
        }
      })
      this.setState({totalCorrectAnswers: correct, totalFailedAnswers: wrong, totalAnswers: []})

        this.setState({
            isButtonDisabled: false
    });
    }
  }




  clickedButton(val, correctAnswer) {

    switch (val) {
        case "a":
        this.setState({backgroundA: "bgColor", backgroundB: "", backgroundC: "", backgroundD: "", lastVal: "a", disabledBtn: "true"})
        break;
        case "b":
        this.setState({backgroundA: "", backgroundB: "bgColor", backgroundC: "", backgroundD: "", lastVal: "b", disabledBtn: "true"})
        break;
        case "c":
        this.setState({backgroundA: "", backgroundB: "", backgroundC: "bgColor", backgroundD: "", lastVal: "c", disabledBtn: "true"})
        break;
        case "d":
        this.setState({backgroundA: "", backgroundB: "", backgroundC: "", backgroundD: "bgColor", lastVal: "d", disabledBtn: "true"})
        break;
        default:
    }
if(this.state.timeLeft === 0){
            this.setState({
          currentQuestion: this.state.currentQuestion + 1,
          backgroundA: "",
          backgroundB: "",
          backgroundC: "",
          backgroundD: "",
          divClass: "Row",
          disabledBtn: ""
        })

        }
    if (this.state.backgroundA !== "" || this.state.backgroundB !== "" || this.state.backgroundC !== "" || this.state.backgroundD !== "") {
      if (val === "next" && this.state.timeLeft > 0) {

        if (this.state.lastVal === correctAnswer) {
          this.state.totalAnswers.push(true)
        } else {
          this.state.totalAnswers.push(false)
        }

        this.setState({
          currentQuestion: this.state.currentQuestion + 1,
          backgroundA: "",
          backgroundB: "",
          backgroundC: "",
          backgroundD: "",
          disabledBtn: ""
        })
      }
    }
  }
  tick() {
    this.setState({
      timeLeft: this.state.timeLeft - 1
    });
    if(this.state.timeLeft === 0) {
      this.setState({
          divClass: "Row li, disabled",
          disabledBtn: "true"
      })
     this.stopTimer();
     this.state.totalAnswers.push(false)
    }
      if(this.state.currentQuestion === 10){
        this.stopTimer();
      }
      // else if(this.state.writeQuestion === false){
      //   this.stopTimer();
      // }
  }
  startTimer() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
    this.setState({
      isPlaying: true
    });

  }
resetTimer() {
  clearInterval(this.timerID);
    this.setState({
      timeLeft: 30
    });
}
stopTimer() {
  clearInterval(this.timerID);
    this.setState({
      isPlaying: false
    });
}


  writeQuestion = () => {
    if(this.state.wichState){

      this.setState({
        writeQuestion: false,
        nickname: this.props.nickname,
        profile: {
          nickname: this.props.profile.nickname,
          photo: this.props.profile.photo,
          correctAnswers: this.props.profile.correctAnswers,
          failedAnswers: this.props.profile.failedAnswers,
          uid: this.props.profile.uid,
          ranking: this.props.profile.ranking,
          // place: this.props.profile.place,
        }
      })
    }else{

      this.setState({
        writeQuestion: false,
        nickname: this.state.nickname,
        profile: {
          nickname: this.state.profile.nickname,
          photo: this.state.profile.photo,
          correctAnswers: this.state.profile.correctAnswers,
          failedAnswers: this.state.profile.failedAnswers,
          uid: this.state.profile.uid,
          ranking: this.state.profile.ranking,
          // place: this.state.profile.place,
        }
      })
    }
  }
  backToQuiz = () => {
    if(this.state.wichState){

      this.setState({
        backToQuiz: false,
        nickname: this.props.nickname,
        profile: {
          nickname: this.props.profile.nickname,
          photo: this.props.profile.photo,
          correctAnswers: this.props.profile.correctAnswers,
          failedAnswers: this.props.profile.failedAnswers,
          uid: this.props.profile.uid,
          ranking: this.props.profile.ranking,
          // place: this.props.profile.place,
        }
      })
    }else{

      this.setState({
        backToQuiz: false,
        nickname: this.state.nickname,
        profile: {
          nickname: this.state.profile.nickname,
          photo: this.state.profile.photo,
          correctAnswers: this.state.profile.correctAnswers,
          failedAnswers: this.state.profile.failedAnswers,
          uid: this.state.profile.uid,
          ranking: this.state.profile.ranking,
          // place: this.state.profile.place,
        }
      })
    }
  }

  backToProfile = () => {

    if(this.state.wichState){

      this.setState({
        backToProfile: false,
        nickname: this.props.nickname,
        profile: {
          nickname: this.props.profile.nickname,
          photo: this.props.profile.photo,
          correctAnswers: this.props.profile.correctAnswers,
          failedAnswers: this.props.profile.failedAnswers,
          uid: this.props.profile.uid,
          ranking: this.props.profile.ranking,
          // place: this.props.profile.place,
        }
      })
    }else{

      this.setState({
        backToProfile: false,
        nickname: this.state.nickname,
        profile: {
          nickname: this.state.profile.nickname,
          photo: this.state.profile.photo,
          correctAnswers: this.state.profile.correctAnswers,
          failedAnswers: this.state.profile.failedAnswers,
          uid: this.state.profile.uid,
          ranking: this.state.profile.ranking,
          // place: this.state.profile.place,
        }
      })
    }
  }

  enterHigscore = (val) => {
    console.log("hej")


    if(val === "showHigscore"){
      this.stopTimer();

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
        this.setState({topPlayers: highScoreList, scorePage:true});



      });
    }else{

      this.setState({scorePage:false})
      this.startTimer()
    }


  }

  render() {
    // const isPlaying = this.state.isPlaying;
    // let sportQuestions = [];

    let topTen = [];
    for (let i = 0; i < this.state.topPlayers.length; i++) {
      topTen.push(this.state.topPlayers[i])
    }

    if (!this.state.backToProfile) {
      return (<div>
        <ProfileComponent firebaseKey={this.props.firebaseKey} profile={this.state.profile} nickname={this.state.nickname} />
      </div>)
    }

    if (!this.state.writeQuestion) {
      return (<div>
        <AddQuestionsFiction profile={this.state.profile} nickname={this.state.nickname} firebaseKey={this.props.firebaseKey}/>
      </div>)
    }
    if (!this.state.backToQuiz) {
      return (<div>
        <Quiz profile={this.state.profile} nickname={this.state.nickname} firebaseKey={this.props.firebaseKey}/>
      </div>)
    }
    return (<div className="fictionQuestion">
      <div className="category">
       <button  onClick={this.writeQuestion} className={"fictionCreate " +this.state.displayCreate }>Create question</button>
       <button onClick={this.backToQuiz}  className={"fictionCreate " +this.state.displayCreate }>Back to quizzes</button>
    </div>
        {(this.state.handleChange === true)
          ?
          <div>
          <div className="profilePosition">
          <div className="quizDiv">
            <div onClick={this.backToProfile} profile={this.props.profile}>
              <h3>{this.state.nickname}</h3>
                <img src={this.props.profile.photo + "?width=999"} alt=" "/>
            </div>
          </div>
          </div>
          </div>
          :
          <div></div>
        }


        <div className={this.state.displayPlay}>


          <div   onClick={this.getQuestions}>
            <button id="startFic">
            Start quiz
            </button>
          </div>
        </div>
      <div>
        {
          (this.state.tenQuestions[this.state.currentQuestion] !== undefined  && this.state.scorePage === false)
            ?
            <div>
            <div className="buttons">
              <button className="btn" onClick={e => this.enterHigscore("showHigscore")}>Highscore</button>
            </div>
              <div className="question">

                <h2>{this.state.tenQuestions[this.state.currentQuestion].Question}</h2>
                <ul>

                  <div className={this.state.divClass}>
                    <li id={this.state.backgroundA} onClick={e => this.clickedButton('a', this.state.tenQuestions[this.state.currentQuestion].correctAnswer)}>{this.state.tenQuestions[this.state.currentQuestion].answers.a}</li>
                    <li id={this.state.backgroundB} onClick={e => this.clickedButton('b', this.state.tenQuestions[this.state.currentQuestion].correctAnswer)}>{this.state.tenQuestions[this.state.currentQuestion].answers.b}</li>
                  </div>
                  <div className={this.state.divClass}>
                    <li id={this.state.backgroundC} onClick={e => this.clickedButton('c', this.state.tenQuestions[this.state.currentQuestion].correctAnswer)}>{this.state.tenQuestions[this.state.currentQuestion].answers.c}</li>
                    <li id={this.state.backgroundD} onClick={e => this.clickedButton('d', this.state.tenQuestions[this.state.currentQuestion].correctAnswer)}>{this.state.tenQuestions[this.state.currentQuestion].answers.d}</li>
                  </div>
                </ul>
                <button className="nextbtn" onClick={e => this.clickedButton("next", this.state.tenQuestions[this.state.currentQuestion].correctAnswer, this.resetTimer(), this.startTimer())} disabled={!this.state.disabledBtn}>Next question</button>
                <br/>
                <div className="timeAndCurrentQ">
                <div>Question: {this.state.currentQuestion + 1}/10</div>
                <div>Time remaining: { this.state.timeLeft}</div>
                </div>
              </div>
            </div>
            : <div></div>
        }
        {(this.state.scorePage)
          ?
          <div>

          <div className="buttons">
            <button className="btn" onClick={e => this.enterHigscore("profile")}>Continue quiz</button>
          </div>
            <div className="container">
              <h1 className="headerForTopPlayers">Top players</h1>
            </div>
            <div className="container">
              <ol className="topPlayers">
                {topTen.map(d => <li key={d.nickname}>{d.nickname + " - " + d.ranking + "%"}</li>)}
              </ol>
            </div>
          </div>
          :
          <div></div>
        }
        {
          (this.state.currentQuestion === 10)
            ? <div className="answersAll">
                <h2>You got {this.state.totalCorrectAnswers} correct answers. And {this.state.totalFailedAnswers} wrong ones.</h2>
                <h2>Everything will be updated at your profile</h2>
              </div>
            : <div></div>

        }

      </div>

    </div>)
  }

}

export default FictionQuestions;
