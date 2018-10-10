import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline';
import styles from './style';

class MuiTreeLeaf extends React.Component {
  static defaultProps = {
    onClick: () => {},
    expand: false
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    chdIndex: PropTypes.array.isRequired,
    onClick: PropTypes.func,
    expand: PropTypes.bool,
    doExpand: PropTypes.func.isRequired
  };

  static contextTypes = {
    tree: PropTypes.shape({
      labelName: PropTypes.string,
      valueName: PropTypes.string,
      actionsAlignRight: PropTypes.bool,
      getActionsData: PropTypes.func,
      renderLabel: PropTypes.func
    })
  };

  state = {
    showButtons: true
  };

  getActions(data) {
    const { getActionsData, actionsAlignRight } = this.context.tree;
    const {
      classes,
      chdIndex,
      expand,
      doExpand
    } = this.props;
    if (getActionsData && typeof getActionsData === 'function') {
      const actionsData = getActionsData(data, chdIndex, expand, doExpand);
      if (actionsData && actionsData.length) {
        return actionsData.map((actionItem, actionIndex) => {
          const {
            icon,
            label,
            hint,
            onClick = () => {},
            style = {},
            ...rest
          } = actionItem;
          const useStyle = Object.assign({ marginLeft: 16 }, style);
          let ButtonComponent = null;
          if (label) {
            ButtonComponent = (
              <Button size='small'>
                {
                  icon
                    ? React.cloneElement(icon, {
                      style: { width: 12, height: 12 }
                    })
                    : null
                }
                {label}
              </Button>
            );
          } else if (icon) {
            ButtonComponent = <IconButton>{icon}</IconButton>;
          }
          if (ButtonComponent) {
            ButtonComponent = React.cloneElement(ButtonComponent, {
              color: 'primary',
              onClick: e => this.handleButtonClick(e, onClick),
              className: classes.button,
              style: useStyle,
              ...rest
            });
          }
          let WrappedButtonComponent = ButtonComponent;
          if (WrappedButtonComponent && hint) {
            WrappedButtonComponent = (
              <Tooltip
                title={hint}
                placement='bottom'
              >
                {ButtonComponent}
              </Tooltip>
            );
          }
          return WrappedButtonComponent
            ? React.cloneElement(WrappedButtonComponent, {
              key: `fab-list-item-${actionIndex + 1}`
            })
            : null;
        });
      }
    }
    return null;
  }

  getLabel() {
    const { data, expand } = this.props;
    const { labelName, renderLabel } = this.context.tree;
    if (renderLabel && typeof renderLabel === 'function') {
      return renderLabel(data, expand);
    }
    return data[labelName];
  }

  handleButtonClick = (e, onClick) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  render() {
    const {
      classes, data, onClick, expand
    } = this.props;
    const { valueName, actionsAlignRight, overrideClasses } = this.context.tree;

    return (
      <ListItem
        dense
        button
        className={cn(classes.treeNode, { [overrideClasses.treeNode]: overrideClasses.treeNode })}
        id={`tree-leaf-${data[valueName]}`}
        onClick={onClick}
      >
        <ListItemIcon>
          {
            expand
              ? (
                <RemoveIcon className={cn(classes.treeIcon, { [overrideClasses.treeIcon]: overrideClasses.treeIcon })} />
              )
              : (
                <AddIcon className={cn(classes.treeIcon, { [overrideClasses.treeIcon]: overrideClasses.treeIcon })} />
              )
          }
        </ListItemIcon>
        <ListItemText
          inset
          primary={this.getLabel()}
          className={cn(classes.treeText, {
            [classes.treeTextFlex]: actionsAlignRight,
            [overrideClasses.treeText]: overrideClasses.treeText
          })}
        />
        <div className={cn('leafActions', classes.leafActions, { [overrideClasses.leafActions]: overrideClasses.leafActions })}>
          { this.state.showButtons ? this.getActions(data) : null }
        </div>
      </ListItem>
    );
  }
}

export default withStyles(styles, { withTheme: true })(MuiTreeLeaf);
