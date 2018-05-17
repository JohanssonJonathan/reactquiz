import React, {Component} from 'react';
import Quiz from './quiz.js';

class Questions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clicked: true
    }
  }

  goBack = () => {
    console.log("hej")

    this.setState({clicked: false})
  }

  render() {
    const profile = this.props.profile;
    console.log(profile)
    if (!this.state.clicked) {
      return (<div>
        <Quiz profile={profile}/>
      </div>)
    }

    return (<div>QUESTIONS HERE
      <br/>
      <button onClick={this.goBack}>Back to Quiz Menu</button>
      <sportQuestions/>
    </div>)

  }

}

export default Questions;
