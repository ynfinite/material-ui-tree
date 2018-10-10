import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MuiTreeLeaf from './tree-leaf';
import TreeBranchChildrenPage from './tree-branch-children-page';
import styles from './style';

class MuiTreeBranch extends React.Component {
 
  static propTypes = {
    classes: PropTypes.object.isRequired,
    layer: PropTypes.number.isRequired,
    className: PropTypes.string,
    data: PropTypes.any,
    expand: PropTypes.bool,
    chdIndex: PropTypes.array
  };

  static contextTypes = {
    tree: PropTypes.shape({
      childrenName: PropTypes.string,
      expandFirst: PropTypes.bool,
      expandAll: PropTypes.bool,
      requestChildrenData: PropTypes.func,
      childrenCountPerPage: PropTypes.number,
      initialState: PropTypes.shape(() => null),
      alwaysRequestChildData: PropTypes.bool,
      returnLastState: PropTypes.func,
      handleLeafClick: PropTypes.func
    })
  };

  static defaultProps = {
    className: '',
    data: {},
    expand: false,
    chdIndex: []
  };


  constructor(props, context) {
    super(props, context);
    const { layer } = props;
    const { expandFirst, expandAll, initialState } = context.tree;
    if (initialState !== undefined) {
      this.state = { ...initialState };
    } else {
      this.state = {
        expand: expandAll || (layer === 0 ? expandFirst : false),
        childrenPage: 0
      };
    }
  }

  state = {
    expand: false,
    childrenPage: 0
  };

  componentWillUnmount() {
    const { returnLastState } = this.context.tree;
    if (returnLastState && typeof requestChildrenData === 'function') {
      returnLastState(this.state);
    }
  }

  getChildren() {
    const { data } = this.props;
    const { childrenName } = this.context.tree;
    return data[childrenName] || [];
  }

  doExpand = () => {
    this.setState(({ expand }) => ({
      expand: !expand
    }));
  };

  handleClick = () => {
    const { expand } = this.state;
    const { alwaysRequestChildData, handleLeafClick, overrideClasses } = this.context.tree;
    const { data, chdIndex } = this.props;
    
    if (!expand) { // 即将展开
      if (alwaysRequestChildData || this.getChildren().length === 0) { // 没有子节点
        const { requestChildrenData } = this.context.tree;
        if (requestChildrenData && typeof requestChildrenData === 'function') { // 通过配置的方法请求数据
          requestChildrenData(data, chdIndex, this.doExpand);
        } else { // 无子节点
          this.doExpand();
        }
      } else { // 有子节点 直接展开
        this.doExpand();
      }
      
      if (handleLeafClick && typeof handleLeafClick === 'function') {
        handleLeafClick(data, chdIndex, this.doExpand);
      }

    } else { // 将收起
      
      if (handleLeafClick && typeof handleLeafClick === 'function') {
        handleLeafClick(data, chdIndex, this.doExpand);
      }

      this.doExpand();
    }
  };

  loadMore = () => {
    this.setState(({ childrenPage }) => ({
      childrenPage: childrenPage + 1
    }));
  };

  renderChildrenByPage(page) {
    const { layer, chdIndex } = this.props;
    const { childrenCountPerPage } = this.context.tree;
    const children = this.getChildren();
    const startIndex = page * childrenCountPerPage;
    let endIndex = (page + 1) * childrenCountPerPage;
    endIndex = endIndex > children.length ? children.length : endIndex;
    const useChildren = children.slice(startIndex, endIndex);
    return (
      <TreeBranchChildrenPage
        key={`tree-branch-page-${page}`}
        data={useChildren}
        expand={this.state.expand}
        layer={layer}
        chdIndex={chdIndex}
        startIndex={startIndex}
      />
    );
  }

  renderChildren() {
    const { childrenPage } = this.state;
    const r = [];
    let index = 0;
    while (index <= childrenPage) {
      r.push(this.renderChildrenByPage(index));
      index += 1;
    }
    return r;
  }

  render() {
    const {
      classes,
      className,
      data,
      expand,
      layer,
      chdIndex
    } = this.props;
    const { childrenPage } = this.state;
    const { childrenCountPerPage, overrideClasses } = this.context.tree;
    const children = this.getChildren();
    const pageCount = Math.ceil(children.length / childrenCountPerPage);

    return (
      <Collapse in={expand} unmountOnExit>
        <List
          dense
          component='div'
          className={className}
          style={{ paddingLeft: layer > 0 ? 32 : 0 }}
        >
          <MuiTreeLeaf
            data={data}
            onClick={this.handleClick}
            expand={this.state.expand}
            layer={layer}
            chdIndex={chdIndex}
            doExpand={this.doExpand}
          />
          { this.renderChildren() }
          {
            this.state.expand && childrenPage + 1 < pageCount
              ? (
                <ListItem
                  dense
                  button
                  onClick={this.loadMore}
                  className={cn(classes.treeNode, { [overrideClasses.treeNode]: overrideClasses.treeNode })}
                  style={{ paddingLeft: 48 }}
                >
                  <ListItemIcon>
                    <MoreVertIcon
                      className={cn(classes.treeIcon, classes.treeIconButton, { [overrideClasses.treeIcon]: overrideClasses.treeIcon, [overrideClasses.treeIconButton]: overrideClasses.treeIconButton })}
                    />
                  </ListItemIcon>
                  <ListItemText
                    inset
                    disableTypography
                    primary={`已加载${(childrenPage + 1) * childrenCountPerPage}/${children.length}，点击加载更多...`}
                    className={cn(classes.treeText, classes.treeTextButton, { [overrideClasses.treeText]: overrideClasses.treeText, [overrideClasses.treeTextButton]: overrideClasses.treeTextButton })}
                  />
                </ListItem>
              )
              : null
          }
        </List>
      </Collapse>
    );
  }
}

export default withStyles(styles, { withTheme: true })(MuiTreeBranch);
