import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MuiTreeBranch from './tree-branch';
import styles from './style';

class MuiTree extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    labelName: PropTypes.string,
    valueName: PropTypes.string,
    childrenName: PropTypes.string,
    data: PropTypes.object,
    title: PropTypes.string,
    expandFirst: PropTypes.bool,
    expandAll: PropTypes.bool,
    childrenCountPerPage: PropTypes.number,
    actionsAlignRight: PropTypes.bool,
    getActionsData: PropTypes.func,
    renderLabel: PropTypes.func,
    requestChildrenData: PropTypes.func,
    initialState: PropTypes.shape(() => null),
    alwaysRequestChildData: PropTypes.bool,
    returnLastState: PropTypes.func,
    handleLeafClick: PropTypes.func,
    overrideClasses: PropTypes.shape(() => null)
  };

  static childContextTypes = {
    tree: PropTypes.shape({
      labelName: PropTypes.string,
      valueName: PropTypes.string,
      childrenName: PropTypes.string,
      actionsAlignRight: PropTypes.bool,
      getActionsData: PropTypes.func,
      renderLabel: PropTypes.func,
      requestChildrenData: PropTypes.func,
      childrenCountPerPage: PropTypes.number,
      initialState: PropTypes.shape(() => null),
      alwaysRequestChildData: PropTypes.bool,
      returnLastState: PropTypes.func,
      handleLeafClick: PropTypes.func,
      overrideClasses: PropTypes.shape(() => null)
    })
  };

  static defaultProps = {
    className: '',
    labelName: 'label',
    valueName: 'value',
    childrenName: 'children',
    data: {},
    title: '',
    expandFirst: false,
    expandAll: false,
    childrenCountPerPage: 20,
    actionsAlignRight: false,
    getActionsData: null,
    renderLabel: null,
    requestChildrenData: null,
    initialState: undefined,
    alwaysRequestChildData: false,
    returnLastState: null,
    handleLeafClick: null,
    overrideClasses: {}
  };

  getChildContext() {
    const {
      labelName,
      valueName,
      childrenName,
      expandFirst,
      expandAll,
      actionsAlignRight,
      getActionsData,
      renderLabel,
      requestChildrenData,
      childrenCountPerPage,
      initialState,
      alwaysRequestChildData,
      returnLastState,
      handleLeafClick,
      overrideClasses
    } = this.props;
    return {
      tree: {
        labelName,
        valueName,
        childrenName,
        expandFirst,
        expandAll,
        actionsAlignRight,
        getActionsData,
        renderLabel,
        requestChildrenData,
        childrenCountPerPage,
        initialState,
        alwaysRequestChildData,
        returnLastState,
        handleLeafClick,
        overrideClasses
      }
    };
  }

  render() {
    const {
      classes,
      className,
      data,
      title
    } = this.props;

    return (
      <Paper className={cn(classes.paper, className)}>
        {
          title
            ? (
              <Typography variant='caption' className={classes.caption}>{title}</Typography>
            )
            : null
        }
        <MuiTreeBranch data={data} expand layer={0} />
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(MuiTree);
export getTreeLeafDataByIndexArray from '../utils/getTreeLeafDataByIndexArray';
