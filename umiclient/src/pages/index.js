import React, { Component } from 'react';
import { connect } from 'dva';
import axios from 'axios';
import styles from './index.css';
import logo from '../assets/logo.png';
import { Button, Input, Table, Spin } from 'antd';
const pagination = {
  defaultPageSize: 3,
};
// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    name: record.name,
  }),
};
class Home extends Component {
  state = {
    url: 'http://',
    titleboxStatus: true,
    screenshotUrl: '',
    convertWebsiteTitle: '',
    tabledata: [],
    loading: true,
  };
  columns = [
    {
      title: '文件名',
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: '网页地址',
      key: 'url',
      dataIndex: 'url',
    },
    {
      title: '操作',
      render: (text, record, index) => (
        <span>
          <Button type="link" onClick={this.downloadfile.bind(this, record, index)}>
            下载
          </Button>
        </span>
      ),
    },
  ];
  downloadfile = (record, index) => {
    console.log(record, index);
    const a = document.createElement('a');
    a.href = 'http://localhost:7001/public/asketch/' + record.name;
    a.download = record.name;
    a.click();
  };
  handleUrlChange = e => {
    // console.log(e.target.value);
    this.setState({
      url: e.target.value,
    });
  };
  transfer = async () => {
    const { url } = this.state;
    this.setState({
      loading: true,
    });
    const that = this;
    console.log('【待转换网址】', url);
    await axios
      .post('http://localhost:7001/gosketch/getfile', {
        url,
      })
      .then(res => {
        console.log(res);
        const newfile = {
          key: (that.state.tabledata.length + 1).toString(),
          name: res.data.asketchfile,
          url: res.data.websiteUrl,
        };
        const newdata = [newfile, ...that.state.tabledata];
        that.setState({
          screenshotUrl: res.data.screenshot,
          titleboxStatus: false,
          convertWebsiteTitle: res.data.websiteTitle,
          tabledata: newdata,
          loading: false,
        });
      });
  };
  render() {
    const { url, titleboxStatus, screenshotUrl, convertWebsiteTitle, tabledata } = this.state;
    const screenshot_picUrl =
      screenshotUrl === '' ? '' : 'http://localhost:7001/public/screenshot/' + screenshotUrl;
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
          <div className={styles.titlebox} hidden={!titleboxStatus}>
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
          <div className={styles.showbox} hidden={titleboxStatus}>
            <div className={styles.showboxleft}>
              <div className={styles.showboxleft_title}>
                <p>预览</p>
              </div>
              <div className={styles.showboxleft_img}>
                <Spin spinning={this.state.loading} wrapperClassName={styles.spinWrapper}>
                  <img src={screenshot_picUrl} alt="预览图片" />
                </Spin>
              </div>
            </div>
            <div className={styles.showboxright}>
              <div className={styles.showboxright_titlebox}>
                <div className={styles.showboxright_titlebox_subtitle}>We Convert From</div>
                <div className={styles.showboxright_titlebox_maintitle}>{convertWebsiteTitle}</div>
              </div>
              <div className={styles.showboxright_tablebox}>
                <Spin spinning={this.state.loading}>
                  <Table
                    rowSelection={rowSelection}
                    columns={this.columns}
                    dataSource={tabledata}
                    pagination={pagination}
                  />
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
