import React, {Component} from 'react';
import './App.css';
import ControlPanel from "./control-panel/ControlPanel";
import FileZone from "./file-zone/FileZone";
import getMockText from './text.service';
import rgbToHex from './rgbToHex'

const initialSelectionStyles = {
    bold: false,
    italic: false,
    underline: false,
    color: '#000'
};

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            html: undefined,
            selectionStyles: {
                bold: false,
                italic: false,
                underline: false,
                color: '#000'
            },
            synonyms: [],
            isLoadingSynonyms: null,
        }
        this.textRef = React.createRef();
    }

    componentDidMount() {
        this.getText();
        document.addEventListener('selectionchange', this.onSelectionChange);
    }

    componentWillUnmount() {
        document.removeEventListener('selectionchange', this.onSelectionChange);
    }

    onSelectionChange = () => {
        const textElement = this.textRef.current && this.textRef.current.el &&this.textRef.current.el.current
        if (!textElement || document.activeElement !== textElement) {
            this.setState(prevState => ({
                selectionStyles: {
                    bold: false,
                    italic: false,
                    underline: false,
                    color: prevState.selectionStyles.color,
                }
            }))
            return
        }

        this.setState({
            selectionStyles: {
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
                underline: document.queryCommandState('underline'),
                color: rgbToHex(document.queryCommandValue('foreColor')),
            },
        });

        this.getSynonyms(window.getSelection().toString())
    }

    getSynonyms = async (txt) => {
        const trimmedText = txt.trim()
        const isMoreThanOneWord = Boolean(trimmedText.indexOf(' ') !== -1)
        if (isMoreThanOneWord) {
            this.setState({
                synonyms: [],
                isLoadingSynonyms: null,
            })
            return
        }

        const timestamp = new Date().getTime();
        this.setState({
            synonyms: [],
            isLoadingSynonyms: timestamp,
        })

        const response = await fetch(`https://api.datamuse.com/words?ml=${trimmedText}`)
        const data = await response.json()
        this.setState({
            isLoadingSynonyms: null,
            synonyms: data.filter(word => word.tags && word.tags[0] && word.tags[0] === 'syn')
        })
    }

    getText() {
        getMockText().then(result => {
            this.setState({
                html: result
            });
        });
    }

    saveChanges = html => {
        this.setState({
            html,
        });
    }

    runCommand = (command, value) => {
        if (command === 'foreColor') {
            this.setState(prevState => ({
                selectionStyles: {
                    ...prevState.selectionStyles,
                    color: value,
                }
            }))
        }
        document.execCommand(command, false, value);
        this.onSelectionChange()
    }

    replaceWord = word => {
        const sel = window.getSelection()
        if (sel.rangeCount) {
            const range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(word));
        }
    }

    render() {
        return (
            <div className="App">
                <header>
                    <span><b>Simple Text Editor</b></span>
                </header>
                <main>
                    <ControlPanel
                        runCommand={this.runCommand}
                        computedStyles={this.state.selectionStyles}
                        synonyms={this.state.synonyms}
                        replaceWord={this.replaceWord}
                    />
                    <FileZone ref={this.textRef} saveChanges={this.saveChanges} html={this.state.html} />
                </main>
            </div>
        );
    }
}

export default App;
