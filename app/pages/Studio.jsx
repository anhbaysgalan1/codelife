import React, {Component} from "react";
import {translate} from "react-i18next";
import Nav from "components/Nav";
//import AceEditor from "react-ace";

//import "brace/mode/html";
//import "brace/theme/monokai"

// Studio Page
// Test zone for inline code editing

const Editor = (props) => {
  console.log(window);
  if (typeof window !== 'undefined') {
    const Ace = require('react-ace').default;
    require('brace/mode/html');
    require('brace/theme/monokai');

    return <Ace {...props}/>
  }
  return null;
}

class Studio extends Component {

  state = {mounted: false, output: ""};

  componentDidMount() {
    this.setState({mounted: true});
  }

  onChange(theText) {
    this.setState({output: theText});
  }
  
  render() {
    
    const {t} = this.props;

    return (
      <div>
        <h1>{ t("Studio") }</h1>
        <div style={{width:"1200px"}}>
          <div style={{float:"left", width:"450px"}}>
          { this.state.mounted ? <Editor mode="html" theme="monokai" onChange={this.onChange.bind(this)} value={this.state.output}/> : null }
          </div>
          <div style={{float:"right", border:"solid 1px black", width: "650px", height: "400px"}} dangerouslySetInnerHTML={ {__html: this.state.output } } />
        </div>
        <div style={{clear:"both"}}>
        <Nav />
        </div>
      </div>

    );
  }
}

export default translate()(Studio);
