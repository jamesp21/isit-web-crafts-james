import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import 'whatwg-fetch';

const styles = {
    customWidth: {
        width: 500,
    },
};

//const items = [];
const siteDirs = [];
const destDirs = [];

class MakeHtmlDropDowns extends React.Component {

    constructor() {
        super();

        this.state = {
            makeImage: 'Make Image',
            makeHtml: 'Make HTML',
            value: 1,
            walk: 'Generate HTML',
            siteDir: 'unknown',
            destDir: 'unknown',
            configSummary: []
        };
        this.handleSiteDir = this.handleSiteDir.bind(this);
        this.handleDestinationDir = this.handleDestinationDir.bind(this);
    }

    handleSiteDir(event, index, value) {
        this.setState({value: value,
            siteDir: event.target.innerHTML,
            destDir: destDirs[value].props.primaryText});

    }

    handleDestinationDir(event, index, value) {
        this.setState({
            value: value,
            siteDir: event.target.innerHTML,
            destDir: destDirs[values].props.primaryText
        });
    }

    /**
     * @typedef {Object} configSummary
     * @property {Object} siteDirs
     * @property {Object} destinationDirs
     * @property {String} baseDir
     * @property {String} mostRecentDate
     */
    loadConfig = () => {
        const that = this;
        fetch('/makers/config')
            .then(function (response) {
                return response.json();
            })
            .then(function (configSummary) {
                //console.log('parsed json', JSON.stringify(configSummary, null, 4));
                siteDirs.length = 0;
                configSummary.siteDirs.forEach(function (dir, index) {
                    const showDir = configSummary.baseDir + dir;
                    siteDirs.push(<MenuItem value={index} key={index} primaryText={showDir} />);
                });
                configSummary.destinationDirs.forEach(function (dir, index) {
                    const showDir = configSummary.baseDir + dir;
                    destDirs.push(<MenuItem value={index} key={index} primaryText={showDir} />);
                });
            })
            .catch(function (ex) {
                console.log('parsing failed', ex);
            });
    }

    generateHtml = () => {
        console.log(this.state.value);
        console.log(siteDirs[this.state.value]);
        //walking.runWalkReact('qSingle', this.state.siteDir, this.state.destDir);
        const query = '/makers/walk';//?siteDirsIndex=' + this.state.value;
        var that = this;
        console.log('hi');
        fetch(query)
            .then(function(response) {
                return response.json();
            })
            .then(function(configSummary) {
                console.log(JSON.stringify(configSummary, null, 4));
                this.state.configSummary.push(configSummary.htmlFilesWritten);
            })
            .catch(function(ex) {
                console.log('parsing failed', ex);
            });
    }

    componentDidMount = () => {
        this.loadConfig();
    }

    render() {
        return <MuiThemeProvider>
            <div>
                <h1>Home Page</h1>
                <DropDownMenu
                    value={this.state.value}
                    onChange={this.handleSiteDir}
                    style={styles.customWidth}
                    autoWidth={false}
                >
                    {siteDirs}
                </DropDownMenu>
                <DropDownMenu
                    value={this.state.value}
                    onChange={this.handleDestinationDir}
                    style={styles.customWidth}
                    autoWidth={false}
                >
                    {destDirs}
                </DropDownMenu>
                <p>This is a DropDown component.</p>

                <RaisedButton
                    id="generateButton"
                    style={buttonStyle}
                    primary={true}
                    onClick={this.generateHtml}>{this.state.walk}</RaisedButton>
                <pre>{this.state.configSummary[0]}</pre>
            </div>
        </MuiThemeProvider>
    };
};

var buttonStyle = {
    margin: '15px'
};

export default MakeHtmlDropDowns;