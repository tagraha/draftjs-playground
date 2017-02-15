import React from 'react'
class MediaComponent extends React.Component {
  render() {
    const {block, contentState} = this.props;
    const {foo} = this.props.blockProps;
    const data = contentState.getEntity(block.getEntityAt(0)).getData();
    return (
      <figure> or some other content using this data.</figure>
    )
  }
}
