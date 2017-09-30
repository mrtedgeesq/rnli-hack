import React, {Component} from 'react'
import MainArea from './MainArea'

class App extends Component {
    render() {
        let {title, subtitle} = this.props;
        return (
            <div>
                <h1>{title}</h1>
                <p>{subtitle}</p>
                <hr/>
                <MainArea/>
            </div>
        );
    }
}

export default App;