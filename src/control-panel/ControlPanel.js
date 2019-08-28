import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './ControlPanel.css';

class ControlPanel extends Component {
    makeBold = (e) => {
        e.preventDefault()
        this.props.runCommand('bold')
    }

    makeItalic = (e) => {
        e.preventDefault()
        this.props.runCommand('italic')
    }

    makeUnderline = (e) => {
        e.preventDefault()
        this.props.runCommand('underline')
    }

    makeIndent = (e) => {
        e.preventDefault()
        this.props.runCommand('indent')
    }

    makeOutdent = (e) => {
        e.preventDefault()
        this.props.runCommand('outdent')
    }

    makeColor = (e) => {
        e.preventDefault()
        this.props.runCommand('foreColor', e.target.value)
    }

    render() {
        return (
            <div id="control-panel">
                <div id="format-actions">
                    <button
                        onMouseDown={this.makeBold}
                        className={`format-action ${this.props.computedStyles.bold && 'format-active'}`}
                        type="button"
                    >
                        <b>B</b>
                    </button>
                    <button
                        onMouseDown={this.makeItalic}
                        className={`format-action ${this.props.computedStyles.italic && 'format-active'}`}
                        type="button"
                    >
                        <i>I</i>
                    </button>
                    <button
                        onMouseDown={this.makeUnderline}
                        className={`format-action ${this.props.computedStyles.underline && 'format-active'}`}
                        type="button"
                    >
                        <u>U</u>
                    </button>
                    <button onMouseDown={this.makeIndent} className="format-action" type="button">»</button>
                    <button onMouseDown={this.makeOutdent} className="format-action" type="button">«</button>
                    <input className="format-action" value={this.props.computedStyles.color} onChange={this.makeColor} type="color" />
                </div>
                <ul id="synonyms">
                    {this.props.synonyms.map(synonym => (
                        <li
                            onMouseDown={e => {
                                e.preventDefault()
                                this.props.replaceWord(synonym.word)
                            }}
                            key={synonym.word}
                        >
                            {synonym.word}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

ControlPanel.propTypes = {
    runCommand: PropTypes.func.isRequired,
    computedStyles: PropTypes.shape({
        bold: PropTypes.bool,
        italic: PropTypes.bool,
        underline: PropTypes.bool,
        color: PropTypes.string,
    }).isRequired,
    synonyms: PropTypes.arrayOf(
        PropTypes.shape({
            word: PropTypes.string.isRequired,
        })
    ).isRequired,
    replaceWord: PropTypes.func.isRequired,
};

export default ControlPanel;
