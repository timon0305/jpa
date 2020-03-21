import PropTypes from "prop-types";
import {CardHeader} from 'reactstrap'
import React from "react";

export default class CollapsibleCardHeader extends React.Component {
  static propTypes = {
    titleClass:PropTypes.string,
    isCollapsible:PropTypes.bool,
    isCollapsed: PropTypes.bool,
    toggle: PropTypes.func,
  };

  static defaultProps = {
    isCollapsed: false,
    titleClass: "card-title-big"
  };

  render(){
    return(
        <CardHeader>
          <strong className={this.props.titleClass}>{this.props.children}</strong>
          {
            this.props.isCollapsible && (<div className="card-header-actions">
              <a className="card-header-action btn btn-minimize" onClick={this.props.toggle}><i className={this.props.isCollapsed ? "icon-arrow-down" : "icon-arrow-up"}/></a>
            </div>)
          }
        </CardHeader>
    )
  }
}

/**
 * Card Header Component
 * @param isBigTitle
 * @param isCollapsible
 * @returns {{new(*=): {render: {(): *, (): React.ReactNode}, componentDidMount?(): void, shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean, componentWillUnmount?(): void, componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void, getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): (SS | null), componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void, componentWillMount?(): void, UNSAFE_componentWillMount?(): void, componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void, UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void, componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void, UNSAFE_componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void, setState<K extends keyof S>(state: (((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | Pick<S, K> | S | null), callback?: () => void): void, forceUpdate(callBack?: () => void): void, props: Readonly<{children?: React.ReactNode}> & Readonly<P>, state: Readonly<S>, context: any, refs: {[p: string]: React.ReactInstance}}, new(props: Readonly<P>): {render: {(): *, (): React.ReactNode}, componentDidMount?(): void, shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean, componentWillUnmount?(): void, componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void, getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): (SS | null), componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void, componentWillMount?(): void, UNSAFE_componentWillMount?(): void, componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void, UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void, componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void, UNSAFE_componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void, setState<K extends keyof S>(state: (((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | Pick<S, K> | S | null), callback?: () => void): void, forceUpdate(callBack?: () => void): void, props: Readonly<{children?: React.ReactNode}> & Readonly<P>, state: Readonly<S>, context: any, refs: {[p: string]: React.ReactInstance}}, new(props: P, context?: any): {render: {(): *, (): React.ReactNode}, componentDidMount?(): void, shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean, componentWillUnmount?(): void, componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void, getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): (SS | null), componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void, componentWillMount?(): void, UNSAFE_componentWillMount?(): void, componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void, UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void, componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void, UNSAFE_componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void, setState<K extends keyof S>(state: (((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | Pick<S, K> | S | null), callback?: () => void): void, forceUpdate(callBack?: () => void): void, props: Readonly<{children?: React.ReactNode}> & Readonly<P>, state: Readonly<S>, context: any, refs: {[p: string]: React.ReactInstance}}, prototype: {render: {(): *, (): React.ReactNode}, componentDidMount?(): void, shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean, componentWillUnmount?(): void, componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void, getSnapshotBeforeUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>): (SS | null), componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot?: SS): void, componentWillMount?(): void, UNSAFE_componentWillMount?(): void, componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void, UNSAFE_componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void, componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void, UNSAFE_componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void, setState<K extends keyof S>(state: (((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | Pick<S, K> | S | null), callback?: () => void): void, forceUpdate(callBack?: () => void): void, props: Readonly<{children?: React.ReactNode}> & Readonly<P>, state: Readonly<S>, context: any, refs: {[p: string]: React.ReactInstance}}}}
 */
export function cardHeader(isBigTitle, isCollapsible) {
  return class extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return(
        <CollapsibleCardHeader {...this.props} isCollapsible={isCollapsible} titleClass={isBigTitle ? 'card-title-big' : 'card-title-sm'} >{this.props.children}</CollapsibleCardHeader>
      )
    }
  }
}



