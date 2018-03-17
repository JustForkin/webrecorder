import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RichTextEditor, { createValueFromString } from 'react-rte/lib/RichTextEditor';
import ButtonGroup from 'react-rte/lib/ui/ButtonGroup';
import IconButton from 'react-rte/lib/ui/IconButton';
import { Button } from 'react-bootstrap';

import './style.scss';


class WYSIWYG extends Component {

  static contextTypes = {
    canAdmin: PropTypes.bool
  };

  static propTypes = {
    cancel: PropTypes.func,
    editMode: PropTypes.bool,
    initial: PropTypes.string,
    minimal: PropTypes.bool,
    save: PropTypes.func,
    success: PropTypes.bool
  };

  static defaultProps = {
    minimal: false
  };

  constructor(props) {
    super(props);

    const extraElements = ['BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'IMAGE_BUTTON', 'HISTORY_BUTTONS'];
    const displayItems = [
      'INLINE_STYLE_BUTTONS',
      'BLOCK_TYPE_DROPDOWN'
    ];

    if (!props.minimal) {
      displayItems.splice(2, 0, ...extraElements);
    }

    this.method = 'markdown';
    this.editorConf = {
      display: displayItems,
      INLINE_STYLE_BUTTONS: [
        { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
        { label: 'Italic', style: 'ITALIC' },
        { label: 'Underline', style: 'UNDERLINE' },
        { label: 'Strikethrough', style: 'STRIKETHROUGH' }
      ],
      BLOCK_TYPE_DROPDOWN: [
        { label: 'Normal', style: 'unstyled' },
        { label: 'Heading Large', style: 'header-one' },
        { label: 'Heading Medium', style: 'header-two' },
        { label: 'Heading Small', style: 'header-three' },
        { label: 'Code Block', style: 'code-block' }
      ],
      BLOCK_TYPE_BUTTONS: [
        { label: 'UL', style: 'unordered-list-item' },
        { label: 'OL', style: 'ordered-list-item' },
        { label: 'Blockquote', style: 'blockquote' }
      ]
    };

    this.state = {
      renderable: false,
      editorState: createValueFromString(this.props.initial, this.method),
      markdownEdit: false
    };
  }

  componentDidMount() {
    this.setState({ renderable: true });
  }

  onChange = editorState => this.setState({ editorState })

  _onChangeSource = (event) => {
    const source = event.target.value;
    const oldValue = this.state.editorState;
    this.setState({
      editorState: oldValue.setContentFromString(source, this.method),
    });
  }

  _save = () => this.props.save(this.state.editorState.toString(this.method))

  render() {
    const { canAdmin } = this.context;
    const { editMode } = this.props;
    const { editorState, renderable } = this.state;

    return (
      <div className="wr-editor">
        <div>
          {
            renderable &&
              <RichTextEditor
                value={editorState}
                onChange={this.onChange}
                toolbarConfig={this.editorConf}
                className={classNames('wr-editor-instance', { 'read-only': !canAdmin || !editMode })}
                readOnly={!canAdmin || !editMode}
                customControls={[
                  <ButtonGroup key={2}>
                    <IconButton
                      label="Edit Markdown"
                      iconName="remove-link"
                      focusOnClick={false}
                      className={classNames('markdown-button', {active: this.state.markdownEdit})}
                      onClick={() => { this.setState({ markdownEdit: !this.state.markdownEdit}); }}
                    />
                  </ButtonGroup>
                ]} />
          }
        </div>
        {
          editMode &&
            <div className="editor-button-row">
              <Button onClick={this.props.cancel}>Cancel</Button>
              <Button bsStyle={this.props.success ? 'success' : 'default'} onClick={this._save}>
                { this.props.success ? 'Saved..' : 'Save' }
              </Button>
            </div>
        }
        {
          editMode && this.state.markdownEdit &&
            <textarea
              className={classNames('markdown-editor', { visible: this.state.markdownEdit })}
              onChange={this._onChangeSource}
              value={this.state.editorState.toString(this.method)} />
        }
      </div>
    );
  }
}

export default WYSIWYG;