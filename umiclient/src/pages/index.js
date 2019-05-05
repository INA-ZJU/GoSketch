import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './index.css';
import logo from '../assets/logo.png';
import { Button, Input } from 'antd';
class Home extends Component {
  state = {
    url: 'http://',
  };
  handleUrlChange = e => {
    // console.log(e.target.value);
    this.setState({
      url: 'http://' + e.target.value.substr(7),
    });
  };
  transfer = () => {
    console.log("【待转换网址】",this.state.url);
  };
  render() {
    const { url } = this.state;
    return (
      <div className={styles.backgroudbox}>
        <div className={styles.headerbox}>
          <div className={styles.logobox}>
            <img src={logo} alt="logo" />
          </div>
          <div className={styles.aboutbox}>
            <div className={styles.aboutus}>关于我们</div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.titlebox}>
            <div className={styles.maintitle}>GoSketch</div>
            <div className={styles.subtitle}>
              GoSketch是一款将网页转为sketch文件的工具，帮助设计师快速获得心仪的网页设计文件
            </div>
          </div>
          <div className={styles.handlebox}>
            <div className={styles.handleLR}>
              <Input
                placeholder="https://"
                value={url}
                allowClear
                size="large"
                onChange={this.handleUrlChange}
              />
              <Button
                type="primary"
                size="large"
                className={styles.handleBtn}
                onClick={this.transfer}
              >
                转换
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
