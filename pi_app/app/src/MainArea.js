import React, {Component} from 'react'
import Level from './Level'
import axios from 'axios'


class MainArea extends Component {

    constructor(props) {
        super(props);
        this.state = {
            levels: [],
            requestStatus: 'Request Assist'
        };
        this.userName = 'Pete Jones';
        this.idCounter = 0;
        this.userPic = "../user.jpg"
        console.log(this.state.levels);
        console.log("test");
    }


    componentDidMount() {
        this.addLevel();
    }

    getId() {
        return this.idCounter++;
    }

    addLevel() {
        let newLevels = this.state.levels.slice(0);
        newLevels.push({    id:this.getId(),
                            level: 0.0, //Flow rate for this monitor
                            height: 0.0, //Water height for this monitor
                            riverLabel: '',
                            riverName: ''
                        });
        this.setState({levels: newLevels});
    }

    requestAssist(){
        axios.post('http://localhost:8080/request_assist', {
            userName: this.userName
          })
        .then(function (response) {
            console.log('Assist Called:'+ response.data);
            this.state.requestStatus = "Request Called...";
            this.forceUpdate()
        });
    }

    deleteLevel() {
        let newLevels = this.state.levels.slice(0);
        let levelToDelete = newLevels.filter(level => level.id === newLevels.lendth-1)[0];
        newLevels.splice(newLevels.indexOf(levelToDelete), 1);
        this.setState({levles: newLevels});
    }

    render() {
        //<img className="assister" src={this.userPic} alt="Helper" height="42" width="42"></img>
        //<button className="add" onClick={this.requestAssist.bind(this)}>{this.requestStatus}</button>
        let {levels} = this.state;
        return (
            <div className="MainArea">
                <button className="add" onClick={this.requestAssist.bind(this)}>{this.state.requestStatus}</button>
                <div className="levels">
                    {levels.map(level => <Level key={level.id}
                                             onDelete={this.deleteLevel.bind(this, level.id)}>{level}</Level>)}
                </div>
            </div>
        );
    }

}

export default MainArea;