import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './FileZone.css';
import ContentEditable from 'react-contenteditable';

class FileZone extends PureComponent {
    render() {
        return (
            <div id="file-zone">
                <div id="file">
                    {typeof this.props.html !== 'undefined' && (
                        <ContentEditable
                            html={this.props.html}
                            ref={this.props.forwardedRef}
                            style={{
                                height: '100%',
                                whiteSpace: 'pre-wrap',
                            }}
                            tagName="pre"
                        />
                    )}
                </div>
            </div>
        );
    }
}

FileZone.propTypes = {
    saveChanges: PropTypes.func.isRequired,
    forwardedRef: PropTypes.shape({
        current: PropTypes.any,
    }),
    html: PropTypes.string,
};

export default React.forwardRef((props, ref) => {
    return <FileZone {...props} forwardedRef={ref} />;
  });
