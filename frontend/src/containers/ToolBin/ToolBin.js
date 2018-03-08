import React from 'react';
import { connect } from 'react-redux';

import { getPageCount } from 'store/selectors';

import { ToolBinUI } from 'components/controls';


const mapStateToProps = ({ app }) => {
  return {
    activeBrowser: app.getIn(['remoteBrowsers', 'activeBrowser']),
    open: app.getIn(['toolBin', 'open']),
    collSize: app.getIn(['collection', 'size']),
    pageCount: getPageCount(app)
  };
};

export default connect(
  mapStateToProps
)(ToolBinUI);
