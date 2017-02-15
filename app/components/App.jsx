import React from 'react';
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  CompositeDecorator,
  AtomicBlockUtils
} from 'draft-js';

import MediaComponent from './custom'

export default class App extends React.Component {
  constructor (props) {
    super(props)

    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
    ]);

    this.state = {
      editor: false,
      editorState: EditorState.createEmpty(decorator)
    }
    this.onChange = this._onChange.bind(this)
    this.onBoldClick = this._onBoldClick.bind(this)

    this.onAddLink = this._addLink.bind(this)
    this.removeLink = this._removeLink.bind(this);

    //custom block style
    this.myBlockRendererFn = this._myBlockRendererFn.bind(this)

    //image
    this.confirmImage = this._confirmImage.bind(this)

    this.logState = this._logState.bind(this)
  }
  _onBoldClick () {
    this.onChange(RichUtils.toggleInlineStyle(
      this.state.editorState,
      'BOLD'
    ));
    setTimeout( () => this.refs.editor.focus() ,0)
  }
  _onChange (editorState) {
    this.setState({editorState})
  }
  _addLink () {
    const { editorState } = this.state
    const contentState = editorState.getCurrentContent();
    const contentSelection = editorState.getSelection();

    const start = contentSelection.getStartOffset()
    const end = contentSelection.getEndOffset()

    var anchorKey = contentSelection.getAnchorKey();
    var currentContentBlock = contentState.getBlockForKey(anchorKey);
    var selectedText = currentContentBlock.getText().slice(start, end);

    console.log('contentState -> ', contentState);
    console.log('getSelection -> ', this.state.editorState.getSelection().getEndOffset());
    console.log('selectedText -> ', selectedText);

    const contentStateWithEntity = contentState.createEntity(
      'LINK',
      'MUTABLE',
      {href: 'http://www.betotally.com'}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

    this.setState({
      editorState: RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    })

    setTimeout( () => {
      this.logState()
      this.refs.editor.focus()
    }, 0)
  }

  _removeLink(e) {
    e.preventDefault();
    const {editorState} = this.state;
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      this.setState({
        editorState: RichUtils.toggleLink(editorState, selection, null),
      });
    }
  }

  _logState() {
    const content = this.state.editorState.getCurrentContent();
    console.log(convertToRaw(content));
  };

  _confirmImage(e) {
    e.preventDefault();
    const {editorState, urlValue, urlType} = this.state;
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      'image',
      'IMMUTABLE',
      {src: 'http://res.cloudinary.com/betotally/image/upload/v1486889904/t4qfq4euk8t2vqbbpry2.jpg'}
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      {currentContent: contentStateWithEntity}
    );

    this.setState({
      editorState: AtomicBlockUtils.insertAtomicBlock(
        newEditorState,
        entityKey,
        ' '
      ),
      showURLInput: false,
      urlValue: '',
    }, () => {
      setTimeout(() => this.refs.editor.focus(), 0);
    });
  }

  _myBlockRendererFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === 'atomic') {
      return {
        component: MediaComponent,
        editable: true,
        props: {
         foo: 'bar',
        },
      };
    }
  }

  componentDidMount () {
    this.setState({ editor: true })
  }
  render() {
    return (
      <div id="content">
        <h5>Time to <a href="https://facebook.github.io/react/">React</a>.</h5>
        <button onClick={this.onBoldClick}>BOLD</button>
        <button onClick={this.onAddLink}>LINK</button>
        <button onClick={this.removeLink}>REMOVE LINK</button>
        <button onClick={this.confirmImage}>Image</button>
        {this.state.editor &&
          <Editor
            editorState={this.state.editorState}
            blockRendererFn={mediaBlockRenderer}
            onChange={this.onChange}
            ref='editor'
          />
        }
      </div>
    );
  }
}

function findLinkEntities(contentBlock, callback, contentState) {
  contentBlock.findEntityRanges(
    (character) => {
      const entityKey = character.getEntity();
      return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === 'LINK'
      );
    },
    callback
  );
}

function mediaBlockRenderer(block) {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false,
    };
  }

  return null;
}

const Link = (props) => {
  const {url} = props.contentState.getEntity(props.entityKey).getData();
  return (
    <a href={url} style={styles.link}>
      {props.children}
    </a>
  );
};

const Image = (props) => {
  return <img src={props.src} style={styles.media} width='200' height='200' />;
};

const Media = (props) => {
  const entity = props.contentState.getEntity(
    props.block.getEntityAt(0)
  );
  const {src} = entity.getData();
  const type = entity.getType();

  let media;
  if (type === 'image') {
    media = <Image src={src} />;
  }

  return media;
};

const styles = {
  root: {
    fontFamily: '\'Georgia\', serif',
    padding: 20,
    width: 600,
  },
  buttons: {
    marginBottom: 10,
  },
  urlInputContainer: {
    marginBottom: 10,
  },
  urlInput: {
    fontFamily: '\'Georgia\', serif',
    marginRight: 10,
    padding: 3,
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
  link: {
    color: '#3b5998',
    textDecoration: 'underline',
    fontSize: 14
  },
};
